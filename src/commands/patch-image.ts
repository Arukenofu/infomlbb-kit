import { Context } from 'telegraf';
import { getStickersLink } from '../shared/helpers/get-stickers-link';
import { formatPatchNotes, replaceEmojisWithStickers } from '../actions/format-patchnotes';
import { htmlToImage } from '../actions/html-to-image';

const patchImage = () => async (
  context: Context
) => {
  if (!('entities' in context.message!) || !('payload' in context)) {
    console.log('validation error');
    return;
  }
  console.log(context.message!.entities);

  console.log('validation passed');

  const entities = context.message!.entities!;
  const stickersLink = entities
    .filter(entry => entry.type === 'custom_emoji')
    .map(entry => entry.custom_emoji_id);
  const stickers = await getStickersLink(context.telegram, stickersLink);
  console.log('stickers passed');

  const formattedHtml = formatPatchNotes(String(context.payload), {
    lineBreak: false,
    wrapParagraph: true
  });
  console.log('html formatting passed');
  const html = replaceEmojisWithStickers(formattedHtml, stickers);
  console.log('stickers replace passed');

  const screenshot = await htmlToImage(html);
  console.log('screenshot passed');

  await context.sendDocument({source: Buffer.from(new Uint8Array(screenshot.buffer)), filename: 'photo.png'})
}

export {patchImage}