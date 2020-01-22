import {  getPage, getComponent, exec } from '../utils';
import { Page, JSHandle, ElementHandle } from 'puppeteer';

describe('Component Conditions', () => {
  let page: Page;
  let instance: JSHandle<Component>;

  beforeAll(async () => {
    page = await getPage(browser, 'condition');
    [, instance] = await getComponent<typeof Component, Component>(page, 'Condition');
  });

  afterAll(async () => {
    await jestPuppeteer.resetBrowser();
  });

  it('`$if` should be rendered', async () => {
    const span: ElementHandle<HTMLSpanElement> = await page.$('main span');
    expect(await exec(span, s => s.textContent)).toBe('1');
  });

  it('`$else-if` should be rendered', async () => {
    await exec(instance, i => i.$set('condition', 2));
    const span: ElementHandle<HTMLSpanElement> = await page.$('main span');
    expect(await exec(span, s => s.textContent)).toBe('2');
  });

  it('`$else` should be rendered', async () => {
    await exec(instance, i => i.$set('condition', 3));
    const span: ElementHandle<HTMLSpanElement> = await page.$('main span');
    expect(await exec(span, s => s.textContent)).toBe('other');
  });

  it('`$if` only should be rendered', async () => {
    const div: ElementHandle<HTMLDivElement> = await page.$('main div');
    expect(await exec(div, d => d.textContent)).toBe('1');
  });

  it('`$if` only should be hidden', async () => {
    await exec(instance, i => i.$set('condition_1', 2));
    let div: ElementHandle<null> = await page.$('main div');
    expect(div).toBeNull();
  });
});