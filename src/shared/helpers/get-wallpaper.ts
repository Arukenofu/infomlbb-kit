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

async function getWallpaper(hero: string | null) {
  return getValidImageUrl(`https://hdknnncxvrdqnyijnprx.supabase.co/storage/v1/object/public/wallpapers//${hero}`);
}

export { getWallpaper };