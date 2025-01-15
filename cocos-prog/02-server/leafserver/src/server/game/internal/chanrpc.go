package internal

import (
	"fmt"
	"github.com/name5566/leaf/gate"
)

func init() {
	skeleton.RegisterChanRPC("NewAgent", rpcNewAgent)
	skeleton.RegisterChanRPC("CloseAgent", rpcCloseAgent)
}

func rpcNewAgent(args []interface{}) {
	fmt.Print("rpcNewAgent")
	a := args[0].(gate.Agent)
	_ = a
}

func rpcCloseAgent(args []interface{}) {
	fmt.Print("rpcCloseAgent")
	a := args[0].(gate.Agent)
	_ = a
}
