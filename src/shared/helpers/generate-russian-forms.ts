import { MLBB_HEROES } from '../constants/heroes';

const altEndings = {
  "а": ["ы", "е", "у", "ой", "ою", "и"],
  "я": ["и", "е", "ю", "ей", "ёй"],
  "ь": ["и", "ю", "е"],
  "": ["а", "у", "ом", "а", "е", "ы", "и", "ю"]
};

function generateForms(name: string) {
  const forms = new Set();
  const lower = name.toLowerCase();
  forms.add(lower);

  for (const [ending, variants] of Object.entries(altEndings)) {
    if (lower.endsWith(ending)) {
      const base = lower.slice(0, lower.length - ending.length);
      for (const v of variants) {
        forms.add(base + v);
      }
    }
  }

  return forms;
}

function findHero(inputName: string) {
  const input = inputName.trim().toLowerCase();

  for (const id in MLBB_HEROES) {
    const forms = generateForms(MLBB_HEROES[id].ru);
    if (forms.has(input)) {
      return MLBB_HEROES[id];
    }
  }

  return null;
}

export { generateForms, findHero };