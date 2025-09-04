import { ofetch } from 'ofetch';
import { ZipReader, BlobReader, Uint8ArrayWriter } from '@zip.js/zip.js';

export class Vercel {
  static makeRequest = ofetch.create({
    baseURL: 'https://infomlbb-kit.vercel.app',
  });

  static async htmlToImage(html: string) {
    const response = await this.makeRequest<Blob>('/html-to-image', {
      method: 'POST',
      body: { html },
    });

    const reader = new ZipReader(new BlobReader(response));
    const entries = await reader.getEntries();
    const buffers: Buffer[] = [];

    for (const entry of entries) {
      if (entry.filename.endsWith('.png')) {
        const uint8Array = await entry.getData?.(new Uint8ArrayWriter());
        buffers.push(Buffer.from(uint8Array!));
      }
    }

    await reader.close();
    return buffers;
  }
}