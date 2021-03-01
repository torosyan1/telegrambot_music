import { YTSearcher } from "ytsearcher";
import Markup from "telegraf/markup";
import Extra from "telegraf/extra";

const searcher = new YTSearcher(process.env.YTKET);

export const search = async (ctx) => {
  try {
    const resultC = await searcher.search(ctx.update.message.text, {
      type: "video",
    });
    const reply_markup = [];

    resultC.currentPage.map((el) => {
      reply_markup.push([
        {
          text: el.title,
          callback_data: el.url,
        },
      ]);
    });

    const options = {
      reply_markup: JSON.stringify({
        inline_keyboard: reply_markup,
      }),
    };

    ctx.telegram.sendMessage(ctx.from.id, "Musics list 👇", options);

  } catch (err) {
    console.log(err);
  }
};
