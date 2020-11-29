const { Telegraf } = require("telegraf");
const express = require("express");
const expressApp = express();
const { upsertUser } = require("./queries");

require("dotenv").config();

const bot = new Telegraf(process.env.BOT_TOKEN);
bot.start((ctx) => {
  const { id, first_name, username } = ctx.update.message.from;
  upsertUser({ id, first_name, username });
  // console.log(JSON.stringify(ctx.update), "ctx");
  ctx.reply("Hello");
});
bot.help((ctx) => ctx.reply("Help message"));
bot.on("message", (ctx) => ctx.telegram.sendCopy(ctx.chat.id, ctx.message));
bot.action("delete", ({ deleteMessage }) => deleteMessage());
expressApp.use(bot.webhookCallback("/secret-path"));
bot.telegram.setWebhook(process.env.WEBHOOK_PATH);

expressApp.get("/", (req, res) => {
  res.send("Hello World!");
});

expressApp.listen(process.env.PORT || 3000, () => {
  console.log("Example app listening on port 3000!");
});
