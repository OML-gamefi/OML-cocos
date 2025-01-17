package msg

import (
	"github.com/name5566/leaf/network/json"
)

//var Processor network.Processor

// 使用默认的 JSON 消息处理器（默认还提供了 protobuf 消息处理器）
var Processor = json.NewProcessor()

func init() {
	// 这里我们注册了一个 JSON 消息 GameMsg
	Processor.Register(&GameMsg{})
	Processor.Register(&LoginMsg{})

	//返回客户端消息
	Processor.Register(&ClientMessage{})
}

// 一个结构体定义了一个 JSON 消息的格式
// 消息名为 GameMsg
type GameMsg struct {
	Val string
}

type LoginMsg struct {
	Token      string
	AccountId  int
	DeviceId   string
	DeviceName string
}

type ClientMessage struct {
	Cmd     string
	Message string
}
