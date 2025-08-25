import { Context } from 'telegraf';
import { getPhotolink } from '../processes/get-photolink';
import { AIService } from '../services/AI';
import { fetchImageAsBase64 } from '../shared/helpers/base64';
import { splitAndSendMessage } from '../processes/split-message';
import patchTranslator from '../services/AI/prompts/patch-translator';

const translateCommand = () => async (
  context: Context,
) => {
  if (!context.message || !('photo' in context.message)) return;

  const link = await getPhotolink(context.message.photo, context.telegram);
  const ai = new AIService(process.env.AI_SERVICE_KEY, { scenario: patchTranslator });

  const base64 = await fetchImageAsBase64(link, 'image/jpeg');

  const data = await ai.sendImage(base64);
  const response = data.candidates[0].content.parts[0].text;

  splitAndSendMessage(response, context);
}

export { translateCommand };