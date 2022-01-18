const fs = require('fs');
const axios = require("axios").default;
const relevantTopics = ["privacy", "hack", "linux", "golang", "hacker", "malware", "exploit", "leak", "CIA", "NSA", "hacked", "breaches", "breached", "security", "OSINT", "leaked", "GNU", "free and open source", "open source"]

const getLatestNewsIds = async () =>{
    try{
        let idsArray = []
        const response = await axios.get(
            "https://hacker-news.firebaseio.com/v0/newstories.json?print=pretty"
        );
        for (let i = 0; i < response.data.length; i++) {
            idsArray.push(response.data[i])
        }
        return idsArray
    } catch (err) {
        return err;
    }
};

const checkIfNewsIsRelevant = async (news) => {
    let relevantNews = []
    for (let i = 0; i < news.length; i++) {
        let relevant = false
        for (let j = 0; j < relevantTopics.length; j++) {
            if (news[i].title.toLowerCase().includes(relevantTopics[j]) && news[i].url != undefined) {
                relevant = true
            }
        }
        relevant ? relevantNews.push(news[i]) : null
    }
    return relevantNews
}

const fetchRelevantNews = async () => {
    try {
        const newsID = await getLatestNewsIds()
        let news = []
        for (let i = 0; i < newsID.length; i++) {
            const newsLink = "https://hacker-news.firebaseio.com/v0/item/" + newsID[i] + ".json?print=pretty"
            const response = await axios.get(
                newsLink
            );
            news.push(response.data)
        }
        let relevantNews = await checkIfNewsIsRelevant(news)
        return relevantNews
    } catch (err) {
        return err;
    }
};

const checkIfNewsIsInJson = async () => {
    let relevantNews = await fetchRelevantNews()
    let newsToBeAdded = []
    let newsInJson = fs.readFileSync('./news.json', 'utf8')

    for (let i = 0; i < relevantNews.length; i++) {
        if (!newsInJson.includes(relevantNews[i].title)) {
            newsToBeAdded.push(relevantNews[i])
        }
        await addNewsToJson(newsToBeAdded)
    }
    return newsToBeAdded
}

const addNewsToJson = async (newsToBeAdded) => {
    let newsInJson = fs.readFileSync('./news.json', 'utf8')
    let news = JSON.parse(newsInJson)
    newsToBeAdded.forEach(newsToAdd => {
        news.push(newsToAdd)
    });
    fs.writeFileSync('./news.json', JSON.stringify(news))
}

module.exports = {
    checkIfNewsIsInJson,
};

