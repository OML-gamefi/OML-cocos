package redis

import (
	"fmt"
	"github.com/gomodule/redigo/redis"
	"sync"
	"time"
)

var once sync.Once

// RedisClient Redis 服务
type RedisClient struct {
	Client *redis.Pool
}

// Redis 全局 Redis
var RedisPool *RedisClient

// ConnectRedis 连接 redis 数据库，设置全局的 Redis 对象
func ConnectRedis(address string, password string, db int) {
	//once.Do(func() {
	RedisPool = NewClient(address, password, db)
	//})
	//con_err := RedisPool.Ping()
	//if con_err != nil {
	//	panic(con_err)
	//}
}

// NewClient 创建一个新的 redis 连接
func NewClient(address string, password string, db int) *RedisClient {
	// 初始化自定的 RedisClient 实例
	rds := &RedisClient{}
	// 使用 redis 库里的 NewClient 初始化连接
	rds.Client = &redis.Pool{
		MaxIdle:     100,  //最大空闲
		MaxActive:   1000, //最大连接
		IdleTimeout: time.Duration(60) * time.Second,
		Wait:        true,
		Dial: func() (redis.Conn, error) {
			c, err := redis.Dial(
				"tcp",
				address,
				redis.DialPassword(password),
				redis.DialDatabase(int(db)),
				redis.DialConnectTimeout(time.Duration(60)*time.Second),
				redis.DialReadTimeout(time.Duration(60)*time.Second),
				redis.DialWriteTimeout(time.Duration(60)*time.Second),
			)
			if err != nil {
				return nil, err
			}
			return c, err
		},
	}
	return rds
}

// Get 获取 key 对应的 value
func (rds *RedisClient) Get(key string) string {
	conn := rds.Client.Get()
	defer conn.Close()
	result, err := redis.String(conn.Do("Get", key))
	if err != nil {
		fmt.Print(err)
		return ""
	}
	return result
}
