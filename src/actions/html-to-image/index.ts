import puppeteer from 'puppeteer';
import * as fs from 'node:fs';
import * as path from 'node:path';

async function htmlToImage(htmlContent: string) {
  const browser = await puppeteer.launch();
  console.log('browser started');
  const page = await browser.newPage();
  console.log('page created');

  const cssPath = path.resolve(__dirname, 'styles.css');

  const cssContent = fs.readFileSync(cssPath, 'utf8');

  const finalHtml = `
    <html lang="ru">
      <head>
        <style>${cssContent}</style>
      </head>
      <body>
        <div class="content">
            ${htmlContent}
        </div>
      </body>
    </html>`

  await page.setContent(finalHtml, { waitUntil: 'networkidle0' });
  console.log('html content was set');
  await page.setViewport({ width: 768, height: 1024 });
  console.log('viewport was set');

  const screenshot = await page.screenshot({fullPage: true});
  console.log('screenshot created');

  await browser.close();
  console.log('browser closed');

  return screenshot;
}

export { htmlToImage };