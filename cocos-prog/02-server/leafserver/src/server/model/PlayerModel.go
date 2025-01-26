package model

import (
	"encoding/json"
	"fmt"
	"github.com/name5566/leaf/gate"
	"io/ioutil"
	"leafserver/src/server/conf"
	"leafserver/src/server/msg"
	"net/http"
)

func init() {

}

type LoginReq struct {
	Code    int              `json:"code"`
	Message string           `json:"message"`
	Data    []LoginCharacter `json:"data"`
}

type LoginCharacter struct {
	Name string `json:"name"`
	Id   int    `json:"id"`
}

var PlayerMap = make(map[int]*Player)

func SendMessage(accountId int, cmd string, message string) {
	player, ok := PlayerMap[accountId]
	if ok {
		agent := player.agent
		agent.WriteMsg(&msg.S2CMessage{Cmd: cmd, Message: message})
	}
}

// 离线
func HandleCloseMsg(args []interface{}) {
	a := args[0].(gate.Agent)
	userdata := a.UserData()
	// 尝试将 interface{} 变量转换为 int 类型
	if accountId, ok := userdata.(int); ok {
		_, ok := PlayerMap[accountId]
		if ok {
			LeaveMap(accountId)

			delete(PlayerMap, accountId)
		} else {
			fmt.Println("HandleCloseMsgError")
			fmt.Println(ok)
		}
	} else {
		fmt.Println("转换失败，interface{} 中存储的不是 int 类型")
	}

}

// 登录
func HandleLoginMsg(args []interface{}) {
	loginMsg := args[0].(*msg.C2SLoginMsg)
	go func() {
		// 创建HTTP客户端
		client := &http.Client{}
		url := conf.Server.CenterURL + conf.Server.Characters
		// 创建HTTP请求
		req, err := http.NewRequest("GET", url, nil)
		req.Header.Set("token", loginMsg.Token)
		req.Header.Set("device-id", loginMsg.DeviceId)
		req.Header.Set("device-name", loginMsg.DeviceName)
		req.Header.Set("service-code", "game")
		if err != nil {
			fmt.Print(err)
		} else {
			// 发送HTTP请求,token验证玩家是否登录成功
			resp, err := client.Do(req)
			if err != nil {
				fmt.Print(err)
			} else {
				defer resp.Body.Close()
				// 读取响应体
				body, err := ioutil.ReadAll(resp.Body)
				if err != nil {
					panic(err)
				} else {
					var loginReq LoginReq
					err := json.Unmarshal(body, &loginReq)
					if err != nil {
						fmt.Println("Error unmarshaling JSON:", err)
					} else {
						if loginReq.Code == 200 && loginReq.Message == "SUCCESS" {
							fmt.Println("登录成功，绑定账号")
							//消息的发送者
							agent := args[1].(gate.Agent)
							player := new(Player)
							player.agent = agent
							player.token = loginMsg.Token
							player.accountId = loginMsg.AccountId
							player.username = loginReq.Data[0].Name
							player.id = loginReq.Data[0].Id

							PlayerMap[loginMsg.AccountId] = player
							player.agent.SetUserData(loginMsg.AccountId)

							player.pushPlayer(true)
						} else {
							fmt.Println("获取角色错误")
							fmt.Println(loginReq)
						}
					}
				}
			}
		}
	}()

}
