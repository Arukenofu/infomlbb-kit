import { CreateWatermarkOptions } from '../watermark/createTWatermark';

export interface DownloadedMediaItem {
  type: 'image' | 'video';
  url: string;
  thumbnail?: string;
}

export interface Images {
  type: 'document';
  media: {
    source: Buffer<ArrayBufferLike>;
    filename: string;
  };
}

export interface ParseLinkResult extends CreateWatermarkOptions {
  applyWatermark?: boolean;
}