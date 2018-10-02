"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("../helpers/setup");
const keysim_1 = require("keysim");
const Component = require('../components/bind.umd');
function fireClick(element) {
    let event = new window['MouseEvent']('click', { bubbles: true, cancelable: true, view: window });
    element.dispatchEvent(event);
}
describe('Component Bind', () => {
    let instance;
    beforeAll(done => {
        instance = new Component();
        instance.$mount('main');
        done();
    });
    it('`$name` in checkbox should add value to an array', () => {
        let input = document.querySelector('#checkbox_1');
        fireClick(input);
        expect(instance.checkboxes.length).toBe(1);
        expect(instance.checkboxes[0]).toBe('Yes');
    });
    it('`$name` in a checked checkbox should remove value from the array', () => {
        let input = document.querySelector('#checkbox_1');
        fireClick(input);
        expect(instance.checkboxes.length).toBe(0);
    });
    it('`$name` in a radio should change value of the property', () => {
        let input = document.querySelector('#radio_1');
        fireClick(input);
        expect(instance.radios).toBe('radio 1');
    });
    it('`$value` should change input value from model', () => {
        instance.$set('textValue', 'some text');
        let input = document.querySelector('#text');
        expect(input.value).toBe('some text');
    });
    it('`input.value` should change input value in model', () => {
        let input = document.querySelector('#text');
        let keyboard = keysim_1.Keyboard.US_ENGLISH;
        input.value = input.value + ' to test';
        keyboard.dispatchEventsForInput(input.value, input);
        expect(instance.textValue).toBe('some text to test');
    });
});
