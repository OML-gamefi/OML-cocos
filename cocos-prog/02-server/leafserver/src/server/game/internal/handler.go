package internal

import (
	"fmt"
	"github.com/name5566/leaf/gate"
	"github.com/name5566/leaf/log"
	"leafserver/src/server/model"
	"leafserver/src/server/msg"
	"reflect"
)

func init() {
	// 向当前模块（game 模块）注册 Hello 消息的消息处理函数 handleHello
	handler(&msg.C2SGameMsg{}, handleGameMsg)
	handler(&msg.C2SLoginMsg{}, handleLoginMsg)
	handler(&msg.C2SMovePlayer{}, handMovePlayerMsg)
	handler(&msg.C2SSavePos{}, handC2SSavePosMsg)
}

func checkToken(p *model.Player, token string) bool {
	if p.Token == token {
		return true
	} else {
		return false
	}
}

func getPlayer(accountId int) *model.Player {
	player, ok := model.PlayerMap[accountId]
	if ok {
		return player
	}
	return nil
}

func handler(m interface{}, h interface{}) {
	skeleton.RegisterChanRPC(reflect.TypeOf(m), h)
}

// 保存位置
func handC2SSavePosMsg(args []interface{}) {
	gameMsg := args[0].(*msg.C2SSavePos)
	agent := args[1].(gate.Agent)
	userdata := agent.UserData()
	// 尝试将 interface{} 变量转换为 int 类型
	if accountId, ok := userdata.(int); ok {
		player := getPlayer(accountId)
		if player != nil && checkToken(player, gameMsg.Token) {
			player, ok := model.PlayerMap[accountId]
			if ok {
				player.X = gameMsg.CurrentX
				player.Y = gameMsg.CurrentY
			}
		} else {
			agent.WriteMsg(&msg.S2CError{Error: msg.ERROR_TOKEN})
		}
	}
}

// 移动
func handMovePlayerMsg(args []interface{}) {
	gameMsg := args[0].(*msg.C2SMovePlayer)
	agent := args[1].(gate.Agent)
	userdata := agent.UserData()
	// 尝试将 interface{} 变量转换为 int 类型
	if accountId, ok := userdata.(int); ok {
		player := getPlayer(accountId)
		if player != nil && checkToken(player, gameMsg.Token) {
			model.MovePlayer(player, gameMsg.TargetX, gameMsg.TargetY, gameMsg.CurrentX, gameMsg.CurrentY)
		} else {
			agent.WriteMsg(&msg.S2CError{Error: msg.ERROR_TOKEN})
		}
	}
}

// 断开链接
func handleCloseMsg(args []interface{}) {
	model.HandleCloseMsg(args)
}

// 登录成功
func handleLoginMsg(args []interface{}) {
	fmt.Println("请求登录")
	model.HandleLoginMsg(args)
}

func handleGameMsg(args []interface{}) {
	// 收到的 Hello 消息
	gameMsg := args[0].(*msg.C2SGameMsg)
	// 消息的发送者
	agent := args[1].(gate.Agent)

	// 输出收到的消息的内容
	log.Debug("gameMsg %v", gameMsg.Val)

	// 给发送者回应一个 Hello 消息
	agent.WriteMsg(&msg.C2SGameMsg{
		Val: "return msg",
	})
}
