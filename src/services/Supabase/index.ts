import { detectScript } from '../../shared/helpers/detect-script';
import { translateHero } from '../../shared/helpers/translate-hero';

type Nullable<T> = T | null;

export class SupabaseService {
  private supabaseUrl: string;

  constructor(supabaseUrl: string) {
    this.supabaseUrl = supabaseUrl;
  }

  private async tryUrl(baseUrl: string, extension: string): Promise<Nullable<string>> {
    const url = `${baseUrl}.${extension}`;
    try {
      const res = await fetch(url, { method: 'HEAD' });
      if (res.ok) return url;
    } catch (e) {}
    return null;
  }

  private url(path: string): string {
    return new URL(path, this.supabaseUrl).toString();
  }

  async getValidImageUrl(path: string): Promise<Nullable<string>> {
    return (await this.tryUrl(path, 'png')) || (await this.tryUrl(path, 'jpg')) || null;
  }

  async getWallpaper(hero: Nullable<string>): Promise<Nullable<string>> {
    if (!hero) return null;
    const path = `storage/v1/object/public/wallpapers/${hero}`;
    return this.getValidImageUrl(this.url(path));
  }

  getHeroIcon(hero: string): string {
    const lang = detectScript(hero);
    if (lang === 'ru') {
      hero = translateHero(hero, 'en')!;
    }
    const path = `storage/v1/object/public/hero-icons/${hero}.webp`;
    return this.url(path);
  }
}

export const Supabase = new SupabaseService(process.env.SUPABASE_URL || '')