const express = require("express");
const cors = require("cors");
const { upsertUserQuery, insertMessageQuery } = require("./queries");
const { fetchGQL } = require("./utils");
const TelegramBot = require("node-telegram-bot-api");
const to = require("await-to-js").default;
const getObject = require('lodash.get');
const fetch = require('node-fetch')

const app = express();
require("dotenv").config();
const TOKEN = process.env.BOT_TOKEN;
const url = process.env.WEBHOOK_PATH;
const port = process.env.PORT || 3000;

const bot = new TelegramBot(TOKEN);
app.use(cors());
app.use(express.json());

app.post(`/secret-path`, (req, res) => {
  bot.processUpdate(req.body);
  res.sendStatus(200);
});

app.post(`/${process.env.BOT_TOKEN}/sendMessage`, async (req, res) => {
  const { chatId, text } = req.body;
  const [err, data] = await saveAndSend(chatId, text);
  if (err) {
    console.log(err);
    res.status(500).send({ err: "Error in processing message" });
  } else {
    res.sendStatus(200);
  }
});

app.listen(port, () => {
  console.log(`Express server is listening on ${port}`);
});

fetch(`${process.env.TELEGRAM_API}/bot${process.env.BOT_TOKEN}/getMe`).then((res) => {
  if (res.status === 200) {
    return res.json()
  }
}).then((result) => {
  if (result.result) {
    const userInfo = {
      id: getObject(result, 'result.id'),
      is_bot: true,
      first_name: getObject(result, 'result.first_name'),
      username: getObject(result, 'result.username')
    }

    fetchGQL.request(upsertUserQuery, userInfo)
  }
}).catch((err) => {
  console.log(err, 'Error while posting bot inforamtion');
})

bot.setWebHook(`${url}`);

bot.onText(/\/start/, async msg => {
  const chatId = msg.chat.id;
  const { id, first_name, username } = msg.from;
  const [err, data] = await to(
    fetchGQL.request(upsertUserQuery, {
      id,
      first_name,
      is_bot: false,
      username: username || first_name
    })
  );
  if (err) {
    console.log(err, "Error in saving user");
  } else {
    saveAndSend(chatId, "Thank you for registering!");
  }
});

bot.on("message", async msg => {
  console.log("Incoming context", msg);
  let [e, data] = await to(
    fetchGQL.request(insertMessageQuery, {
      id: msg.message_id,
      timestamp: new Date(msg.date * 1000).toISOString(),
      user_id: msg.from.id,
      text: msg.text,
      chat_id: msg.chat.id
    })
  );

  if (e) {
    console.log("Error in saving message", e);
  }
});

const saveAndSend = async (chatId, txt) => {
  let [err, msg] = await to(bot.sendMessage(chatId, txt));
  if (err) {
    console.log("Error in delivering message to Telegram: ", msg, err);
    return [err, null];
  }
  let [e, data] = await to(
    fetchGQL.request(insertMessageQuery, {
      id: msg.message_id,
      timestamp: new Date(msg.date * 1000).toISOString(),
      user_id: msg.from.id,
      text: msg.text,
      chat_id: msg.chat.id
    })
  );

  if (e) {
    return [e, null];
    console.log("Error in saving message", e);
  }
  return [null, [msg, data]];
};
