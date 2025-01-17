package model

import (
	"github.com/name5566/leaf/log"
	"runtime/debug"
)

var mapMap = make(map[int64]Map)

func Init() {

}

func CreateMap(mapId int64) Map {
	m := &IMap{Id: mapId}
	m.init()
	return m
}

func GetMap(mapId int64) Map {
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
