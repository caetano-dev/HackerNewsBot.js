const fs = require('fs');
const axios = require("axios").default;

let newsID
let idsArray = []
let relevantNews = []

var news = {
    news: []
};

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
        for (let i = 0; i < 15; i++) {
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

        fs.writeFileSync("./news.json", JSON.stringify(relevantNews));

        fs.readFile('news.json', 'utf8', function readFileCallback(err, data){
            if (err){
                console.log(err);
            } else {
                console.log(data);
                news = JSON.parse(data); 
                news.push(data); 
                json = JSON.stringify(relevantNews); 
                fs.writeFile('news.json', json, 'utf8', (err)=>{
                    if (err) throw err;
                    console.log('The file has been saved!');
                }); 
            }}); 

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

