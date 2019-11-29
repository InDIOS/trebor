import { resolve } from 'path';
import { readFileSync } from 'fs';
import puppeteer, { LaunchOptions, Browser, Page, JSHandle, ScriptTagOptions } from 'puppeteer';

const width = 1366;
const height = 768;

export async function getBrowser(options: LaunchOptions = {}) {
  const browser = await puppeteer.launch(Object.assign({
    headless: true,
    args: [`--window-size=${width},${height}`, '--no-sandbox']
  }, options));
  return browser;
}

export async function getPage(browser: Browser, ...files: string[]) {
  const page = await browser.newPage();
  await page.setContent('');
  await page.setViewport({ width, height });
  const scripts: ScriptTagOptions[] = files
    .map(file => ({ content: readFileSync(resolve(__dirname, `./components/${file}.js`), 'utf8') }));
  scripts.unshift({ content: scriptInit(files[0][0].toUpperCase() + files[0].slice(1)) });
  scripts.reverse().forEach(async script => {
    await page.addScriptTag(script);
  });
  return page;
}

export async function getComponent<T, K>(page: Page, component: string): Promise<[JSHandle<T>, JSHandle<K>]> {
  const windowHandle = await page.evaluateHandle(() => window);
  const instance: JSHandle<K> = await windowHandle.getProperty('instance');
  const Component: JSHandle<T> = await windowHandle.getProperty(component);
  windowHandle.dispose();
  return [Component, instance];
}

export async function exec<T extends any>(handle: JSHandle<T>, cb: (obj: T) => any) {
  return handle.evaluate(cb);
}

function scriptInit(component: string) {
  const i = 'instance';
  return `const main = document.createElement('main');
  document.body.append(main);
  const ${i} = new ${component}();
  ${i}.$mount('main');
  window.${i} = ${i};`;
}
