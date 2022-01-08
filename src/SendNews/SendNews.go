package FetchNews

//FetchNews is a function that fetches news from hackernews
import (
	"fmt"
	a "hackernewsbot/api"
)

var url = "https://hacker-news.firebaseio.com/v0/newstories.json?print=pretty"

func SendNews() {
	fmt.Println("Fetching news from hackernews")
	a.FetchNews()

}
