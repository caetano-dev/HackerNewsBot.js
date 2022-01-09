package api

import (
	"encoding/json"
	"fmt"
	"net/http"
	"strings"

	u "hackernewsbot/utils"

	tgbotapi "github.com/go-telegram-bot-api/telegram-bot-api/v5"
)

var relevantTopics = []string{"privacy", "hack", "linux", "golang", "hacker", "malware", "exploit", "leak", "CIA", "NSA", "hacked", "breaches", "breached", "security", "OSINT", "leaked"}
var newStoriesIDs = "https://hacker-news.firebaseio.com/v0/newstories.json?print=pretty"
var newsInfos = "https://hacker-news.firebaseio.com/v0/item/%d.json?print=pretty"
var ids []int

type news struct {
	Title string `json:"title"`
	URL   string `json:"url"`
}

//GetLatestNewsID returns the latest news id
func GetLatestNewsID() ([]int, error) {
	resp, err := http.Get(newStoriesIDs)
	if err != nil {
		return ids, err
	}
	defer resp.Body.Close()
	if resp.StatusCode != http.StatusOK {
		return ids, fmt.Errorf("Error %s", resp.Status)
	}
	err = json.NewDecoder(resp.Body).Decode(&ids)
	if err != nil {
		return ids, err
	}
	return ids, nil
}

// FetchNews returns the news titles and urls
func FetchNews(update tgbotapi.Update) {
	bot, err := u.Login()

	u.HandleError(err)

	response, err := GetLatestNewsID()
	u.HandleError(err)

	news := news{}

	for _, id := range response {
		resp, err := http.Get(fmt.Sprintf(newsInfos, id))
		u.HandleError(err)
		defer resp.Body.Close()

		if resp.StatusCode != http.StatusOK {
			fmt.Println(fmt.Sprintf("Error %s", resp.Status))
		}
		err = json.NewDecoder(resp.Body).Decode(&news)
		u.HandleError(err)
		for _, topic := range relevantTopics {
			if news.Title != "" && news.URL != "" {
				if strings.Contains(strings.ToLower(news.Title), topic) {

					//to do: save the news in json file

					msg := tgbotapi.NewMessage(update.Message.Chat.ID, news.Title+"\n"+news.URL)
					bot.Send(msg)
				}
			}
		}
	}
}
