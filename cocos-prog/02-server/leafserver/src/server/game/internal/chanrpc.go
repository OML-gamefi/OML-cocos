package internal

import (
	"fmt"
)

func init() {
	skeleton.RegisterChanRPC("NewAgent", rpcNewAgent)
	skeleton.RegisterChanRPC("CloseAgent", rpcCloseAgent)
}

// 所有连接保存到这里
//var agentMap = make(map[int32]gate.Agent)

func rpcNewAgent(args []interface{}) {
	fmt.Println("rpcNewAgent")
	//agent := args[0].(gate.Agent)
	//fmt.Print(agent.UserData())
	//agentMap[agent.Us] = agent
}

func rpcCloseAgent(args []interface{}) {
	fmt.Println("rpcCloseAgent")
	//a := args[0].(gate.Agent)
	//_ = a
	handleCloseMsg(args)
}
