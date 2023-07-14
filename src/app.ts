import puppeteer, { Browser } from 'puppeteer-core';
import chromium from '@sparticuz/chromium';
import type { Event, Body } from './types';
console.log("Wendel");

export async function main(event: Event) {
  console.log("entrou");
  const params = {
    headless: chromium.headless,
    slowMo: 0,
    defaultViewport: chromium.defaultViewport,
    executablePath: process.env.IS_LOCAL
      ? '/usr/bin/google-chrome'
      : await chromium.executablePath(),
    devtools: true,
    ignoreHTTPSErrors: true,
    ignoreDefaultArgs: ['--disable-extensions'],
    args: ['--disable-gpu', ...chromium.args],
    timeout: 5000,
  };

function parseBody(body: string | Record<string, unknown>): Record<string, unknown> {
  return typeof body === 'string' ? JSON.parse(body) : body;
}

const { Records } = event;

  await Promise.all(
    Records.map(async ({ body }) => {
      let browser: Browser | undefined;

      try {
        const { path, data, title, shortDescription } = parseBody(body) as unknown as Body;

        browser = await puppeteer.launch(params);
        console.log('Browser launched');

        const page = await browser.newPage();
        console.log('New page opened');


        await page.setViewport({ width: 1000, height: 1000 });
        await page.goto('https://staging.rupee.com.br/users/sign_in', {waitUntil: 'networkidle0'});

      } catch (error) {
        console.log(error);
      } finally {
        await browser?.close();
      }
    })
  );
}
