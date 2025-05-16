async function createBrowser() {
  const ENVIRONMENT = process.env.NODE_ENV || '';

  if (ENVIRONMENT === 'production') {
    const puppeteer = await import('puppeteer-core')
    // @ts-ignore
    const chromium = (await import('@sparticuz/chromium')).default;

    return puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath(),
      headless: chromium.headless,
    });
  } else {
    const puppeteer = await import('puppeteer')

    return puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
      headless: true,
    });
  }
}

export {createBrowser}