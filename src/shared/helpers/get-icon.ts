import { detectScript } from './detect-script';
import { translateHero } from './translate-hero';

function getHeroIcon(hero: string) {
  const lang = detectScript(hero);
  if (lang === 'ru') {
    hero = translateHero(hero, 'en')!;
  }

  return `https://hdknnncxvrdqnyijnprx.supabase.co/storage/v1/object/public/hero-icons//${hero}.webp`;
}

export {getHeroIcon}