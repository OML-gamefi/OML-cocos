package model

import (
	"encoding/json"
	"fmt"
	"github.com/name5566/leaf/log"
	"leafserver/src/server/conf"
	"leafserver/src/server/redis"
	"runtime/debug"
	"strconv"
)

var mapMap = make(map[int]Map)

type MapPlayerData struct {
	X     float64 `json:"x"`
	Y     float64 `json:"y"`
	MapId int     `json:"mapid"`
}

func Init() {
	maps := conf.NationCfg
	for _, value := range maps {
		m := CreateMap(value.Id)
		mapMap[m.GetId()] = m
	}

	fmt.Println("初始化所有地图")
}

func CreateMap(mapId int) Map {
	m := &IMap{Id: mapId}
	m.init()
	return m
}

func GetPlayerMap(account_id int) *MapPlayerData {
	mapKey := redis.CreateKey("mappos", strconv.Itoa(account_id))
	mapdata := redis.RedisPool.Get(mapKey)
	if mapdata != "" {
		var keyVal MapPlayerData
		err := json.Unmarshal([]byte(mapdata), &keyVal)
		if err != nil {
			fmt.Println("玩家不在地图中")
		} else {
			return &keyVal
		}
	}
	return nil
}

func MovePlayer(p *Player, TargetX float64, TargetY float64, CurrentX float64, CurrentY float64) {
	current_loaction := p.current_loaction
	mapId, err := strconv.Atoi(current_loaction)
	if err != nil {
		fmt.Println(err)
	} else {
		if mapMap[mapId] != nil {
			mapMap[mapId].PlayerMove(p.accountId, TargetX, TargetY, CurrentX, CurrentY)
		}
	}
}

func LeaveMap(account_id int) {
	mapKey := redis.CreateKey("mappos", strconv.Itoa(account_id))
	mapdata := redis.RedisPool.Get(mapKey)
	if mapdata != "" {
		var keyVal MapPlayerData
		err := json.Unmarshal([]byte(mapdata), &keyVal)
		if err != nil {
			fmt.Println("玩家不在地图中")
		} else {
			mapId := keyVal.MapId
			if mapMap[mapId] != nil {
				mapMap[mapId].PlayerLeave(account_id)
				fmt.Println("离开地图" + strconv.Itoa(account_id))
				fmt.Println("地图id:" + strconv.Itoa(mapId) + " 剩余人数：" + strconv.Itoa(mapMap[mapId].GetPlayerNum()))
			} else {
				fmt.Println("玩家所在地图不存在")
			}
		}
	} else {
		fmt.Println("玩家无地图数据" + strconv.Itoa(account_id))
	}
}

func EnterMap(player *Player, mapId int, x float64, y float64, isLogin bool) bool {
	//进入地图前先离开老地图
	if !isLogin {
		playerMap := GetPlayerMap(player.accountId)
		if playerMap != nil {
			oldId := playerMap.MapId
			if mapId != oldId {
				LeaveMap(player.accountId)
			}
		}
	}
	if mapMap[mapId] != nil {
		mapMap[mapId].PlayerEnter(player, x, y)

		if isLogin {
			//登录地图，把地图上的玩家推送出去
			if mapMap[mapId] != nil {
				mapMap[mapId].PushPlayerEnter(player)
			}
		}
	} else {
		//地图不存在
		fmt.Println(strconv.Itoa(mapId) + "地图不存在")
		return false
	}

	return true
}

func GetMap(mapId int) Map {
	if mapId == 0 {
		log.Debug("地图编号为：0  %s", debug.Stack())
		return nil
	}
	return mapMap[mapId]
}

func GetPlayerCount() int {
	count := int(0)
	for _, v := range mapMap {
		count += v.GetPlayerNum()
	}
	return count
}
