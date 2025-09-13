import { Context, InputFile } from 'grammy';
import { JimpReadType } from '../shared/types/jimp-types';
import { getPhotolink } from './get-photolink';
import { getPhotos } from './get-photos';

export const processImage = async (
  context: Context,
  processor: (photoLink: string) => Promise<JimpReadType>
) => {
  const photos = getPhotos(context);
  if (!photos || photos.length === 0) {
    return context.reply("Прикрепите фотографию.");
  }

  await context.reply("Создание изображения...");

  const photoLink = await getPhotolink(photos);
  const image = await processor(photoLink);
  const output = await image.getBuffer('image/png');

  await context.replyWithDocument(
    new InputFile(output, "image.png")
  );
};