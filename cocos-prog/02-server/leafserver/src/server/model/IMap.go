package model

type IMap struct {
	Id        int64
	Instances map[int]string //accountid
}

func (m *IMap) init() {

}

func (m *IMap) GetPlayerNum() int {
	return len(m.Instances)
}

func (m *IMap) PlayerEnter(player Player, instanceId string, x int32, y int32) {
	//通知切换地图

}

func (m *IMap) GetId() int64 {
	return m.Id
}

type Map interface {
	init()
	GetId() int64
	GetPlayerNum() int
	PlayerEnter(player Player, instanceId string, x int32, y int32)
}
