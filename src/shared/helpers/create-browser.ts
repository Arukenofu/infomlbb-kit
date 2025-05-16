import * as puppeteer from 'puppeteer';

// @ts-ignore
import chromium from '@sparticuz/chromium';
import puppeteerCore from 'puppeteer-core';

async function createBrowser() {
  const ENVIRONMENT = process.env.NODE_ENV || '';

  if (ENVIRONMENT === 'production') {
    return puppeteerCore.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath(),
      headless: chromium.headless,
    });
  } else {
    return puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
      headless: true,
    });
  }
}

export {createBrowser}