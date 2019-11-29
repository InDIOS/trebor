import { Page, Browser } from 'puppeteer';
import { getBrowser, getPage, getComponent, exec } from '../utils';

describe('Component Text interpolation', () => {
  let page: Page;
  let browser: Browser;

  beforeAll(async () => {
    browser = await getBrowser();
    page = await getPage(browser, 'interpolation');
    await getComponent<typeof Component, Component>(page, 'Interpolation');
  });

  afterAll(async () => {
    await browser.close();
  });

  it('should render text correctly', async () => {
    const text_1 = await page.$('#text_1');
    const text_2 = await page.$('#text_2');
    const text_3 = await page.$('#text_3');
    expect(await exec(text_1, t => t.textContent)).toBe('Test interpolation with some text.');
    expect(await exec(text_2, t => t.textContent)).toBe('Test interpolation with some text and some text with quote \' and double quote "');
    expect(await exec(text_3, t => t.textContent)).toBe('Test some text with some text with quote \' and double quote " and some expresions with AND');
  });
});