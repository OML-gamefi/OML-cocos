package model

import (
	"encoding/json"
	"fmt"
	"leafserver/src/server/msg"
	"leafserver/src/server/mysql"
	"strconv"
	"time"
)

type MailAttachments struct {
	Item_id  int `json:"item_id"`
	Quantity int `json:"quantity"`
}

type MailData struct {
	Id             int    `json:"id"`
	Sender_name    string `json:"sender_name"`
	Title          string `json:"title"`
	Content        string `json:"content"`
	Has_attachment int    `json:"has_attachment"`
	Attachments    string `json:"attachments"`
	Status         string `json:"status"`
	SendTime       int64  `json:"send_time"`
}

func getMails(p *Player) []MailData {
	var mails []MailData
	rows := mysql.Query(mysql.SELECT_MAILL_ALL, strconv.Itoa(p.id))
	if rows != nil {
		defer rows.Close()

		for rows.Next() {
			var id int
			var sender_name string
			var title string
			var content string
			var has_attachment int
			var attachments string
			var status string
			var send_time string
			//var mailData MailData
			if err := rows.Scan(&id, &sender_name, &title, &content, &has_attachment, &attachments, &status, &send_time); err != nil {
				//if err := rows.Scan(&mailData); err != nil {
				fmt.Println("Scan failed:", err)
				return mails
			}
			const layout = "2006-01-02 15:04:05"
			parsedTime, err := time.Parse(layout, send_time)
			if err != nil {
				fmt.Println("Error parsing date:", err)
				return mails
			}
			timestamp := parsedTime.Unix()
			mailData := MailData{
				Id:             id,
				Sender_name:    sender_name,
				Title:          title,
				Content:        content,
				Has_attachment: has_attachment,
				Attachments:    attachments,
				Status:         status,
				SendTime:       timestamp,
			}

			mails = append(mails, mailData)
			//fmt.Println(mailData)
		}
	}
	return mails
}

// 删除全部邮件
func MailDellAll(p *Player, rewardIds []int) {
	if len(rewardIds) > 0 {
		delete_sql := mysql.DELETE_MAIL_BY_ID

		for _, value := range rewardIds {
			delete_sql += " or id=" + strconv.Itoa(value)
		}

		_, err2 := mysql.MysqlClient.DB.Exec(delete_sql, strconv.Itoa(p.id))
		if err2 != nil {

		}
		PutMaillAll(p)
	}
}

// 领取邮件
func MailReward(p *Player, rewardIds []int) {
	if len(rewardIds) > 0 {
		mail_sql := mysql.SELECT_MAILL_BY_ID
		reward_sql := mysql.REWARD_MAIL_BY_ID

		for _, value := range rewardIds {
			mail_sql += " or id=" + strconv.Itoa(value)
			reward_sql += " or id=" + strconv.Itoa(value)
		}
		fmt.Println(mail_sql)
		rows := mysql.Query(mail_sql, strconv.Itoa(p.id))
		if rows != nil {
			defer rows.Close()

			rewardMap := make(map[int]*RewardData)
			for rows.Next() {
				var attachments string
				if err := rows.Scan(&attachments); err != nil {
					fmt.Println("Scan failed:", err)
					return
				}
				var attachmentsAry []MailAttachments
				err := json.Unmarshal([]byte(attachments), &attachmentsAry)
				if err != nil {
					return
				}
				for _, attval := range attachmentsAry {
					_, ok := rewardMap[attval.Item_id]
					if ok {
						rewardMap[attval.Item_id].Num += rewardMap[attval.Item_id].Num
					} else {
						newData := RewardData{
							Num:     attval.Quantity,
							Item_id: attval.Item_id,
						}
						rewardMap[attval.Item_id] = &newData
					}
				}
			}
			if len(rewardMap) > 0 {
				UpItems(p, rewardMap)
			}

			fmt.Println(reward_sql)
			_, err2 := mysql.MysqlClient.DB.Exec(reward_sql, strconv.Itoa(p.id))
			if err2 != nil {
				fmt.Println(err2)
				fmt.Println(2)
			}

			PutMaillAll(p)
		}
	}
}

func PutMaillAll(p *Player) {
	p.agent.WriteMsg(&msg.S2CMailAll{
		Mails: getMails(p),
	})
}
