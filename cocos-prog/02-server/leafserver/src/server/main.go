package main

import (
	"github.com/name5566/leaf"
	lconf "github.com/name5566/leaf/conf"
	"leafserver/src/server/conf"
	"leafserver/src/server/game"
	"leafserver/src/server/gamelog"
	"leafserver/src/server/gate"
	"leafserver/src/server/login"
	"leafserver/src/server/model"
	"leafserver/src/server/mysql"
	"leafserver/src/server/redis"
	"leafserver/src/server/utils"
)

func main() {
	//初始化redis
	redis.ConnectRedis()
	//初始mysql
	mysql.Connect()

	gamelog.SaveFileTime = utils.GetZeroTime()

	model.Init()

	lconf.LogLevel = conf.Server.LogLevel
	lconf.LogPath = conf.Server.LogPath
	lconf.LogFlag = conf.LogFlag
	lconf.ConsolePort = conf.Server.ConsolePort
	lconf.ProfilePath = conf.Server.ProfilePath

	leaf.Run(
		game.Module,
		gate.Module,
		login.Module,
	)
}
