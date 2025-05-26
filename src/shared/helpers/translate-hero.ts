import { MLBB_HEROES } from '../constants/heroes';
import { detectScript } from './detect-script';

function translateHero(name: string, to: 'ru' | 'en' | null = null) {
  const inputLang = detectScript(name);
  const targetLang = to ?? (inputLang === 'ru' ? 'ru' : 'ru');

  for (const key in MLBB_HEROES) {
    const entry = MLBB_HEROES[key];

    if (entry[inputLang].toLowerCase() === name.toLowerCase()) {
      return entry[targetLang];
    }
  }

  return null;
}

export { translateHero };