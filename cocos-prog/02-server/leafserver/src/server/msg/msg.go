package msg

import (
	"github.com/name5566/leaf/network/json"
	"time"
)

//var Processor network.Processor

// 使用默认的 JSON 消息处理器（默认还提供了 protobuf 消息处理器）
var Processor = json.NewProcessor()

const ERROR_TOKEN = 1

func init() {
	// 这里我们注册了一个 JSON 消息 GameMsg
	Processor.Register(&C2SGameMsg{})
	Processor.Register(&C2SLoginMsg{})
	Processor.Register(&C2SMovePlayer{}) //地图移动
	Processor.Register(&C2SSavePos{})
	Processor.Register(&C2SMaillAll{})
	Processor.Register(&C2SHeart{})
	Processor.Register(&C2SMailReward{})
	Processor.Register(&C2SMailDelete{})

	//返回客户端消息
	Processor.Register(&S2CMessage{})
	Processor.Register(&S2CAccount{})
	Processor.Register(&S2CItem{})

	Processor.Register(&S2CEnterMap{})
	Processor.Register(&S2CEnterLeave{})
	Processor.Register(&S2CError{})

	Processor.Register(&S2CMailAll{})

	Processor.Register(&S2CHeart{})
}

// 一个结构体定义了一个 JSON 消息的格式
// 消息名为 GameMsg
type C2SGameMsg struct {
	Val string
}

type C2SHeart struct {
}

type S2CHeart struct {
	Timestamp int64
	Time      time.Time
}

type C2SMaillAll struct {
	Token string
}

type C2SMailDelete struct {
	Token string
	Mails []int
}

type C2SMailReward struct {
	Token string
	Mails []int
}

type C2SSavePos struct {
	AccountId int
	NationId  int
	CurrentX  float64
	CurrentY  float64
	Token     string
}

type C2SLoginMsg struct {
	AccountId  int
	DeviceId   string
	DeviceName string
	Token      string
}

type C2SMovePlayer struct {
	AccountId int
	CurrentX  float64
	CurrentY  float64
	TargetX   float64
	TargetY   float64
	Name      string
	Token     string
}

type S2CError struct {
	Error int
}

type S2CMessage struct {
	Cmd     string
	Message string
}

type S2CAccount struct {
	Cmd             string
	Id              int
	Name            string
	Exp             int
	Race            string
	IsLogin         bool
	Current_hp      int
	Current_mp      int
	Current_stamina int64
}

type S2CItem struct {
	Cmd   string
	Items interface{}
}

type S2CEnterMap struct {
	Cmd       string
	AccountId int
	Posx      float64
	Posy      float64
	Race      string
	Name      string
	NationId  int
	Ismove    bool
	TargetX   float64
	TargetY   float64
	IsLogin   bool
}

type S2CEnterLeave struct {
	Cmd       string
	AccountId int
}

type S2CMailAll struct {
	Mails interface{}
}
