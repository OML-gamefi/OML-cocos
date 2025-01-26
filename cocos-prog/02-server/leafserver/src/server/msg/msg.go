package msg

import (
	"github.com/name5566/leaf/network/json"
)

//var Processor network.Processor

// 使用默认的 JSON 消息处理器（默认还提供了 protobuf 消息处理器）
var Processor = json.NewProcessor()

func init() {
	// 这里我们注册了一个 JSON 消息 GameMsg
	Processor.Register(&C2SGameMsg{})
	Processor.Register(&C2SLoginMsg{})
	Processor.Register(&C2SMovePlayer{}) //地图移动

	//返回客户端消息
	Processor.Register(&S2CMessage{})
	Processor.Register(&S2CAccount{})
	Processor.Register(&S2CItem{})

	Processor.Register(&S2CEnterMap{})
}

// 一个结构体定义了一个 JSON 消息的格式
// 消息名为 GameMsg
type C2SGameMsg struct {
	Val string
}

type C2SLoginMsg struct {
	AccountId  int
	DeviceId   string
	DeviceName string
	Token      string
}

type C2SMovePlayer struct {
	AccountId int
	TargetX   float64
	TargetY   float64
}

type S2CMessage struct {
	Cmd     string
	Message string
}

type S2CAccount struct {
	Cmd  string
	Name string
	Exp  int
	Race string
}

type S2CItem struct {
	Cmd   string
	Items interface{}
}

type S2CEnterMap struct {
	Cmd       string
	AccountId int
	Posx      int
	Posy      int
	Race      string
	Name      string
	NationId  int
}

type S2CEnterLeave struct {
	Cmd       string
	AccountId int
}
