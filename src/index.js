require('dotenv').config()

const TelegramBot = require('node-telegram-bot-api');
const token = process.env.TOKEN
const bot = new TelegramBot(token, {polling: true});
const { getLatestNewsIds } = require("./utils/api");
const { fetchRelevantNews } = require("./utils/api");
const { checkIfNewsIsInJson } = require("./utils/api");

bot.onText(/\/start/, async (msg) => {
    const chatId = msg.chat.id;
    const latestNews = await checkIfNewsIsInJson();
    for (let i = 0; i < latestNews.length; i++) {
        const news = latestNews[i];
        const newsText = `${news.title}
      ${news.url}`;
        bot.sendMessage(chatId, newsText);
    }
});

