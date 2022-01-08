package api

import (
	"encoding/json"
	"fmt"
	"net/http"
)

var newStoriesIDs = "https://hacker-news.firebaseio.com/v0/newstories.json?print=pretty"
var newsInfos = "https://hacker-news.firebaseio.com/v0/item/%d.json?print=pretty"
var ids []int

//fetch the url and return the response in json format

func GetLatestNewsID() ([]int, error) {
	resp, err := http.Get(newStoriesIDs)
	if err != nil {
		return ids, err
	}
	defer resp.Body.Close()
	if resp.StatusCode != http.StatusOK {
		return ids, fmt.Errorf("request failed with status %s", resp.Status)
	}
	err = json.NewDecoder(resp.Body).Decode(&ids)
	if err != nil {
		return ids, err
	}
	return ids, nil
}

// https://hacker-news.firebaseio.com/v0/item/29851159.json?print=pretty
func FetchNews() {

	response, err := GetLatestNewsID()
	if err != nil {
		fmt.Println(err)
	}
	//for each id in the response, fetch the news from https://hacker-news.firebaseio.com/v0/item/29851159.json?print=pretty
	for _, id := range response {
		//		fmt.Println(id)
		resp, err := http.Get(fmt.Sprintf(newsInfos, id))
		if err != nil {
			fmt.Println(err)
		}
		defer resp.Body.Close()
		if resp.StatusCode != http.StatusOK {
			fmt.Println(fmt.Sprintf("request failed with status %s", resp.Status))
		}
		//print the response in json format
		var news struct {
			Title string `json:"title"`
			URL   string `json:"url"`
		}
		err = json.NewDecoder(resp.Body).Decode(&news)
		if err != nil {
			fmt.Println(err)
		}
		//this prints all the news
		// to do: print only the news that are relevant to the user
		fmt.Println(news.Title)
		fmt.Println(news.URL)

	}

	fmt.Println(response[0])
}
