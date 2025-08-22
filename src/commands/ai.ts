import { Context } from 'telegraf';
import { AIService } from '../services/AI';
import { splitMessage } from '../shared/helpers/split-message';

const aiCommand = () => async (
  context: Context,
) => {
  const ai = new AIService(process.env.AI_SERVICE_KEY, {
    scenario: 'Отвечай без никакого форматирования'
  });

  const data = await ai.sendText(context.text || 'Привет!');
  const response = data.candidates[0].content.parts[0].text;

  const messages = splitMessage(response);

  for (const msg of messages) {
    await context.reply(msg);
  }
}

export { aiCommand };