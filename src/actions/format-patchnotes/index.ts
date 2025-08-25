export type PatchNode =
  | { type: 'text'; value: string }
  | { type: 'element'; tag: string; children: PatchNode[]; attrs?: Record<string, string> };

export interface FormatPatchNotesOptions {
  onHeroHeader?: (ctx: { line: string; hero?: string; node: PatchNode }) => PatchNode | void;
  onSkillHeader?: (ctx: { line: string; node: PatchNode }) => PatchNode | void;
  onParagraph?: (ctx: { line: string; node: PatchNode }) => PatchNode | void;
  onTaggedLine?: (ctx: { line: string; tags: string[]; node: PatchNode }) => PatchNode | void;
}

export function createTextNode(value: string): PatchNode {
  return { type: 'text', value };
}

export function createElementNode(
  tag: string,
  children: PatchNode[] = [],
  attrs?: Record<string, string>,
): PatchNode {
  return { type: 'element', tag, children, attrs };
}

export function createPatchNodeTree(
  text: string,
  options: FormatPatchNotesOptions = {},
): PatchNode[] {
  const lines = text.split('\n');
  const output: PatchNode[] = [];
  let quoteBuffer: PatchNode[] = [];

  function flushQuotes() {
    if (quoteBuffer.length) {
      output.push(createElementNode('blockquote', quoteBuffer));
      quoteBuffer = [];
    }
  }

  for (let raw of lines) {
    let line = raw.trim();
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
      let node: PatchNode = createTextNode(line);
      for (const tag of tags.reverse()) {
        node = createElementNode(tag, [node]);
      }
      if (options.onTaggedLine) {
        const modified = options.onTaggedLine({ line, tags, node });
        if (modified) node = modified;
      }
      output.push(node);
      continue;
    }

    if (/^(Усиление|Ослабление|Изменение) .+/.test(line)) {
      flushQuotes();

      const heroName = line.split(' ').slice(1).join(' ').trim().toLowerCase();
      let node = createElementNode('b', [createElementNode('u', [createTextNode(line)])]);

      if (options.onHeroHeader) {
        const modified = options.onHeroHeader({ line, hero: heroName, node });
        if (modified) node = modified;
      }

      output.push(node);
      continue;
    }

    if (
      /^(Пассивный|Атрибуты|\d+ Навык|Ультимейт)$/i.test(line.split('-')[0].trim()) ||
      /\[(Усиление|Ослабление|Изменение)]/.test(line.trim())
    ) {
      let node = createElementNode('b', [createTextNode(line)]);
      if (options.onSkillHeader) {
        const modified = options.onSkillHeader({ line, node });
        if (modified) node = modified;
      }
      quoteBuffer.push(node);
      continue;
    }

    let node: PatchNode = createTextNode(line);
    if (options.onParagraph) {
      const modified = options.onParagraph({ line, node });
      if (modified) node = modified;
    }
    quoteBuffer.push(node);
  }

  flushQuotes();
  return output;
}

export function renderPatchHTML(nodes: PatchNode[], lineBreak = true): string {
  return nodes
    .map((n) => {
      if (n.type === 'text') return n.value;
      const attrs = n.attrs
        ? ' ' +
        Object.entries(n.attrs)
          .map(([k, v]) => `${k}="${v}"`)
          .join(' ')
        : '';
      const inner = renderPatchHTML(n.children, lineBreak);
      return `<${n.tag}${attrs}>${inner}</${n.tag}>`;
    })
    .join(lineBreak ? '\n' : '');
}