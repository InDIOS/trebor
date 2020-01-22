import { Page, JSHandle } from 'puppeteer';
import { getPage, getComponent, exec } from '../utils';

describe('Component Filters', () => {
  let page: Page;
  let instance: JSHandle<Component>;

  beforeAll(async () => {
    page = await getPage(browser, 'filters');
    [, instance] = await getComponent<typeof Component, Component>(page, 'Filters');
  });

  afterAll(async () => {
    await jestPuppeteer.resetBrowser();
  });

  it('should be declared', async () => {
    const filters = await instance.getProperty('$filters');
    expect(await exec(filters, f => f.trim)).toBeDefined();
    expect(await exec(filters, f => f.upper)).toBeDefined();
    expect(await exec(filters, f => f.filterBy)).toBeDefined();
  });

  it('should be functions', async () => {
    const filters = await instance.getProperty('$filters');
    expect(await exec(filters, f => typeof f.trim)).toBe('function');
    expect(await exec(filters, f => typeof f.upper)).toBe('function');
    expect(await exec(filters, f => typeof f.filterBy)).toBe('function');
  });

  it('should be filtered correctly', async () => {
    const main = await page.$('main');
    const children: JSHandle<HTMLElement[]> = await main.getProperty('children');
    const ul: JSHandle<HTMLElement> = await children.getProperty('2');
    const span: JSHandle<HTMLElement> = await children.getProperty('0');
    const span1: JSHandle<HTMLElement> = await children.getProperty('1');
    expect(await exec(span, s => s.textContent)).toBe('some test text');
    expect(await exec(span1, s => s.textContent)).toBe('some text uppercase'.toUpperCase());
    await exec(instance, i => i.$set('filter', 'a'));
    expect(await exec(ul, u => u.children.length)).toBe(2);
    expect(await exec(ul, u => u.children[0].textContent)).toBe('AB');
    expect(await exec(ul, u => u.children[1].textContent)).toBe('A C');
  });
});