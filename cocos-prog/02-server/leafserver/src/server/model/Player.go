package model

import (
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
}

func (p *Player) PushItem() {
	//rows, err := mysql.MysqlClient.DB.Query(mysql.SELECT_PLAYER_ITEM, p.accountId)
	//if err != nil {
	//	fmt.Println("Query failed:", err)
	//	return
	//}
	//defer rows.Close()
	//for rows.Next() {
	//	fmt.Print(rows.Scan())
	//}
}

func (p *Player) pushPlayer() {
	row := mysql.QueryRow(mysql.SELECT_PLAYER_SQL, strconv.Itoa(p.accountId))
	if row != nil {
		var id int
		var race []uint8
		var account_id int
		var exp int
		err := row.Scan(&account_id, &race, &id, &exp)
		if err != nil {
			fmt.Print("玩家数据获取失败")
			fmt.Print(err)
			return
		}
		p.agent.WriteMsg(&msg.S2CAccount{Cmd: "ClentAccount", Name: p.username, Exp: exp})
	}
}
