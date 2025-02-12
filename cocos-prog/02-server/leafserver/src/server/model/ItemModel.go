package model

import (
	"strconv"
)

type RewardData struct {
	Num     int `json:"num"`
	Item_id int `json:"item_id"`
}

func UpItems(p *Player, itemMap map[int]*RewardData) {
	for _, attval := range itemMap {
		_, ok := p.Items[strconv.Itoa(attval.Item_id)]
		if ok {
			p.Items[strconv.Itoa(attval.Item_id)].Num += attval.Num
			if p.Items[strconv.Itoa(attval.Item_id)].Num < 0 {
				p.Items[strconv.Itoa(attval.Item_id)].Num = 0
			}
		} else {
			if attval.Num > 0 {
				p.Items[strconv.Itoa(attval.Item_id)] = &Item{
					Num: attval.Num,
				}
			}
		}
	}
	p.UpdataItem(p.Items)
}
