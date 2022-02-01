# HackerNews Telegram bot

### Attention!
This repository is no longer being mainteined. If you want the same bot, but with more features and higher speed, check https://github.com/drull1000/HackerNewsBot-Golang

A Telegram bot that serves you with personalized HackerNews articles. You can self host it and make it filter only the news that are relevant to you.

## How to set up

In order to run the bot you will need a [Telegram](https://core.telegram.org/api) API key.

Rename `example.news.json` to `news.json`, `example.env` to `.env` and put the key in the file.
```env
TOKEN=<TOKEN>
```
Now, you can go to `api.js` and change the relevant topics in the array. By default, the topics are: `privacy, hack, linux, golang, hacker, malware, exploit, leak, CIA, NSA, hacked, breaches, breached, security, OSINT, leaked, GNU, free and open source, open source`.

install packages:
```
$ npm install
```
run the application:
```
$ node index.js
```
