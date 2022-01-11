const fs = require('fs');
const axios = require("axios").default;

let newsID
let idsArray = []
let relevantNews = []
let newsToSend = []


const relevantTopics = ["privacy", "hack", "linux", "golang", "hacker", "the", "malware", "exploit",
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
        for (let i = 0; i < 10; i++) {
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

        //check if the news is already in news.json

        let newsInJsonFile = JSON.parse(fs.readFileSync('./news.json', 'utf8'));

        for (let i = 0; i < relevantNews.length; i++) {
            for (let j = 0; j < newsInJsonFile.length; j++) {
                if (relevantNews[i].title !== newsInJsonFile[j].title) {
                    //write the news to news.json
                    fs.WriteFileSync('./news.json', JSON.stringify(relevantNews), (err) => console.error(err));
                    console.log('The file has been saved!');
                };
            }
        }

        //        fs.writeFileSync('./news.json', JSON.stringify(newsToSend, null, 2));
//        console.log(relevantNews)
        console.log(newsToSend)
        console.log(newsInJsonFile)

        //        return relevantNews
        return newsToSend

        } catch (error) {
        console.log(error);
        return "Sorry, got an error";
    }
};

module.exports = {
    fetchNewsInfo,
    getLatestNewsIds
};

