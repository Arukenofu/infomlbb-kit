import { Jimp } from 'jimp';

export type JimpReadType = Awaited<ReturnType<typeof Jimp.read>>;