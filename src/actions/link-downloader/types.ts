import { CreateWatermarkOptions } from '../watermark/createTWatermark';

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