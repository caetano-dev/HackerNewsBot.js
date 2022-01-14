const fs = require('fs');
const axios = require("axios").default;

let newsID

const relevantTopics = ["privacy", "a", "the", "hack", "linux", "golang", "hacker", "malware", "exploit",
"leak", "CIA", "NSA", "hacked", "breaches", "breached", "security", "OSINT", "leaked", "GNUl", "free and open source","open source"]
const newsIDsLink = "https://hacker-news.firebaseio.com/v0/newstories.json?print=pretty"

//get the latest news id
const getLatestNewsIds = async () =>{

    let idsArray = []
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

//check if the news is relevant
const checkIfNewsIsRelevant = async (news) => {
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

//get the relevant news
const fetchRelevantNews = async () => {
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
        let relevantNews = await checkIfNewsIsRelevant(news)
        //console.log(relevantNews)

        return relevantNews
    } catch (error) {
        return error;
    }
};


//check if the relevant news are already in the json file
const checkIfNewsIsInJson = async () => {
    let relevantNews = await fetchRelevantNews()
    let newsToBeAdded = []
    console.log("Checking if news is in json...")
    let newsInJson = fs.readFileSync('./news.json', 'utf8')
    console.log("news is json are " + newsInJson)

    for (let i = 0; i < relevantNews.length; i++) {
        //open the news.json file and check if the news is already in the file
        //if not, add it to the newsToBeAdded array
        //if yes, do nothing

        if (newsInJson.includes(relevantNews[i].title)) {
            console.log(relevantNews[i].title + " is already in the json file")
        } else {
            newsToBeAdded.push(relevantNews[i])
        }
    }
    return newsToBeAdded
}


module.exports = {
    fetchRelevantNews,
    checkIfNewsIsInJson,
    getLatestNewsIds
};

