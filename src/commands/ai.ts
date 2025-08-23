import { Context } from 'telegraf';
import { AIService } from '../services/AI';
import { splitMessage } from '../shared/helpers/split-message';
import { getPhotolink } from '../shared/helpers/get-photolink';
import { fetchImageAsBase64 } from '../shared/helpers/base64';

const aiCommand = () => async (
  context: Context,
) => {
  const ai = new AIService(process.env.AI_SERVICE_KEY, {
    scenario: 'Отвечай без никакого форматирования',
  });

  let responseText: string;

  if (context.message && 'photo' in context.message) {
    const link = await getPhotolink(context.message.photo, context.telegram);
    const base64 = await fetchImageAsBase64(link, 'image/jpeg');
    const data = await ai.sendImage(base64, context.text || '');
    responseText = data.candidates[0].content.parts[0].text;
  } else {
    const data = await ai.sendText(context.text || '');
    responseText = data.candidates[0].content.parts[0].text;
  }

  for (const msg of splitMessage(responseText)) {
    await context.reply(msg);
  }
}

export { aiCommand };