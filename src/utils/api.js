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

        //create a file with the news if it doesn't exist
        if (!fs.existsSync('./news.json')) {
            fs.writeFileSync('./news.json', JSON.stringify(relevantNews))
        }
        //read the file and append the new news
        else {
            let data = fs.readFileSync('./news.json')
            let json = JSON.parse(data)
            json.push(relevantNews)
            fs.writeFileSync('./news.json', JSON.stringify(json))
        }
        //check if the news is already in the file before adding it
        let data = fs.readFileSync('./news.json')
        let json = JSON.parse(data)
        for (let i = 0; i < json.length; i++) {
            for (let j = 0; j < relevantNews.length; j++) {
                if (json[i].title === relevantNews[j].title) {
                    relevantNews.splice(j, 1)
                }
            }
        }
        //write the news to the file
        fs.writeFileSync('./news.json', JSON.stringify(relevantNews))
        return relevantNews

        } catch (error) {
        console.log(error);
        return "Sorry, got an error";
    }
};

module.exports = {
    fetchNewsInfo,
    getLatestNewsIds
};

