package conf

import (
	"encoding/json"
	"fmt"
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

	loadEnemy()
	loadItem()
	loadNation()
	loadRace()
}

type Enemy struct {
	Id         int `json:"id"`
	Hp         int `json:"hp"`
	Mp         int `json:"mp"`
	Atk        int `json:"atk"`
	MagAtk     int `json:"mag_atk"`
	Def        int `json:"def"`
	Mag_def    int `json:"mag_def"`
	Lv_hp      int `json:"lv_hp"`
	Lv_mp      int `json:"lv_mp"`
	Lv_mag_atk int `json:"lv_mag_atk"`
	Lv_def     int `json:"lv_def"`
	Lv_mag_def int `json:"lv_mag_def"`
}

var EnemyCfg = make(map[string]Enemy)

func loadEnemy() {
	data, err := ioutil.ReadFile("bin/conf/enemy.json")
	if err != nil {
		log.Fatal("%v", err)
	}
	err = json.Unmarshal(data, &EnemyCfg)
	if err != nil {
		log.Fatal("%v", err)
	} else {
		fmt.Println("加载enemy配置")
	}
}

type Item struct {
	Id int `json:"id"`
}

var ItemCfg = make(map[string]Item)

func loadItem() {
	data, err := ioutil.ReadFile("bin/conf/item.json")
	if err != nil {
		log.Fatal("%v", err)
	}
	err = json.Unmarshal(data, &ItemCfg)
	if err != nil {
		log.Fatal("%v", err)
	} else {
		fmt.Println("加载道具配置")
	}
}

type Nation struct {
	Id     int `json:"id"`
	Born_x int `json:"born_x"`
	Born_y int `json:"born_y"`
}

var NationCfg = make(map[string]Nation)

func loadNation() {
	data, err := ioutil.ReadFile("bin/conf/nation.json")
	if err != nil {
		log.Fatal("%v", err)
	}
	err = json.Unmarshal(data, &NationCfg)
	if err != nil {
		log.Fatal("%v", err)
	} else {
		fmt.Println("加载Nation配置")
	}
}

type Race struct {
	Id      int `json:"id"`
	Hp      int `json:"hp"`
	Mp      int `json:"mp"`
	Atk     int `json:"atk"`
	Mag_atk int `json:"mag_atk"`
	Def     int `json:"def"`
	Mag_def int `json:"mag_def"`
}

var RaceCfg = make(map[string]Race)

func loadRace() {
	data, err := ioutil.ReadFile("bin/conf/race.json")
	if err != nil {
		log.Fatal("%v", err)
	}
	err = json.Unmarshal(data, &RaceCfg)
	if err != nil {
		log.Fatal("%v", err)
	} else {
		fmt.Println("加载Race配置")
	}
}
