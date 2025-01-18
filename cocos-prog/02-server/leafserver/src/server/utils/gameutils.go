package utils

import "time"

func GetZeroTime() time.Time {
	// 获取当前时间
	now := time.Now()

	// 提取年、月、日信息
	year, month, day := now.Date()

	return time.Date(year, month, day, 0, 0, 0, 0, now.Location())
}
