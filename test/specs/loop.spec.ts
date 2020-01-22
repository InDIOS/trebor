import { getPage, getComponent, exec } from '../utils';
import { Page, JSHandle, ElementHandle } from 'puppeteer';

describe('Component Loop', () => {
  let page: Page;
  let instance: JSHandle<Component>;

  beforeAll(async () => {
    page = await getPage(browser, 'loop');
    [, instance] = await getComponent<typeof Component, Component>(page, 'Loop');
  });

  afterAll(async () => {
    await jestPuppeteer.resetBrowser();
  });

  it('should loop over an array variable', async () => {
    const items = await page.$$('#loop_1 li');
    expect(items.length).toBe(5);
    for (let i = 0; i < items.length; i++) {
      expect(await exec(items[i], item => item.textContent)).toBe(`${i + 1}`);
    }
  });

  it('should loop over an object', async () => {
    const items = await page.$$('#loop_2 li');
    expect(items.length).toBe(5);
    expect(await exec(items[0], item => item.textContent)).toBe('a');
    expect(await exec(items[4], item => item.textContent)).toBe('e');
  });

  it('should loop over an array', async () => {
    const items = await page.$$('#loop_3 li');
    expect(items.length).toBe(5);
    for (let i = 0; i < items.length; i++) {
      expect(await exec(items[i], item => item.textContent)).toBe(`${i + 1}`);
    }
  });

  it('should loop over a number', async () => {
    const items = await page.$$('#loop_4 li');
    expect(items.length).toBe(5);
    for (let i = 0; i < items.length; i++) {
      expect(await exec(items[i], item => item.textContent)).toBe(`${i}`);
    }
  });

  it('should loop over a range of numbers', async () => {
    const items = await page.$$('#loop_5 li');
    expect(items.length).toBe(5);
    for (let i = 0; i < items.length; i++) {
      expect(await exec(items[i], item => item.textContent)).toBe(`${i}`);
    }
  });

  it('should loop over an array variable with the given index', async () => {
    const items = await page.$$('#loop_6 li');
    expect(items.length).toBe(5);
    for (let i = 0; i < items.length; i++) {
      expect(await exec(items[i], item => item.textContent)).toBe(`${i + 1} ${i + 1}`);
    }
  });

  it('should loop over an object with the given index', async () => {
    const items = await page.$$('#loop_7 li');
    expect(items.length).toBe(5);
    expect(await exec(items[0], item => item.textContent)).toBe('1. a: a');
    expect(await exec(items[4], item => item.textContent)).toBe('5. e: e');
  });

  it('should loop over an array with the given index', async () => {
    const items = await page.$$('#loop_8 li');
    expect(items.length).toBe(5);
    for (let i = 0; i < items.length; i++) {
      expect(await exec(items[i], item => item.textContent)).toBe(`${i + 1} ${i + 1}`);
    }
  });

  it('should loop over a number with the given index', async () => {
    const items = await page.$$('#loop_9 li');
    expect(items.length).toBe(5);
    for (let i = 0; i < items.length; i++) {
      expect(await exec(items[i], item => item.textContent)).toBe(`${i + 1} ${i}`);
    }
  });

  it('should loop over a range of numbers with the given index', async () => {
    const items = await page.$$('#loop_10 li');
    expect(items.length).toBe(5);
    for (let i = 0; i < items.length; i++) {
      expect(await exec(items[i], item => item.textContent)).toBe(`${i + 1} ${i}`);
    }
  });

  it('nested loops should render with the according scope', async () => {
    const items = await page.$$('#loop_11 li');
    expect(items.length).toBe(5);
    for (let i = 0; i < items.length; i++) {
      const children = await items[i].$$('span');
      expect(children.length).toBe(5);
      for (let j = 0; j < children.length; j++) {
        const item: ElementHandle<Element> = children[j];
        const value: string = await exec(item, item => item.textContent);
        expect(value.startsWith(`${i + 1}.${i + 1}.${j + 1} - `)).toBeTruthy();
      }
    }
  });

  it('items should be modified', async () => {
    await exec(instance, i => i.items.splice(3, 1));
    const items = await page.$$('#loop_1 li');
    expect(items.length).toBe(4);
    expect(await exec(items[0], item => item.textContent)).toBe('1');
    expect(await exec(items[1], item => item.textContent)).toBe('2');
    expect(await exec(items[2], item => item.textContent)).toBe('3');
    expect(await exec(items[3], item => item.textContent)).toBe('5');
  });
});