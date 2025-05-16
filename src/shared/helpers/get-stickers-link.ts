import { Telegram } from 'telegraf';

async function getStickersLink(telegram: Telegram, stickers: string[]) {
  const stickersList = await telegram.getCustomEmojiStickers(stickers);

  return Promise.all(
    stickersList.map((sticker) =>
      telegram.getFileLink(sticker.file_id).then((link) => link.href),
    ),
  );
}

export { getStickersLink };