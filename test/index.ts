import { join } from 'path';
import setup from './setup';
import puppeteer, { Browser, LaunchOptions } from 'puppeteer';

const specs = 'test/specs/**/*.spec.js';
const components = 'test/components/**/*.js';
const options: LaunchOptions = { headless: true, defaultViewport: { width: 1360, height: 700 } };

(async () => {
  const browser = await puppeteer.launch(options);
  const page = await browser.newPage();
  await new Promise((res, rej) => setup({ specs, components }, err => err ? rej(err) : res())).then();
  await page.goto(`file:///${join(__dirname, 'index.html')}`, { waitUntil: 'domcontentloaded' });

  const testDone = () => page.evaluate(() => window['jsApiReporter'].status() === 'done');

  let exitCode = 0;
  const extractResult = async () => {
    try {
      let version = await page.$eval('.jasmine-version', text);
      let duration = await page.$eval('.jasmine-alert > .jasmine-duration', text);
      console.log(`Jasmine v${version} - ${duration}`);

      let totalSpecs = await page.$eval('.jasmine-overall-result.jasmine-bar', text);

      let symbs = await page.$$eval('.jasmine-symbol-summary li', items => items.map(item =>
        item.classList.contains('jasmine-passed') ? '✔ ' : '❌ '));
      let symbols = symbs.join('').trim();
      let pad = ''.padStart(symbols.length, '-');
      console.log(pad);
      console.log(symbols);
      console.log(pad);

      let hasFailures = await page.$eval('.jasmine-results > .jasmine-failures', n => n.hasChildNodes());
      if (hasFailures) {
        console.log('');
        let [success, failed] = totalSpecs.split(', ');
        console.log(`${failed} of ${success}.`);
        console.log('');
        let failures = await page.$$eval('.jasmine-spec-detail.jasmine-failed', details => {
          return details.map((detail, i) => {
            let [description, message] = <HTMLElement[]>Array.from(detail.children);
            let [msg, stack] = <HTMLElement[]>Array.from(message.children);
            let desc = '';
            let descs = description.innerText.split(' > ');
            for (let j = 0; j < descs.length; j++) {
              desc += `${''.padStart(j ? j + 3 : 0, ' ')}${j === 0 ? `${i + 1}) ` : ''}- ${descs[j]}\n`;
            }
            let traces = stack.innerText.replace(/file:\/\/\//g, '').trim();
            return { desc, message: `${msg.innerText}\n${traces.split('\n').slice(1).join('\n')}` };
          });
        });
        failures.forEach(({ desc, message }, i) => {
          console.log(desc);
          console.log(message);
          (i + 1) === failures.length && console.log('');
        });
        exitCode = 1;
      } else {
        console.log(totalSpecs);
      }
      !exitCode && console.log('');
      console.log(`Tests finished ${exitCode ? 'with errors' : 'successfully'}.`);
      exitCode && console.log('');
      if (options.headless) {
        await browser.close();
        exitCode && process.exit(exitCode);
      }
    } catch (error) {
      // console.log(error.message);
    }
  };

  waitFor(browser, testDone, extractResult, 30000);

})();

function text({ innerText }: HTMLElement) {
  return innerText;
}

function waitFor(browser: Browser, testDone: () => Promise<boolean>, extractResult: () => Promise<void>, timeOutMillis: number) {
  let maxtimeOutMillis = timeOutMillis || 3001, start = new Date().getTime(), condition = false;
  const interval = setInterval(async () => {
    if ((new Date().getTime() - start < maxtimeOutMillis) && !condition) {
      condition = await testDone();
    } else {
      if (!condition) {
        console.log('Test took too much time to execute');
        await browser.close();
        process.exit(1);
      } else {
        await extractResult();
        clearInterval(interval);
      }
    }
  }, 100);
}