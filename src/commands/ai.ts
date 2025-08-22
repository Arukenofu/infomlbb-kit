import { Context } from 'telegraf';
import { AIService } from '../services/AI';
import { splitMessage } from '../shared/helpers/split-message';

const aiCommand = () => async (
  context: Context,
) => {
  const ai = new AIService(process.env.AI_SERVICE_KEY, {
    scenario:`
Ты отвечаешь всегда с использованием HTML-разметки для Telegram.
Используй только допустимые теги: 
Жирный: <b></b>
Курсив: <i></i>
Подчеркнутый: <u></u>
Зачеркнутый: <s></s>
моноширинный: <code></code>
блок кода: <pre></pre>, 
Никакого markdown (** или __) не используй, или других лишних тегов. 
Если нужно выделить текст, применяй HTML.
`
  });

  const data = await ai.sendText(context.text || 'Привет!');
  const response = data.candidates[0].content.parts[0].text;

  const messages = splitMessage(response);

  for (const msg of messages) {
    await context.reply(msg, {
      parse_mode: "HTML"
    });
  }
}

export { aiCommand };