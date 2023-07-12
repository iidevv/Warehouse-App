import TelegramBot from "node-telegram-bot-api";

const token = process.env.TG_BOT_TOKEN;

const tgBot = new TelegramBot(token, { polling: true });

export default tgBot;
