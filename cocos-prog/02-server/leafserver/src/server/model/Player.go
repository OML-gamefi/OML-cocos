package model

import (
	"encoding/json"
	"fmt"
	"github.com/name5566/leaf/gate"
	"leafserver/src/server/msg"
	"leafserver/src/server/mysql"
	"strconv"
)

type Player struct {
	agent     gate.Agent
	token     string
	accountId int
	id        int
	username  string
	race      string
}

type Item struct {
	Num int `json:"num"`
}

func (p *Player) EnterMap() {
	//EnterMap(p)
}

func (p *Player) UpdataItem(itemap map[string]Item) {
	stmt := mysql.Prepare(mysql.UPDATE_PLAYER_ITEM)
	if stmt != nil {
		itemsstr, err := json.Marshal(itemap)
		if err != nil {
			_, err := stmt.Exec(itemsstr, p.accountId)
			if err != nil {
				fmt.Println(err)
			} else {
				stmt.Close()
			}
		}
	}
}

func (p *Player) GetItem() map[string]Item {
	row := mysql.QueryRow(mysql.SELECT_PLAYER_ITEM, strconv.Itoa(p.accountId))
	itemsstr := "{\"0\":{\"num\":0}}"
	if row != nil {
		err := row.Scan(&itemsstr)
		if err != nil {
			fmt.Println("插入新数据")
			stmt := mysql.Prepare(mysql.INSERT_PLAYER_ITEM)
			if stmt != nil {
				_, err := stmt.Exec(p.accountId, itemsstr)
				if err != nil {
					fmt.Println(err)
				} else {
					stmt.Close()
				}
			}
		}
	}
	var items map[string]Item
	err := json.Unmarshal([]byte(itemsstr), &items)
	if err != nil {
		panic(err)
		return nil
	}
	return items
}

func (p *Player) PushItem() {
	p.agent.WriteMsg(&msg.S2CItem{Cmd: "S2CItem", Items: p.GetItem()})
}

func (p *Player) pushPlayer() {
	row := mysql.QueryRow(mysql.SELECT_PLAYER_SQL, strconv.Itoa(p.accountId))
	if row != nil {
		var id int
		var race string
		var account_id int
		var exp int
		err := row.Scan(&account_id, &race, &id, &exp)
		if err != nil {
			fmt.Println("玩家数据获取失败")
			fmt.Println(err)
			return
		}
		p.race = race
		p.agent.WriteMsg(&msg.S2CAccount{Cmd: "S2CAccount", Name: p.username, Exp: exp, Race: race})
	}
}
