package gate

import (
	"leafserver/src/server/game"
	"leafserver/src/server/msg"
)

func init() {
	// 这里指定消息 Hello 路由到 game 模块
	// 模块间使用 ChanRPC 通讯，消息路由也不例外
	msg.Processor.SetRouter(&msg.C2SGameMsg{}, game.ChanRPC)

	//登录
	msg.Processor.SetRouter(&msg.C2SLoginMsg{}, game.ChanRPC)

	msg.Processor.SetRouter(&msg.C2SMovePlayer{}, game.ChanRPC)
	msg.Processor.SetRouter(&msg.C2SSavePos{}, game.ChanRPC)
}
