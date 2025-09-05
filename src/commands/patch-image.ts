import { getStickersLink } from '../processes/get-stickers-link';
import { replaceEmojisWithStickers } from '../actions/format-patchnotes/replace-emoji';
import {
  createElementNode,
  createPatchNodeTree,
  renderPatchHTML,
} from '../actions/format-patchnotes';
import { findHero } from '../shared/helpers/generate-russian-forms';
import { Vercel } from '../services/Vercel';
import { Supabase } from '../services/Supabase';
import { createCommandHandler } from '../core/handlers/command.ts';
import { getPayload } from '../shared/helpers/getPayload.ts';
import { InputFile } from 'grammy';

export default createCommandHandler('patchimage', async (context) => {
  const msg = context.message;
  const payload = getPayload(msg?.text || '');

  if (!msg?.entities || !payload) {
    return;
  }

  await context.reply('Создание изображения...');

  const tree = createPatchNodeTree(payload, {
    onHeroHeader: ({ line, hero, node }) => {
      if (!hero) return;

      const hasEmoji = /\p{Emoji_Presentation}/gu.test(line);
      if (hasEmoji) return;

      const heroData = findHero(hero);
      if (!heroData) return;

      const icon = Supabase.getHeroIcon(heroData.en);

      if (node.type === 'element' && node.children[0]?.type === 'element') {
        const underline = node.children[0];
        if (underline.type === 'element') {
          underline.children.push(
            createElementNode('custom-emoji-wrapper', [
              createElementNode('img', [], { src: icon, alt: '' }),
            ]),
          );
        }
      }

      return node;
    },
    onParagraph({ node }) {
      if (node.type === 'text') {
        return createElementNode('p', [node]);
      }
    }
  });
  const formattedHtml = renderPatchHTML(tree);

  const entities = context.message.entities!;
  const stickersLink = entities
    .filter(entry => entry.type === 'custom_emoji')
    .map(entry => entry.custom_emoji_id);
  const stickers = await getStickersLink(stickersLink);
  const html = replaceEmojisWithStickers(formattedHtml, stickers);

  const buffers = await Vercel.htmlToImage(html);

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
