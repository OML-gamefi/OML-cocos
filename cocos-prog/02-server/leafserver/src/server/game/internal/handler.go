package internal

import (
	"github.com/name5566/leaf/gate"
	"github.com/name5566/leaf/log"
	"leafserver/src/server/model"
	"leafserver/src/server/msg"
	"reflect"
)

func init() {
	// 向当前模块（game 模块）注册 Hello 消息的消息处理函数 handleHello
	handler(&msg.GameMsg{}, handleGameMsg)
	handler(&msg.LoginMsg{}, handleLoginMsg)
	//skeleton.RegisterChanRPC("CloseAgent", handleCloseMsg)
}

func handler(m interface{}, h interface{}) {
	skeleton.RegisterChanRPC(reflect.TypeOf(m), h)
}

// 断开链接
func handleCloseMsg(args []interface{}) {
	model.HandleCloseMsg(args)
}

// 登录成功
func handleLoginMsg(args []interface{}) {
	model.HandleLoginMsg(args)
}

func handleGameMsg(args []interface{}) {
	// 收到的 Hello 消息
	gameMsg := args[0].(*msg.GameMsg)
	// 消息的发送者
	agent := args[1].(gate.Agent)

	// 输出收到的消息的内容
	log.Debug("gameMsg %v", gameMsg.Val)

	// 给发送者回应一个 Hello 消息
	agent.WriteMsg(&msg.GameMsg{
		Val: "return msg",
	})
}
