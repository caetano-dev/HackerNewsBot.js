require('dotenv').config()

const TelegramBot = require('node-telegram-bot-api');
const token = process.env.TOKEN
const bot = new TelegramBot(token, {polling: true});
const { checkIfNewsIsInJson } = require("./utils/api");

bot.onText(/\/start/, async (msg) => {
    const chatId = msg.chat.id;
    setInterval(async () => {
        const latestNews = await checkIfNewsIsInJson();
        latestNews.forEach(news => {
            const newsText = `${news.title}\n${news.url}`;
            bot.sendMessage(chatId, newsText);
        });
    }, 1800000);
});
