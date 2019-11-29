import { Page, Browser } from 'puppeteer';
import { getBrowser, getPage, getComponent, exec } from '../utils';

describe('Component Html', () => {
  let page: Page;
  let browser: Browser;

  beforeAll(async () => {
    browser = await getBrowser();
    page = await getPage(browser, 'html');
    await getComponent<typeof Component, Component>(page, 'html');
  });

  afterAll(async () => {
    await browser.close();
  });

  it('nodes without expression should be normally rendered', async () => {
    const divs = await page.$$('div');
    const div = divs[0];
    expect(await exec(div, d => d.innerHTML)).toBe('<p>Here\'s a very interesting note displayed in a lovely shadowed box.</p><p>Any kind of content here. Such as &lt;p&gt;, &lt;table&gt;. You name it!</p>');
  });

  it('nodes with expression should not escape expressions', async () => {
    const divs = await page.$$('div');
    const div_1 = divs[1], div_2 = divs[2];
    expect(await exec(div_1, d => d.innerHTML)).toBe('<p>Some paragraph with text undefined</p>');
    expect(await exec(div_2, d => d.innerHTML)).toBe('<p>Some paragraph with undefined and undefined expressions</p>');
  });

  it('`$html` should escape expressions', async () => {
    const divs = await page.$$('div');
    const div_1 = divs[3], div_2 = divs[4];
    expect(await exec(div_1, d => d.innerHTML)).toBe('<p $some-attr="someVar">Some paragraph with text intentional {escaped}</p>');
    expect(await exec(div_2, d => d.innerHTML)).toBe('<p $some-attr="someVar">Some paragraph with text from {model}</p>');
  });
});