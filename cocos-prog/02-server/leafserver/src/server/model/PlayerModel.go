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
	Code    int    `json:"code"`
	Message string `json:"message"`
}

var PlayerMap = make(map[int]*Player)
var AgentMap = make(map[*gate.Agent]int)

func SendMessage(accountId int, cmd string, message string) {
	player, ok := PlayerMap[accountId]
	if ok {
		agent := player.agent
		agent.WriteMsg(&msg.ClientMessage{Cmd: cmd, Message: message})
	}
}

func HandleCloseMsg(args []interface{}) {
	a := args[0].(gate.Agent)
	_, ok := AgentMap[&a]
	if ok {
		accountId := AgentMap[&a]
		delete(AgentMap, &a)
		delete(PlayerMap, accountId)
	}
}

func HandleLoginMsg(args []interface{}) {
	loginMsg := args[0].(*msg.LoginMsg)
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
					err := json.Unmarshal([]byte(string(body)), &loginReq)
					if err != nil {
						fmt.Println("Error unmarshaling JSON:", err)
					} else {
						if loginReq.Code == 200 && loginReq.Message == "SUCCESS" {
							fmt.Print("登录成功，绑定账号")
							// 消息的发送者
							agent := args[1].(gate.Agent)
							player := new(Player)
							player.agent = agent
							player.token = loginMsg.Token
							player.accountId = loginMsg.AccountId

							PlayerMap[loginMsg.AccountId] = player
							AgentMap[&agent] = loginMsg.AccountId

							SendMessage(player.accountId, "login", "13123123")
						} else {
							fmt.Print(loginReq)
						}
					}
				}
			}
		}
	}()

}
