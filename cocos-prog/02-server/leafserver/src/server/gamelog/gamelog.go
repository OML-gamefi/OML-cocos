package gamelog

import (
	"github.com/name5566/leaf/log"
	"leafserver/src/server/utils"
	l "log"
	"time"
)

type MyGameLog struct {
	logger *log.Logger
}

var myErrgamelog MyGameLog
var SaveFileTime time.Time

func init() {
	newErrFile()
}

func newErrFile() {
	myErrgamelog = MyGameLog{}
	logger, _ := log.New("error", "errorLog", l.LstdFlags)
	myErrgamelog.logger = logger
}

func Error(str string, a ...interface{}) {
	if SaveFileTime != utils.GetZeroTime() {
		myErrgamelog.logger.Close()
		newErrFile()
	}
	myErrgamelog.logger.Error(str, a)
}
