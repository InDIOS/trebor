"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsdom_1 = require("jsdom");
function copyProps(src, target) {
    const props = Object.getOwnPropertyNames(src)
        .filter(prop => typeof target[prop] === 'undefined')
        .reduce((result, prop) => ({
        ...result,
        [prop]: Object.getOwnPropertyDescriptor(src, prop),
    }), {});
    Object.defineProperties(target, props);
}
global['window'] = new jsdom_1.JSDOM('<!DOCTYPE html><main>').window;
global['document'] = global['window'].document;
global['navigator'] = {
    userAgent: 'NodeJS',
    language: 'en'
};
copyProps(window, global);
