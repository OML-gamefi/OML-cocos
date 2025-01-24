package redis

import (
	"fmt"
	"github.com/gomodule/redigo/redis"
	"leafserver/src/server/conf"
	"leafserver/src/server/gamelog"
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
func ConnectRedis() {
	once.Do(func() {
		fmt.Println(conf.Server.RedisIP)
		fmt.Println(conf.Server.RedisPass)
		RedisPool = NewClient(conf.Server.RedisIP, conf.Server.RedisPass, 0)
	})
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
				fmt.Println("redis error", err)
				gamelog.Error("redis conn 错误", err)
				return nil, err
			}
			return c, err
		},
	}

	fmt.Println("redis初始化成功")
	return rds
}

func (rds *RedisClient) Set(key string, val string) {
	conn := rds.Client.Get()
	conn.Do("Set", key, val)
}

// Get 获取 key 对应的 value
func (rds *RedisClient) Get(key string) string {
	conn := rds.Client.Get()
	result, err := redis.String(conn.Do("Get", key))
	if err != nil {
		fmt.Println(err)
		gamelog.Error("redis get 错误", err)
		return ""
	}
	return result
}

func CreateKey(keys ...string) string {
	key := ""
	for _, val := range keys {
		key += ":" + val
	}
	if len(key) > 0 {
		return key[1:]
	}
	return key
}
