import { getPage, getComponent, exec } from '../utils';
import { Page, JSHandle, ElementHandle } from 'puppeteer';

describe('Component Binding', () => {
  let page: Page;
  let instance: JSHandle<Component>;

  beforeAll(async () => {
    page = await getPage(browser, 'bind');
    [, instance] = await getComponent<typeof Component, Component>(page, 'Bind');
  });

  afterAll(async () => {
    await jestPuppeteer.resetBrowser();
  });

  describe('$name directive', () => {
    describe('in a checked checkbox', () => {
      it('should add value to an array', async () => {
        await page.click('#checkbox_1');
        expect(await exec(instance, i => i.checkboxes.length)).toBe(1);
        expect(await exec(instance, i => i.checkboxes[0])).toBe('Yes');
      });

      it('with bond value should add object to an array', async () => {
        await page.click('#checkbox_3');
        expect(await exec(instance, i => i.checkboxes_1.length)).toBe(1);
        const obj: { value: string } = await exec(instance, i => i.checkboxes_1[0]);
        expect(obj).toBeDefined();
        expect(typeof obj).toBe('object');
        expect(obj).toEqual({ value: 'Yes' });
      });
    });

    describe('in an unchecked checkbox', () => {
      it('should remove value from the array', async () => {
        await page.click('#checkbox_1');
        expect(await exec(instance, i => i.checkboxes.length)).toBe(0);
      });

      it('with bond value should remove value from the array', async () => {
        await page.click('#checkbox_3');
        expect(await exec(instance, i => i.checkboxes_1.length)).toBe(0);
      });
    });

    describe('in a checked radio', () => {
      it('should assign value to the property', async () => {
        await page.click('#radio_1');
        await page.click('#radio_1');
        expect(await exec(instance, i => i.radios)).toBe('radio 1');
      });

      it('with bond value should assign the object value to the property', async () => {
        await page.click('#radio_5');
        const obj: { value: string } = await exec(instance, i => i.radios_1);
        expect(obj).toBeDefined();
        expect(typeof obj).toBe('object');
        expect(obj).toEqual({ value: 'radio 5' });
      });
    });
  });

  describe('$value directive', () => {
    it('should change text input value from model', async () => {
      await exec(instance, i => i.$set('textValue', 'some text'));
      const input: ElementHandle<HTMLInputElement> = await page.$('#text');
      expect(await exec(input, e => e.value)).toBe('some text');
    });

    it('should change number input value from model', async () => {
      await exec(instance, i => i.$set('numValue', 10));
      const input: ElementHandle<HTMLInputElement> = await page.$('#number');
      expect(await exec(input, e => e.value)).toBe('10');
    });
  });

  describe('input.value', () => {
    it('should change text input value in model', async () => {
      await page.click('#text', { clickCount: 3 });
      await page.type('#text', 'text test');
      expect(await exec(instance, i => i.textValue)).toBe('text test');
    });

    it('should change number input value in model', async () => {
      await page.click('#number', { clickCount: 3 });
      await page.type('#number', '5');
      expect(await exec(instance, i => i.numValue)).toBe(5);
    });
  });
});