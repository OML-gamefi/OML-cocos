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

const SELECT_PLAYER_SQL = "select account_id,race,id,exp,current_location,current_hp,current_mp from characters where account_id = ?"

// 道具
const SELECT_PLAYER_ITEM = "select items from items where account_id = ?"
const INSERT_PLAYER_ITEM = "INSERT INTO items(account_id, items) VALUES(?, ?)"
const UPDATE_PLAYER_ITEM = "UPDATE users SET items = ? WHERE account_id = ?"

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
				fmt.Println("mysql初始化成功")
				go infiniteLoop()
			}
		}
	})
}

func Prepare(sql string) *sql.Stmt {
	stmt, err := MysqlClient.DB.Prepare(sql)
	if err != nil {
		return nil
	}
	return stmt
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
			//fmt.Println("sql ping")
			time.Sleep(15 * time.Second)
		}
	}
}
