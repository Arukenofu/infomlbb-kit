import { telegram } from "../core";

async function getStickersLink(stickers: string[]) {
  const stickersList = await telegram.getCustomEmojiStickers(stickers);

  const links = [];
  for (const sticker of stickersList) {
    const file = await telegram.getFile(sticker.file_id);
    links.push(`https://api.telegram.org/file/bot${telegram.token}/${file.file_path}`);
  }

  return links;
}

export { getStickersLink };


