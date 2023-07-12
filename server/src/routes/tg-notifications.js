import TelegramBot from "node-telegram-bot-api";

const token = process.env.TG_BOT_TOKEN;
const useHttps = process.env.USE_HTTPS === "true";

let tgBot;

if (useHttps) {
  tgBot = new TelegramBot(token, { polling: true });

  tgBot.on("message", (msg) => {
    const chatId = msg.chat.id;
    console.log(chatId);
    console.log(msg.text);
    if (msg.text === "My id") {
      tgBot.sendMessage(`Your ID: ${chatId}`);
    }
  });
}

export default tgBot;
