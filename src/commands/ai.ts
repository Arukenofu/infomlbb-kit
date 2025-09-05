import { AIService } from '../services/AI';
import { splitMessage } from '../processes/split-message';
import { getPhotolink } from '../processes/get-photolink';
import { fetchImageAsBase64 } from '../shared/helpers/base64';
import { createCommandHandler } from '../core/handlers/command.ts';

export default createCommandHandler('ai',async (context) => {
  const ai = new AIService(process.env.AI_SERVICE_KEY, {
    scenario: 'Отвечай без никакого форматирования',
  });

  let responseText: string;

  const photos = context.message?.photo;

  if (photos) {
    const link = await getPhotolink(photos);
    const base64 = await fetchImageAsBase64(link, 'image/jpeg');
    const data = await ai.sendImage(base64, context.msg?.text || '');
    responseText = data.candidates[0].content.parts[0].text;
  } else {
    const data = await ai.sendText(context.msg?.text || '');
    responseText = data.candidates[0].content.parts[0].text;
  }

  for (const msg of splitMessage(responseText)) {
    await context.reply(msg);
  }
})