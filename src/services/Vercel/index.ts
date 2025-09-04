import { ofetch } from 'ofetch';
import AdmZip from 'adm-zip';

export class Vercel {
  static makeRequest = ofetch.create({
    baseURL: 'https://infomlbb-kit.vercel.app',
  });

  static async htmlToImage(html: string) {
    const data = await this.makeRequest<ArrayBuffer>('/html-to-image', {
      method: 'POST',
      body: { html },
    });

    const zip = new AdmZip(Buffer.from(data));
    const zipEntries = zip.getEntries();

    const buffers: Buffer[] = zipEntries
      .filter(e => e.entryName.endsWith('.png'))
      .map(e => e.getData());

    return buffers;
  }
}