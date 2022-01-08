package main

import (
	f "hackernewsbot/SendNews"
	"log"
	"os"

	tgbotapi "github.com/go-telegram-bot-api/telegram-bot-api/v5"
	"github.com/joho/godotenv"
)

func main() {
	error := godotenv.Load()
	if error != nil {
		log.Fatal("Error loading .env file")
	}

	bot, error := tgbotapi.NewBotAPI(os.Getenv("TOKEN"))
	if error != nil {
		log.Panic(error)
	}

	bot.Debug = true

	log.Printf("Authorized on account %s", bot.Self.UserName)

	u := tgbotapi.NewUpdate(0)
	u.Timeout = 60

	updates := bot.GetUpdatesChan(u)

	for update := range updates {
		if update.Message != nil {
			if update.Message.Text == "/start" {
				msg := tgbotapi.NewMessage(update.Message.Chat.ID, "message")
				//fetch news function goes here
				f.SendNews()
				bot.Send(msg)
			}

		}

	}
}
