const fs = require('fs');
const axios = require("axios").default;

let newsID
let idsArray = []
let relevantNews = []


const relevantTopics = ["privacy","a", "hack", "linux", "golang", "hacker", "the", "malware", "exploit",
"leak", "CIA", "NSA", "hacked", "breaches", "breached", "security", "OSINT", "leaked", "GNUl", "free and open source","open source"]
const newStoriesIDs = "https://hacker-news.firebaseio.com/v0/newstories.json?print=pretty"
const newsInfos = "https://hacker-news.firebaseio.com/v0/item/"+newsID+".json?print=pretty"

const getLatestNewsIds = async () =>{
    try {
        const response = await axios.get(
            newStoriesIDs
        );
        for (let i = 0; i < response.data.length; i++) {
            idsArray.push(response.data[i])
        }
        return idsArray
    } catch (error) {
        return error;
    }
};

const fetchNewsInfo = async () => {
    try {

        await getLatestNewsIds();
        //         for (let i = 0; i < idsArray.length; i++) {
        for (let i = 0; i < 20; i++) {
            newsID = idsArray[i]
            const response = await axios.get(
                "https://hacker-news.firebaseio.com/v0/item/"+newsID+".json?print=pretty"
            );
            for (let j = 0; j < relevantTopics.length; j++) {
                if (response.data.title.toLowerCase().includes(relevantTopics[j])) {
                    relevantNews.push(response.data)
                }
            }
        }
        if (!fs.existsSync('./news.json')) {
            fs.writeFileSync('./news.json', JSON.stringify(relevantNews))
        }

        let newsToSend = checkIfNewsExists(relevantNews)
        relevantNews = []
        console.log("news to send: " + newsToSend.length)
        console.log(newsToSend)

        //add news to the file
        return newsToSend

    } catch (error) {
        console.log(error);
        return "Sorry, got an error";
    }
};

function checkIfNewsExists(news) {
    console.log("checking if news exists")
    console.log(news)
    let newsToSend = []
    let newsToCheck = JSON.parse(fs.readFileSync('./news.json'))
    for (let i = 0; i < news.length; i++) {
        let found = false
        for (let j = 0; j < newsToCheck.length; j++) {
            if (news[i].title.includes(newsToCheck[j].title)) {
                found = true
                console.log("found------ " + news[i].title)
            }
        }
        if (!found) {
            newsToSend.push(news[i])
            console.log("not found------ " + news[i].title)
            fs.appendFileSync('./news.json', JSON.stringify(news[i]))
            console.log("added news" + news[i].title)
        }
    }
    return newsToSend
}

module.exports = {
    fetchNewsInfo,
    getLatestNewsIds
};

