import { getStickersLink } from '../processes/get-stickers-link';
import { replaceEmojisWithStickers } from '../actions/format-patchnotes/replace-emoji';
import { Vercel } from '../services/Vercel';
import { createCommandHandler } from '../core/handlers/command';
import { getPayload } from '../shared/helpers/getPayload';
import { InputFile } from 'grammy';
import { formatPatchNotes } from '../actions/format-patchnotes';

export default createCommandHandler('patchimage', async (context) => {
  const msg = context.message;
  const payload = getPayload(msg?.text || '');

  if (!msg?.entities || !payload) {
    return;
  }

  await context.reply('Создание изображения...');

  const formattedHtml = formatPatchNotes(payload, {
    lineBreak: true,
    wrapParagraph: true
  });

  const entities = context.message.entities!;
  const stickersLink = entities
    .filter(entry => entry.type === 'custom_emoji')
    .map(entry => entry.custom_emoji_id);
  const stickers = await getStickersLink(stickersLink);
  const html = replaceEmojisWithStickers(formattedHtml, stickers);

  const buffers = await Vercel.htmlToImage(html);
  console.log(buffers);

  if (!buffers.length) {
    return context.reply('Не удалось получить изображения');
  }

  await context.replyWithMediaGroup(
    buffers.map((screenshot, i) => ({
      type: 'document',
      media: new InputFile(screenshot, `patch_${i + 1}.png`),
    }))
  );
})
