import puppeteer from 'puppeteer-core';
import chromium from '@sparticuz/chromium';
import archiver from 'archiver';
import { VercelRequest, VercelResponse } from '@vercel/node';

function splitIntoSections(html: string, maxSections: number = 30): string[][] {
  const regex = /<b><u>[\s\S]*?<\/blockquote>/g;
  const matches = html.match(regex) || [];

  const pages: string[][] = [];
  let current: string[] = [];
  let lineCount = 0;

  for (const block of matches) {
    const blockLines = block.split("\n").length;

    if (lineCount + blockLines > maxSections && current.length > 0) {
      pages.push(current);
      current = [];
      lineCount = 0;
    }

    current.push(block);
    lineCount += blockLines;
  }

  if (current.length > 0) pages.push(current);
  return pages;
}

async function createBrowser() {
  return puppeteer.launch({
    args: chromium.args,
    defaultViewport: chromium.defaultViewport,
    executablePath:   await chromium.executablePath(),
    headless: chromium.headless,
  });
}

async function htmlToImage(htmlContent: string) {
  const browser = await createBrowser();
  const page = await browser.newPage();

  const sections = splitIntoSections(htmlContent, 30);
  const screenshots: Buffer[] = [];

  for (const pageSections of sections) {
    const finalHtml = `
    <html lang="ru">
      <head>
        <link rel="stylesheet" href="https://hdknnncxvrdqnyijnprx.supabase.co/storage/v1/object/public/assets/styles.css">
      </head>
      <body>
        <div class="content">
          ${pageSections.join("\n")}
        </div>
      </body>
    </html>`;

    await page.setContent(finalHtml, { waitUntil: 'networkidle0' });
    await page.setViewport({ width: 768, height: 324 });

    const screenshot = Buffer.from(
      await page.screenshot({ fullPage: true, type: 'png' }) as Uint8Array
    );
    screenshots.push(screenshot);
  }

  await browser.close();

  return screenshots;
}

export const startVercel = async (req: VercelRequest, res: VercelResponse) => {
  try {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    const { html } = req.body;
    if (!html || typeof html !== 'string') {
      return res.status(400).json({ error: 'HTML content is required' });
    }

    const screenshots = await htmlToImage(html);

    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', 'attachment; filename="screenshots.zip"');

    const archive = archiver('zip', { zlib: { level: 9 } });
    archive.pipe(res);

    screenshots.forEach((buffer, idx) => {
      archive.append(buffer, { name: `screenshot_${idx + 1}.png` });
    });

    await archive.finalize();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};