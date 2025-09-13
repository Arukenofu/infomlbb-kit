import { findHero } from '../../shared/helpers/generate-russian-forms';
import { Supabase } from '../../services/Supabase';

interface FormatPatchNotesOptions {
  lineBreak?: boolean;
  wrapParagraph?: boolean;
  useAutoEmoji?: boolean;
}

function formatPatchNotes(
  text: string,
  options: FormatPatchNotesOptions = {}
): string {
  const { lineBreak = true, wrapParagraph = false, useAutoEmoji = true } = options;

  const lines = text.split("\n");
  const output: string[] = [];
  let quoteBuffer: string[] = [];

  function flushQuotes() {
    if (quoteBuffer.length) {
      output.push(`<blockquote>${quoteBuffer.join("\n")}</blockquote>`);
      quoteBuffer = [];
    }
  }

  const patterns: {
    test: (line: string) => boolean;
    format: (line: string) => string | null;
    flushBefore?: boolean;
    pushToQuotes?: boolean;
  }[] = [
    {
      // Секция (section: или s:)
      test: (line) => /^(section:|s:)\s*/i.test(line),
      flushBefore: true,
      format: (line) => {
        line = line.replace(/^(section:|s:)\s*/i, "");
        const linePrefix = lineBreak ? "\n" : "";

        let formatted = `<u><b>${line}`;
        const heroName = line.split(" ").slice(1).join(" ").trim().toLowerCase();
        const heroData = findHero(heroName);
        if (heroData && useAutoEmoji) {
          const icon = Supabase.getHeroIcon(heroData.en);
          formatted += ` <custom-emoji-wrapper><img src="${icon}" alt=""></custom-emoji-wrapper>`;
        }
        formatted += `</b></u>`;
        return linePrefix + formatted;
      },
    },
    {
      // Подзаголовок (b:)
      test: (line) => /^b:\s*/i.test(line),
      pushToQuotes: true,
      format: (line) => {
        line = line.replace(/^b:\s*/i, "");
        return `<b>${line}</b>`;
      },
    },
    {
      // Авто-детект секции (если "Усиление/Ослабление/Изменение ...")
      test: (line) => /^(Усиление|Ослабление|Изменение|Ревамп) .+/.test(line),
      flushBefore: true,
      format: (line) => {
        const hasEmoji = /\p{Emoji_Presentation}/gu.test(line);
        const linePrefix = lineBreak ? "\n" : "";

        let formatted = `<u><b>${line}`;
        if (!hasEmoji) {
          const heroName = line.split(" ").slice(1).join(" ").trim().toLowerCase();
          const heroData = findHero(heroName);
          if (heroData && useAutoEmoji) {
            const icon = Supabase.getHeroIcon(heroData.en);
            formatted += ` <custom-emoji-wrapper><img src="${icon}" alt=""></custom-emoji-wrapper>`;
          }
        }
        formatted += "</b></u>";
        return linePrefix + formatted;
      },
    },
    {
      // Авто-детекст подзаголовок
      test: (line) => /^(\S+(?:\s+\S+){0,2})\s*-\s*\S+$/.test(line),
      pushToQuotes: true,
      format: (line) => `<b>${line}</b> \n`,
    }
  ];

  for (let rawLine of lines) {
    const line = rawLine.trim();
    if (!line) {
      flushQuotes();
      continue;
    }

    let handled = false;
    for (const rule of patterns) {
      if (rule.test(line)) {
        if (rule.flushBefore) flushQuotes();

        const formatted = rule.format(line);
        if (rule.pushToQuotes && formatted) {
          quoteBuffer.push(formatted);
        } else if (formatted) {
          output.push(formatted);
        }
        handled = true;
        break;
      }
    }

    if (!handled) {
      quoteBuffer.push(wrapParagraph ? `<p>${line}</p>` : line);
    }
  }

  flushQuotes();

  return output.join(lineBreak ? "\n" : "");
}

export { formatPatchNotes };