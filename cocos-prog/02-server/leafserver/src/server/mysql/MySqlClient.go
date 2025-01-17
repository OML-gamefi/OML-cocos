package mysql

import (
	"database/sql"
	"fmt"
	_ "github.com/go-sql-driver/mysql"
	"leafserver/src/server/conf"
	"sync"
	"time"
)

var once sync.Once

type MysqlDB struct {
	DB *sql.DB
}

var SELECT_PLAYER_SQL = "select account_id,race,name from characters where account_id="
var MysqlClient *MysqlDB

func Connect() {
	once.Do(func() {
		DB, err := sql.Open("mysql", conf.Server.MYSQL)
		if err != nil {
			fmt.Print("mysql err", err)
		} else {
			//DB.SetConnMaxLifetime(time.Minute * 5) // 连接最大生命周期
			DB.SetMaxOpenConns(50) // 最大连接数
			DB.SetMaxIdleConns(10) // 最大空闲连接数
			error := DB.Ping()
			if error != nil {
				return
			} else {
				MysqlClient = &MysqlDB{}
				MysqlClient.DB = DB
				go infiniteLoop()
			}
		}
	})
}

func infiniteLoop() {
	for {
		error := MysqlClient.DB.Ping()
		if error != nil {
			return
		}
		fmt.Print("sql ping")
		time.Sleep(15 * time.Second)
	}
}
