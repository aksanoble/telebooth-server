const { Telegraf } = require('telegraf')
const express = require('express')
const expressApp = express()
const Extra = require('telegraf/extra')
const Markup = require('telegraf/markup')

// const keyboard = Markup.inlineKeyboard([
//   Markup.urlButton('❤️', 'http://telegraf.js.org'),
//   Markup.callbackButton('Delete', 'delete')
// ])
require('dotenv').config();


const bot = new Telegraf(process.env.BOT_TOKEN)
bot.start((ctx) => ctx.reply('Hello'))
bot.help((ctx) => ctx.reply('Help message'))
bot.on('message', (ctx) => ctx.telegram.sendCopy(ctx.chat.id, ctx.message, Extra.markup(keyboard)))
bot.action('delete', ({ deleteMessage }) => deleteMessage())
expressApp.use(bot.webhookCallback('/secret-path'))
bot.telegram.setWebhook(process.env.WEBHOOK_PATH)

expressApp.get('/', (req, res) => {
  res.send('Hello World!')
})

expressApp.listen(3000, () => {
  console.log('Example app listening on port 3000!')
})