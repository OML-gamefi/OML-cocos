package conf

import (
	"encoding/json"
	"github.com/name5566/leaf/log"
	"io/ioutil"
)

var Server struct {
	LogLevel    string `json:"logLevel,omitempty"`
	LogPath     string `json:"logPath,omitempty"`
	WSAddr      string `json:"WSAddr,omitempty"`
	CertFile    string `json:"certFile,omitempty"`
	KeyFile     string `json:"keyFile,omitempty"`
	TCPAddr     string `json:"TCPAddr,omitempty"`
	MaxConnNum  int    `json:"maxConnNum,omitempty"`
	ConsolePort int    `json:"consolePort,omitempty"`
	ProfilePath string `json:"profilePath,omitempty"`
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
