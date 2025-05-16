import { Context } from 'telegraf';
import { getStickersLink } from '../shared/helpers/get-stickers-link';
import { formatPatchNotes, replaceEmojisWithStickers } from '../actions/format-patchnotes';
import { htmlToImage } from '../actions/html-to-image';

const patchImage = () => async (
  context: Context
) => {
  if (!('entities' in context.message!)) {
    await context.sendMessage('Эмодзи не заданы');
    return;
  }

  if (!('payload' in context)) {
    await context.sendMessage('Текст патчнотов не задан');
    return;
  }

  const entities = context.message!.entities!;
  const stickersLink = entities
    .filter(entry => entry.type === 'custom_emoji')
    .map(entry => entry.custom_emoji_id);
  const stickers = await getStickersLink(context.telegram, stickersLink);

  const formattedHtml = formatPatchNotes(String(context.payload), {
    lineBreak: false,
    wrapParagraph: true
  });
  const html = replaceEmojisWithStickers(formattedHtml, stickers);

  const screenshot = await htmlToImage(html);

  await context.sendDocument({source: Buffer.from(new Uint8Array(screenshot.buffer)), filename: 'photo.png'})
}

export {patchImage}