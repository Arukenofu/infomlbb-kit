import { getPhotolink } from '../processes/get-photolink';
import { AIService } from '../services/AI';
import { fetchImageAsBase64 } from '../shared/helpers/base64';
import { splitAndSendMessage } from '../processes/split-message';
import patchTranslator from '../services/AI/prompts/patch-translator';
import { createCommandHandler } from '../core/handlers/command.ts';

export default createCommandHandler('patch', async (context) => {
  const photos = context.message?.photo;
  if (!photos || photos.length === 0) return context.reply('Прикрепите изображение');

  const link = await getPhotolink(photos);
  const ai = new AIService(process.env.AI_SERVICE_KEY, { scenario: patchTranslator });

  const base64 = await fetchImageAsBase64(link, 'image/jpeg');

  const data = await ai.sendImage(base64);
  const response = data.candidates[0].content.parts[0].text;

  await splitAndSendMessage(response, context);
})