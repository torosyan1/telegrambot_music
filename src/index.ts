import express from "express";
import Telegraf from "telegraf";
import session from "telegraf/session";
import { search } from "./functions/search";
import { downloadAndConvert } from "./functions/dowloadeAndConvert";

const app = express();

export const bot = new Telegraf(process.env.BOT_TOKEN);

bot.command('start', (ctx)=> ctx.telegram.sendMessage(ctx.from.id,'welcome to music channel 🥳 '))

bot.on("message", search);

bot.on("callback_query", downloadAndConvert);

bot.use(session());

bot.launch();

app.listen(process.env.PORT, () => {console.log(`Example app listening at http://localhost:${process.env.PORT}`); });
