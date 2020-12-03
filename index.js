const express = require("express");
const { upsertUserQuery, insertMessageQuery } = require("./queries");
const { fetchGQL } = require("./utils");
const TelegramBot = require("node-telegram-bot-api");
const to = require("await-to-js").default;
const app = express();
require("dotenv").config();
const TOKEN = process.env.BOT_TOKEN;
const url = process.env.WEBHOOK_PATH;
const port = process.env.PORT || 3000;

const bot = new TelegramBot(TOKEN);
app.use(express.json());

app.post(`/secret-path`, (req, res) => {
  bot.processUpdate(req.body);
  res.sendStatus(200);
});

app.listen(port, () => {
  console.log(`Express server is listening on ${port}`);
});

bot.setWebHook(`${url}`);

bot.onText(/\/start/, async msg => {
  const chatId = msg.chat.id;
  const { id, first_name, username } = msg.from;
  const [err, data] = await to(
    fetchGQL.request(upsertUserQuery, { id, first_name, username: username || first_name })
  );
  if (err) {
    console.log(err, "Error in saving user")
    // saveAndSend(
    //   chatId,
    //   "There was an internal error, we're working on fixing it."
    // );
  } else {
    saveAndSend(chatId, "Thank you for registering!");
  }
});

bot.on("message", async msg => {
  console.log("Incoming context", msg);
  let [e, data] = await to(
    fetchGQL.request(insertMessageQuery, {
      id: msg.message_id,
      timestamp: new Date(msg.date*1000).toISOString(),
      user_id: msg.from.id,
      text: msg.text,
      chat_id: msg.chat.id
    })
  );

  if (e) {
    console.log("Error in saving message", e);
  }
  saveAndSend(msg.chat.id, "I am alive!").then(d => {
    // console.log("Sent Context", d);
  });
});

const saveAndSend = async (chatId, txt) => {
  let [err, msg] = await to(bot.sendMessage(chatId, txt));
  if (err) {
    console.log("Error in delivering message to Telegram: ", msg, err);
  }
  let [e, data] = await to(
    fetchGQL.request(insertMessageQuery, {
      id: msg.message_id,
      timestamp: new Date(msg.date*1000).toISOString(),
      user_id: msg.from.id,
      text: msg.text,
      chat_id: msg.chat.id
    })
  );

  if (e) {
    console.log("Error in saving message", e);
  }
  return [msg, data];
};
