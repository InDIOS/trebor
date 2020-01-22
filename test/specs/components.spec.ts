import {  getPage, getComponent, exec } from '../utils';
import { Page, JSHandle, ElementHandle } from 'puppeteer';

describe('Component instance', () => {
  let page: Page = null;

  beforeAll(async () => {
    page = await getPage(browser, 'components', 'comp');
    await getComponent<typeof Component, Component>(page, 'Components');
  });

  afterAll(async () => {
    await jestPuppeteer.resetBrowser();
  });

  it('should mount all instances', async () => {
    const main: ElementHandle<HTMLElement> = await page.$('main');
    expect(await exec(main, m => m.children.length)).toBe(3);
  });

  it('should be mounted and render the default slot', async () => {
    const main: ElementHandle<HTMLElement> = await page.$('main');
    expect(await exec(main, m => m.firstChild.nodeName)).toBe('DIV');
    expect(await exec(main, m => m.firstChild.textContent)).toBe('Some text');
  });

  it('should be mounted and overwrite the default slot', async () => {
    const main: ElementHandle<HTMLElement> = await page.$('main');
    const children: JSHandle<HTMLDivElement[]> = await main.getProperty('children');
    const child: JSHandle<HTMLDivElement> = await children.getProperty('1');
    expect(await exec(child, c => c.nodeName)).toBe('DIV');
    expect(await exec(child, c => c.textContent)).toBe('Some other text');
  });

  it('should set the slot correctly', async () => {
    const main: ElementHandle<HTMLElement> = await page.$('main');
    const children: JSHandle<HTMLDivElement[]> = await main.getProperty('children');
    const child: JSHandle<HTMLDivElement> = await children.getProperty('2');
    expect(await exec(child, c => c.nodeName)).toBe('DIV');
    expect(await exec(child, c => c.children[0].tagName)).toBe('SPAN');
    expect(await exec(child, c => c.children[0].textContent)).toBe('Some header');
    expect(await exec(child, c => c.children[1].tagName)).toBe('SPAN');
    expect(await exec(child, c => c.children[1].textContent)).toBe('Some span text');
    expect(await exec(child, c => c.children[2].tagName)).toBe('SPAN');
    expect(await exec(child, c => c.children[2].textContent)).toBe('Some footer');
  });
});