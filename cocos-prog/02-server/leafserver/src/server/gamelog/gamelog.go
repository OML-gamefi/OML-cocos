package gamelog

import (
	"github.com/name5566/leaf/log"
	l "log"
)

type MyGameLog struct {
	logger *log.Logger
}

var myErrgamelog MyGameLog

func init() {
	myErrgamelog = MyGameLog{}
	logger, _ := log.New("error", "errorLog", l.LstdFlags)
	myErrgamelog.logger = logger
}

func Error(str string, a ...interface{}) {
	myErrgamelog.logger.Error(str, a)
}
