import puppeteer from 'puppeteer-core';
import chromium from '@sparticuz/chromium';
import archiver from 'archiver';
import { VercelRequest, VercelResponse } from '@vercel/node';

function splitIntoSections(html: string, maxSections: number = 50): string[][] {
  const regex = /<u><b>[\s\S]*?<\/blockquote>/g;
  const matches = html.match(regex) || [];

  if (matches.length === 0) return [];

  const blocks = matches.map(block => ({
    html: block,
    lines: block.split("\n").length
  }));

  const totalLines = blocks.reduce((sum, b) => sum + b.lines, 0);

  const totalPages = Math.ceil(totalLines / maxSections);
  const targetLines = Math.ceil(totalLines / totalPages);

  const pages: string[][] = [];
  let current: string[] = [];
  let currentLines = 0;

  for (const block of blocks) {
    if (currentLines + block.lines > targetLines && current.length > 0) {
      pages.push(current);
      current = [];
      currentLines = 0;
    }

    current.push(block.html);
    currentLines += block.lines;
  }

  if (current.length > 0) pages.push(current);

  return pages;
}

async function createBrowser() {
  return puppeteer.launch({
    args: [...chromium.args, "--disable-web-security", "--disable-features=IsolateOrigins,site-per-process"],
    defaultViewport: chromium.defaultViewport,
    executablePath: await chromium.executablePath(),
    headless: chromium.headless,
  });
}

async function htmlToImage(htmlContent: string) {
  const browser = await createBrowser();
  const page = await browser.newPage();

  const sections = splitIntoSections(htmlContent, 50);
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

async function urlToImage(url: string, width: number = 1255, height: number = 800) {
  const browser = await createBrowser();
  const page = await browser.newPage();

  await page.goto(url, { waitUntil: 'networkidle0' });
  await page.setViewport({ width: width, height: height });

  return Buffer.from(
    (await page.screenshot({ fullPage: true, type: 'png' })) as Uint8Array,
  );
}

export const startVercel = async (req: VercelRequest, res: VercelResponse) => {
  try {
    if (req.method === 'GET') {
      const { url, width, height } = req.query;

      if (!url || typeof url !== "string") {
        res.status(400).send("Missing ?url parameter");
        return;
      }

      const w = width ? parseInt(width as string, 10) : 1255;
      const h = height ? parseInt(height as string, 10) : 800;

      const image = await urlToImage(url, w, h);

      res.setHeader("Content-Type", "image/png");
      res.setHeader("Cache-Control", "s-maxage=86400, stale-while-revalidate");
      return res.status(200).send(image);
    }

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