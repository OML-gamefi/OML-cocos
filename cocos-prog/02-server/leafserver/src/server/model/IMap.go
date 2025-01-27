package model

import "leafserver/src/server/msg"

type IMap struct {
	Id        int
	Instances map[int]*Player //accountid
}

func (m *IMap) init() {
	m.Instances = make(map[int]*Player)
}

func (m *IMap) GetPlayerNum() int {
	return len(m.Instances)
}

func (m *IMap) PlayerMove(account_id int, x float64, y float64, CurrentX float64, CurrentY float64) {
	for _, value := range m.Instances {
		value.agent.WriteMsg(&msg.C2SMovePlayer{AccountId: account_id, TargetX: x, TargetY: y, CurrentX: CurrentX, CurrentY: CurrentY})
		if value.accountId == account_id {
			value.target_x = x
			value.target_y = y
			value.is_move = true
		}
	}
}

func (m *IMap) PlayerLeave(account_id int) {
	if m.Instances[account_id] != nil {
		delete(m.Instances, account_id)

		for _, value := range m.Instances {
			value.agent.WriteMsg(&msg.S2CEnterLeave{
				Cmd:       "S2CEnterLeave",
				AccountId: account_id,
			})
		}
	}
}

func (m *IMap) PlayerEnter(player *Player, x float64, y float64) {
	//通知地图所有玩家，有角色进入地图
	m.Instances[player.accountId] = player
	for _, value := range m.Instances {
		value.agent.WriteMsg(&msg.S2CEnterMap{
			Cmd:       "S2CEnterMap",
			AccountId: player.accountId,
			Posx:      x,
			Posy:      y,
			Race:      player.race,
			Name:      player.username,
			NationId:  m.Id,
		})
	}
}

func (m *IMap) GetId() int {
	return m.Id
}

type Map interface {
	init()
	GetId() int
	GetPlayerNum() int
	PlayerEnter(player *Player, x float64, y float64)
	PlayerLeave(account_id int)
	PlayerMove(account_id int, x float64, y float64, CurrentX float64, CurrentY float64)
}
