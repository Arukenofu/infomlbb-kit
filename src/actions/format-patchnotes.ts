import { findHero } from '../shared/helpers/generate-russian-forms';
import { getHeroIcon } from '../shared/helpers/get-icon';

interface FormatPatchNotesOptions {
  lineBreak?: boolean;
  wrapParagraph?: boolean;
}

function formatPatchNotes(
  text: string,
  options: FormatPatchNotesOptions = {}
): string {
  const {
    lineBreak = true,
    wrapParagraph = false,
  } = options;

  const lines = text.split('\n');
  const output: string[] = [];
  let quoteBuffer: string[] = [];

  function flushQuotes() {
    if (quoteBuffer.length) {
      output.push(`<blockquote>${quoteBuffer.join('\n')}</blockquote>`);
      quoteBuffer = [];
    }
  }

  for (let line of lines) {
    line = line.trim();

    if (!line) {
      flushQuotes();
      continue;
    }

    let tags: string[] = [];
    while (true) {
      const match = line.match(/^([bu]):\s*/i);
      if (!match) break;
      tags.push(match[1].toLowerCase());
      line = line.slice(match[0].length);
    }
    if (tags.length) {
      flushQuotes();
      let wrapped = line;
      for (const tag of tags.reverse()) {
        wrapped = `<${tag}>${wrapped}</${tag}>`;
      }
      output.push(wrapped);
      continue;
    }

    if (/^(Усиление|Ослабление|Изменение) .+/.test(line)) {
      flushQuotes();

      const hasEmoji = /\p{Emoji_Presentation}/gu.test(line);
      const linePrefix = lineBreak ? '\n' : '';

      let formattedLine = `<b><u>${line}`;

      if (!hasEmoji) {
        const heroName = line.split(' ').slice(1).join(' ').trim().toLowerCase();
        const heroData = findHero(heroName);

        if (heroData) {
          const icon = getHeroIcon(heroData.en);

          formattedLine += ` <custom-emoji-wrapper><img src="${icon}" alt=""></custom-emoji-wrapper>`;
        }
      }

      formattedLine += `</u></b>`;
      output.push(linePrefix + formattedLine);

      continue;
    }

    if (
      /^(Пассивный|Атрибуты|\d+ Навык|Ультимейт)$/i.test(line.split('-')[0].trim()) ||
      /\[(Усиление|Ослабление|Изменение)]/.test(line.trim())
    ) {
      quoteBuffer.push(`<b>${line}</b>`);
      continue;
    }

    quoteBuffer.push(wrapParagraph ? `<p>${line}</p>` : line);
  }

  flushQuotes();

  return output.join(lineBreak ? '\n' : '');
}

function replaceEmojisWithStickers(html: string, stickerLinks: string[]): string {
  let index = 0;
  return html.replace(/\p{Emoji_Presentation}/gu, () => {
    return `<custom-emoji-wrapper><img src="${stickerLinks[index++]}" alt=""></custom-emoji-wrapper>`;
  });
}

export { formatPatchNotes, replaceEmojisWithStickers };