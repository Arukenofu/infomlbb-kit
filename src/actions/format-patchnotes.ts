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

    if (/^(Усиление|Ослабление|Изменение) .+/.test(line)) {
      flushQuotes();
      output.push((lineBreak ? '\n' : '') + `<b><u>${line}</u></b>`);
      continue;
    }

    if (/^(Пассивный|Атрибуты|\d+ Навык|Ультимейт)$/i.test(line.split('-')[0].trim()) || /\[(Усиление|Ослабление|Изменение)]/.test(line.trim())) {
      quoteBuffer.push(`<b>${line}</b>`);
      continue;
    }

    quoteBuffer.push(wrapParagraph ? `<p>${line}</p>` : line);
  }

  flushQuotes();

  return output.join((lineBreak ? '\n' : ''));
}

function replaceEmojisWithStickers(text: string, stickerLinks: string[]): string {
  let index = 0;
  return text.replace(/\p{Emoji_Presentation}/gu, () => {
    return `<custom-emoji-wrapper><img src="${stickerLinks[index++]}" alt=""></custom-emoji-wrapper>`;
  });
}

export { formatPatchNotes, replaceEmojisWithStickers };