package mysql

import (
	"database/sql"
	"fmt"
	_ "github.com/go-sql-driver/mysql"
	"leafserver/src/server/conf"
	"leafserver/src/server/gamelog"
	"sync"
	"time"
)

var once sync.Once

type MysqlDB struct {
	DB *sql.DB
}

const SELECT_PLAYER_SQL = "select account_id,race,id,exp from characters where account_id = ?"
const SELECT_PLAYER_ITEM = "select item_id,quantity from inventory where account_id = ?"

var MysqlClient *MysqlDB

func Connect() {
	once.Do(func() {
		DB, err := sql.Open("mysql", conf.Server.MYSQL)
		if err != nil {
			fmt.Print("mysql err", err)
			gamelog.Error("mysql conn 错误:", err)
		} else {
			//DB.SetConnMaxLifetime(time.Minute * 5) // 连接最大生命周期
			DB.SetMaxOpenConns(50) // 最大连接数
			DB.SetMaxIdleConns(10) // 最大空闲连接数
			error := DB.Ping()
			if error != nil {
				gamelog.Error("mysql ping 错误:", err)
				return
			} else {
				MysqlClient = &MysqlDB{}
				MysqlClient.DB = DB
				go infiniteLoop()
			}
		}
	})
}

func QueryRow(sql string, val string) *sql.Row {
	Row := MysqlClient.DB.QueryRow(sql, val)
	return Row
}

func Query(sql string, val string) *sql.Rows {
	rows, err := MysqlClient.DB.Query(sql, val)
	if err != nil {
		fmt.Println("Query failed:", err)
		return nil
	}
	//defer rows.Close()

	return rows
}

func infiniteLoop() {
	for {
		error := MysqlClient.DB.Ping()
		if error != nil {
			gamelog.Error("mysql ping 错误:", error)
			//return
		} else {
			fmt.Print("sql ping")
			time.Sleep(15 * time.Second)
		}
	}
}
