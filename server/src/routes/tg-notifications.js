import TelegramBot from "node-telegram-bot-api";
import { config } from "dotenv";
config();
const useHttps = process.env.USE_HTTPS === "true";
const token = process.env.TG_BOT_TOKEN;
const chatIds = process.env.TG_CHAT_IDS.split(",").map(Number);
let tgBot;

if (useHttps) {
  tgBot = new TelegramBot(token, { polling: true });

  tgBot.on("message", (msg) => {
    const chatId = msg.chat.id;
    if (msg.text === "My id") {
      tgBot.sendMessage(chatId, `${chatId}`);
    }
  });
}

export const sendNotification = (message = "", bot = tgBot, ids = chatIds) => {
  if (bot) {
    ids.forEach((id) => {
      tgBot.sendMessage(id, message);
    });
  }
  console.log(message);
};
