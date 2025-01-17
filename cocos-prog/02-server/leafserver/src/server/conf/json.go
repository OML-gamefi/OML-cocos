package conf

import (
	"encoding/json"
	"github.com/name5566/leaf/log"
	"io/ioutil"
)

var Server struct {
	LogLevel    string
	LogPath     string
	WSAddr      string
	CertFile    string
	KeyFile     string
	TCPAddr     string
	MaxConnNum  int
	CenterURL   string
	Characters  string //请求玩家信息
	MYSQL       string
	RedisIP     string
	RedisPass   string
	RedisDB     int
	ConsolePort int
	ProfilePath string
}

func init() {
	data, err := ioutil.ReadFile("bin/conf/server.json")
	if err != nil {
		log.Fatal("%v", err)
	}
	err = json.Unmarshal(data, &Server)
	if err != nil {
		log.Fatal("%v", err)
	}
}
