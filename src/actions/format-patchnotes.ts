function formatPatchNotes(text: string): string {
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
      output.push(`
<b><u>${line}</u></b>`);
      continue;
    }

    if (/^(Пассивный|Атрибуты|\d+ Навык|Ультимейт)$/i.test(line.split('-')[0].trim()) || /\[(Усиление|Ослабление|Изменение)]/.test(line.trim())) {
      quoteBuffer.push(`<b>${line}</b>`);
      continue;
    }

    quoteBuffer.push(line);
  }

  flushQuotes();
  return output.join('\n');
}

export { formatPatchNotes };