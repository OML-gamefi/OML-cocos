package model

import (
	"encoding/json"
	"fmt"
	"github.com/name5566/leaf/gate"
	"leafserver/src/server/conf"
	"leafserver/src/server/msg"
	"leafserver/src/server/mysql"
	"leafserver/src/server/redis"
	"strconv"
)

type Player struct {
	agent            gate.Agent
	Token            string
	accountId        int
	id               int
	username         string
	race             string
	loaction         string
	current_loaction string
	X                float64
	Y                float64
	target_x         float64
	target_y         float64
	is_move          bool
	Items            map[string]*Item
	Current_stamina  int64
}

type Item struct {
	Num int `json:"num"`
}

func (p *Player) EnterMap(isLogin bool) {
	mapKey := redis.CreateKey("mappos", strconv.Itoa(p.accountId))
	mapdata := redis.RedisPool.Get(mapKey)
	if mapdata != "" {
		var mapPlayerData MapPlayerData
		err := json.Unmarshal([]byte(mapdata), &mapPlayerData)
		if err != nil {
			fmt.Println(err)
			return
		}
		EnterMap(p, mapPlayerData.MapId, mapPlayerData.X, mapPlayerData.Y, isLogin)
		p.X = mapPlayerData.X
		p.Y = mapPlayerData.Y
		p.current_loaction = strconv.Itoa(mapPlayerData.MapId)
	} else {
		if nation, ok := conf.NationCfg[p.loaction]; ok {
			EnterMap(p, nation.Id, nation.Born_x, nation.Born_y, isLogin)
			p.X = nation.Born_x
			p.Y = nation.Born_y
			p.current_loaction = strconv.Itoa(nation.Id)

			user := MapPlayerData{MapId: nation.Id, X: p.X, Y: p.Y}
			jsonData, err := json.Marshal(user)
			if err != nil {
				fmt.Println("Error marshaling JSON:", err)
				return
			}
			redis.RedisPool.Set(mapKey, string(jsonData))
		} else {
			fmt.Println("玩家地图不存在")
		}
	}
}

func (p *Player) UpdataItem(itemap map[string]*Item) {
	jsonData, err := json.Marshal(itemap)
	if err != nil {
		fmt.Println(err)
		fmt.Println(1)
		return
	}
	_, err2 := mysql.MysqlClient.DB.Exec(mysql.UPDATE_PLAYER_ITEM, jsonData, p.accountId)
	if err2 != nil {
		fmt.Println(err2)
		fmt.Println(2)
	}
	p.PushItem()
}

func (p *Player) GetItem() map[string]*Item {
	if p.Items != nil {
		return p.Items
	}
	row := mysql.QueryRow(mysql.SELECT_PLAYER_ITEM, strconv.Itoa(p.accountId))
	itemsstr := "{\"1000\":{\"num\":1}}"
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
	var items map[string]*Item
	err := json.Unmarshal([]byte(itemsstr), &items)
	if err != nil {
		panic(err)
		return nil
	}
	p.Items = items
	return items
}

func (p *Player) PushItem() {
	p.agent.WriteMsg(&msg.S2CItem{Cmd: "S2CItem", Items: p.GetItem()})
}

func (p *Player) pushPlayer(isLogin bool) {
	go func() {
		row := mysql.QueryRow(mysql.SELECT_PLAYER_SQL, strconv.Itoa(p.accountId))
		if row != nil {
			var id int
			var race string
			var account_id int
			var exp int
			var current_location string
			var current_hp int
			var current_mp int
			var current_stamina int64
			err := row.Scan(&account_id, &race, &id, &exp, &current_location, &current_hp, &current_mp, &current_stamina)
			if err != nil {
				fmt.Println("玩家数据获取失败")
				fmt.Println(err)
				return
			}
			p.race = race
			p.loaction = current_location
			p.Current_stamina = current_stamina
			p.agent.WriteMsg(&msg.S2CAccount{
				Cmd: "S2CAccount", Name: p.username, Exp: exp, Race: race, IsLogin: isLogin, Current_hp: current_hp, Current_mp: current_mp, Id: id,
				Current_stamina: current_stamina,
			})

			if isLogin {
				p.PushItem()
				p.EnterMap(true)
			}
		}
	}()

}
