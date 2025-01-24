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
	x     int
	y     int
	mapId int
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

func LeaveMap(account_id int) {
	mapKey := redis.CreateKey("mappos", strconv.Itoa(account_id))
	mapdata := redis.RedisPool.Get(mapKey)
	if mapdata != "" {
		var keyVal MapPlayerData
		err := json.Unmarshal([]byte(mapdata), &keyVal)
		if err != nil {
			fmt.Println("玩家不在地图中")
		} else {
			mapId := keyVal.mapId
			if mapMap[mapId] != nil {
				mapMap[mapId].PlayerLeave(account_id)
			}
		}
	}
}

func EnterMap(player *Player, mapId int, x int, y int, isLogin bool) bool {
	//进入地图前先离开老地图
	if !isLogin {
		playerMap := GetPlayerMap(player.accountId)
		if playerMap != nil {
			oldId := playerMap.mapId
			if mapId != oldId {
				LeaveMap(player.accountId)
			}
		}
	}
	if mapMap[mapId] != nil {
		mapMap[mapId].PlayerEnter(player, x, y)
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
