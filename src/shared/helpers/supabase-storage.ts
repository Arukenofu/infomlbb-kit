import { detectScript } from './detect-script';
import { translateHero } from './translate-hero';

async function getValidImageUrl(baseUrl: string) {
  const tryUrl = async (extension: string) => {
    const url = `${baseUrl}.${extension}`;
    try {
      const res = await fetch(url, { method: 'HEAD' });
      if (res.ok) {
        return url;
      }
    } catch (e) {
      return null;
    }
    return null;
  };

  return (await tryUrl('png')) || (await tryUrl('jpg')) || null;
}

function supabaseStorageUrl(url: string) {
  return new URL(url, process.env.SUPABASE_URL).toString();
}

async function getWallpaper(hero: string | null) {
  return getValidImageUrl(supabaseStorageUrl(`storage/v1/object/public/wallpapers//${hero}`));
}

function getHeroIcon(hero: string) {
  const lang = detectScript(hero);
  if (lang === 'ru') {
    hero = translateHero(hero, 'en')!;
  }

  return supabaseStorageUrl(`storage/v1/object/public/hero-icons//${hero}.webp`);
}

export { supabaseStorageUrl, getWallpaper, getHeroIcon };