import { Page, JSHandle } from 'puppeteer';
import { getPage, getComponent, exec } from '../utils';

describe('Component', () => {
  let page: Page;
  let instance: JSHandle<Component>;
  let Init: JSHandle<typeof Component>;

  beforeAll(async () => {
    page = await getPage(browser, 'init');
    [Init, instance] = await getComponent<typeof Component, Component>(page, 'Init');
  });

  afterAll(async () => {
    await jestPuppeteer.resetBrowser();
  });

  it('should be a function constructor', async () => {
    expect(await exec(Init, i => i)).not.toBeNull();
    expect(await exec(Init, i => typeof i)).toBe('function');
  });

  it('should get an instance when is used with new', async () => {
    expect(await exec(instance, i => typeof i)).toBe('object');
    expect(await exec(instance, i => i.constructor.name)).toEqual('$ComponentCtor');
  });

  it('instance should have prototype methods', async () => {
    expect(await exec(instance, i => '$refs' in i)).toBeTruthy();
    expect(await exec(instance, i => '$mount' in i)).toBeTruthy();
    expect(await exec(instance, i => '$watch' in i)).toBeTruthy();
    expect(await exec(instance, i => '$create' in i)).toBeTruthy();
    expect(await exec(instance, i => '$update' in i)).toBeTruthy();
    expect(await exec(instance, i => '$unmount' in i)).toBeTruthy();
    expect(await exec(instance, i => '$destroy' in i)).toBeTruthy();
    expect(await exec(instance, i => '$observe' in i)).toBeTruthy();
  });

  it('instance should have option properties', async () => {
    expect(await exec(instance, i => 'text' in i)).toBeTruthy();
    expect(await exec(instance, i => i.text)).toBe('World');
  });

  it('should be mounted in an element selector', async () => {
    expect(await exec(instance, i => i.$parentEl.nodeName)).toEqual('MAIN');
  });

  it('should be mounted correctly', async () => {
    const main = await page.$('main');
    const h1: JSHandle<HTMLHeadingElement> = await main.getProperty('firstChild');
    expect(await exec(h1, h => h.nodeName)).toEqual('H1');
    expect(await exec(h1, h => h.textContent)).toEqual('Hello, World!');
  });

  it('should update the view correctly', async () => {
    const main = await page.$('main');
    const h1: JSHandle<HTMLHeadingElement> = await main.getProperty('firstChild');
    await exec(instance, i => i.$set('text', 'Somebody'));
    expect(await exec(h1, h => h.textContent)).toEqual('Hello, Somebody!');
  });

  it('should not update the view if `$set` method is not used', async () => {
    const main = await page.$('main');
    const h1: JSHandle<HTMLHeadingElement> = await main.getProperty('firstChild');
    await exec(instance, i => i.text = 'World');
    expect(await exec(h1, h => h.textContent)).toEqual('Hello, Somebody!');
  });
});
