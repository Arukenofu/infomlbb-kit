import { Context } from 'telegraf';
import { getStickersLink } from '../processes/get-stickers-link';
import { htmlToImage } from '../actions/html-to-image';
import { replaceEmojisWithStickers } from '../actions/format-patchnotes/replace-emoji';
import {
  createElementNode,
  createPatchNodeTree,
  renderPatchHTML,
} from '../actions/format-patchnotes';
import { findHero } from '../shared/helpers/generate-russian-forms';
import { getHeroIcon } from '../shared/helpers/supabase-storage';

const patchImage = () => async (
  context: Context
) => {
  if (!('entities' in context.message!) || !('payload' in context)) {
    return;
  }

  await context.sendMessage('Создание изображения...');

  const tree = createPatchNodeTree(String(context.payload), {
    onHeroHeader: ({ line, hero, node }) => {
      if (!hero) return;

      const hasEmoji = /\p{Emoji_Presentation}/gu.test(line);
      if (hasEmoji) return;

      const heroData = findHero(hero);
      if (!heroData) return;

      const icon = getHeroIcon(heroData.en);

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
  const stickers = await getStickersLink(context.telegram, stickersLink);
  const html = replaceEmojisWithStickers(formattedHtml, stickers);

  const screenshot = await htmlToImage(html);

  await context.sendDocument({source: Buffer.from(new Uint8Array(screenshot)), filename: 'patch.png'});
}

export {patchImage}