const fs = require('fs');
const axios = require("axios").default;

let newsID
let idsArray = []

const relevantTopics = ["privacy", "a", "the", "hack", "linux", "golang", "hacker", "malware", "exploit",
"leak", "CIA", "NSA", "hacked", "breaches", "breached", "security", "OSINT", "leaked", "GNUl", "free and open source","open source"]
const newsIDsLink = "https://hacker-news.firebaseio.com/v0/newstories.json?print=pretty"

const getLatestNewsIds = async () =>{
    try {
        const response = await axios.get(
            newsIDsLink
        );
        for (let i = 0; i < response.data.length; i++) {
            idsArray.push(response.data[i])
        }
        return idsArray
    } catch (error) {
        return error;
    }
};

const fetchNewsTitleAndURL = async () => {
    try {
        console.log("Fetching news...")
        const newsID = await getLatestNewsIds()
        let news = []
        //        for (let i = 0; i < newsID.length; i++) {
        for (let i = 0; i < 5; i++) {
            const newsLink = "https://hacker-news.firebaseio.com/v0/item/" + newsID[i] + ".json?print=pretty"
            const response = await axios.get(
                newsLink
            );
            news.push(response.data)
        }
        let relevantNews = checkIfNewsIsRelevant(news)
        console.log(relevantNews)

        return relevantNews
    } catch (error) {
        return error;
    }
};

function checkIfNewsIsRelevant(news) {
    console.log("Checking if news is relevant...")
    let relevantNews = []
    for (let i = 0; i < news.length; i++) {
        let relevant = false
        for (let j = 0; j < relevantTopics.length; j++) {
            if (news[i].title.toLowerCase().includes(relevantTopics[j])) {
                relevant = true
            }
        }
        if (relevant) {
            relevantNews.push(news[i])
        }
    }
    return relevantNews
}

module.exports = {
    fetchNewsTitleAndURL,
    getLatestNewsIds
};

