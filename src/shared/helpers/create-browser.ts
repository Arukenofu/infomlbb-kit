

async function createBrowser() {
  const ENVIRONMENT = process.env.NODE_ENV || '';

  if (ENVIRONMENT === 'production') {

  } else {
    const puppeteer = await import('puppeteer')

    return puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
      headless: true,
    });
  }
}

export {createBrowser}