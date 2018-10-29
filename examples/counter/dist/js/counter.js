/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./main.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./main.ts":
/*!*****************************!*\
  !*** ./main.ts + 2 modules ***!
  \*****************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("\n// CONCATENATED MODULE: h:/trebor-repos/trebor-tools/index.js\nvar PROPS = ['$slots', '$refs', '$filters', '$directives', '_events', '_watchers'];\r\nvar PROP_MAP = { p: '__TP__', v: 'value', _: '_value', s: '_subscribers', e: '_events', w: '_watchers', h: 'prototype' };\r\nvar TPS = window[PROP_MAP.p] || (window[PROP_MAP.p] = []);\n\nvar array = Array[PROP_MAP.h];\r\nfunction _$toArgs(args, start) {\r\n    if (start === void 0) { start = 0; }\r\n    return array.slice.call(args, start);\r\n}\r\nfunction _$arrayValues(list, value, root, key) {\r\n    array.push.apply(list, value.map(function (v, i) {\r\n        if (list.length !== 0)\r\n            i += list.length;\r\n        return !(_$isType(v, _$List)) && _$isArray(v) ? new _$List(v, root, key + \".\" + i) : v;\r\n    }));\r\n}\r\nfunction _$List(value, root, key) {\r\n    var self = this;\r\n    Array.apply(self, [value.length]);\r\n    var desc = { writable: false, configurable: false, enumerable: false };\r\n    _$define(self, '_key', _$assign({ value: key }, desc));\r\n    _$define(self, '_root', _$assign({ value: root }, desc));\r\n    _$arrayValues(self, value, root, key);\r\n    desc.writable = true;\r\n    _$define(self, 'length', _$assign({ value: self.length }, desc));\r\n}\r\n_$extends(_$List, Array);\r\n['pop', 'push', 'reverse', 'shift', 'sort', 'fill', 'unshift', 'splice'].forEach(function (method) {\r\n    _$List[PROP_MAP.h][method] = function () {\r\n        var self = this;\r\n        var old = self.slice();\r\n        var result;\r\n        if (method === 'push') {\r\n            _$arrayValues(self, _$toArgs(arguments), self._root, self._key);\r\n            result = self.length;\r\n        }\r\n        else {\r\n            result = array[method].apply(self, arguments);\r\n        }\r\n        _$dispatch(self._root, self._key, old, self.slice());\r\n        return result;\r\n    };\r\n});\r\n_$List[PROP_MAP.h].pull = function (index) {\r\n    var self = this;\r\n    var items = _$toArgs(arguments, 1);\r\n    var length = self.length;\r\n    if (index > length) {\r\n        length = index + 1;\r\n        var pull = new Array(index - self.length);\r\n        pull.push.apply(pull, items);\r\n        for (var i = 0; i < length; i++) {\r\n            if (i === index) {\r\n                self.push.apply(self, pull);\r\n            }\r\n        }\r\n    }\r\n    else {\r\n        self.splice.apply(self, [index, 1].concat(items));\r\n    }\r\n};\n\nfunction _$select(selector, parent) {\r\n    return _$isString(selector) ? (parent || document).querySelector(selector) : selector;\r\n}\r\nfunction _$docFragment() {\r\n    return document.createDocumentFragment();\r\n}\r\nfunction _$append(parent, child, sibling) {\r\n    if (_$isType(sibling, 'boolean') && sibling)\r\n        parent.parentElement.replaceChild(child, parent);\r\n    else if (!sibling)\r\n        parent.appendChild(child);\r\n    else\r\n        parent.insertBefore(child, sibling);\r\n}\r\nfunction _$assignEl(source, dest) {\r\n    var childNodes = source.childNodes, attributes = source.attributes;\r\n    for (var i = 0; i < childNodes.length; i++) {\r\n        _$append(dest, childNodes[i]);\r\n    }\r\n    for (var i = 0; i < attributes.length; i++) {\r\n        var attr = attributes[i];\r\n        dest.setAttributeNS(source.namespaceURI, attr.name, attr.value);\r\n    }\r\n    source.parentElement.replaceChild(dest, source);\r\n    return dest;\r\n}\r\nfunction _$removeEl(el, parent) {\r\n    var root = parent || el.parentElement;\r\n    if (root)\r\n        root.removeChild(el);\r\n}\r\nfunction _$el(tagName) {\r\n    return document.createElement(tagName || 'div');\r\n}\r\nfunction _$svg(tagName) {\r\n    return document.createElementNS('http://www.w3.org/2000/svg', tagName || 'svg');\r\n}\r\nfunction _$text(content) {\r\n    return document.createTextNode(content || '');\r\n}\r\nfunction _$comment(content) {\r\n    return document.createComment(content || '');\r\n}\r\nfunction _$setAttr(el, attrAndValue) {\r\n    var attr = attrAndValue[0], value = attrAndValue[1];\r\n    el.setAttribute(attr, _$toString(value));\r\n    if (_$isValueAttr(attr) && !_$isString(value))\r\n        el[PROP_MAP._] = value;\r\n}\r\nfunction _$getAttr(el, attr) {\r\n    return _$isValueAttr(attr) ? _$getValue(el) : el.getAttribute(attr);\r\n}\r\nfunction _$getValue(el) {\r\n    return _$hasProp(el, PROP_MAP._) ? el[PROP_MAP._] : el[PROP_MAP.v];\r\n}\r\nfunction _$addListener(el, event, handler) {\r\n    el.addEventListener(event, handler, false);\r\n}\r\nfunction _$updateListener(el, event, oldHandler, newHandler) {\r\n    _$removeListener(el, event, oldHandler);\r\n    _$addListener(el, event, oldHandler = newHandler);\r\n    return oldHandler;\r\n}\r\nfunction _$removeListener(el, event, handler) {\r\n    el.removeEventListener(event, handler, false);\r\n}\r\nfunction _$bindGroup(input, selection) {\r\n    var _value = _$getValue(input);\r\n    var _$index = selection.indexOf(_value);\r\n    input.checked && !~_$index ? selection.push(_value) : selection.splice(_$index, 1);\r\n}\r\nfunction _$bindMultiSelect(select, selections) {\r\n    if (!selections.length)\r\n        return;\r\n    var options = select.options;\r\n    for (var i = 0; i < options.length; i++) {\r\n        options[i].selected = !!~selections.indexOf(_$getValue(options[i]));\r\n    }\r\n}\r\nfunction _$updateMultiSelect(select, obj, prop) {\r\n    var items = [];\r\n    var selection = obj[prop];\r\n    var selectedOptions = select.selectedOptions;\r\n    for (var i = 0; i < selectedOptions.length; i++) {\r\n        items.push(_$getValue(selectedOptions[i]));\r\n    }\r\n    obj[prop] = new _$List(items, selection['_root'], selection['_key']);\r\n    obj.$update();\r\n}\r\nfunction _$insertStyle(id, css) {\r\n    var isNew = false;\r\n    var style = _$select(\"#\" + id, document.head);\r\n    if (!style) {\r\n        isNew = true;\r\n        style = _$el('style');\r\n        style.id = id;\r\n        _$setAttr(style, ['refs', 1]);\r\n    }\r\n    if (style.textContent !== css) {\r\n        style.textContent = css;\r\n    }\r\n    if (isNew) {\r\n        _$append(document.head, style);\r\n    }\r\n    else {\r\n        var count = +_$getAttr(style, 'refs');\r\n        _$setAttr(style, ['refs', ++count]);\r\n    }\r\n}\r\nfunction _$removeStyle(id) {\r\n    var style = _$select(\"#\" + id, document.head);\r\n    if (style) {\r\n        var count = +_$getAttr(style, 'refs');\r\n        if (--count === 0) {\r\n            _$removeEl(style, document.head);\r\n        }\r\n        else {\r\n            _$setAttr(style, ['refs', count]);\r\n        }\r\n    }\r\n}\n\nfunction _$toLowerCase(str) {\r\n    return str.toLowerCase();\r\n}\r\nvar _$assign = Object['assign'] || function (t) {\r\n    for (var s = void 0, i = 1, n = arguments.length; i < n; i++) {\r\n        s = arguments[i];\r\n        for (var p in s)\r\n            if (_$hasProp(s, p))\r\n                t[p] = s[p];\r\n    }\r\n    return t;\r\n};\r\nfunction _$apply(callee, args, globs, thisArg) {\r\n    if (thisArg === void 0) { thisArg = null; }\r\n    return callee.apply(thisArg, args.concat(globs));\r\n}\r\nfunction _$isValueAttr(attr) {\r\n    return attr === 'value';\r\n}\r\nfunction _$subscribers(dep, listener) {\r\n    if (!this[PROP_MAP.s][dep]) {\r\n        this[PROP_MAP.s][dep] = [];\r\n    }\r\n    return this[PROP_MAP.s][dep].push(listener.bind(this)) - 1;\r\n}\r\nfunction _$define(obj, key, desc) {\r\n    Object.defineProperty(obj, key, desc);\r\n}\r\nfunction _$dispatch(root, key, oldVal, value) {\r\n    root.$notify(key);\r\n    if (root[PROP_MAP.w][key]) {\r\n        _$each(root[PROP_MAP.w][key], function (watcher) { watcher(oldVal, value); });\r\n    }\r\n    root.$update();\r\n}\r\nfunction _$extends(ctor, exts) {\r\n    ctor[PROP_MAP.h] = Object.create(exts[PROP_MAP.h]);\r\n    ctor[PROP_MAP.h].constructor = ctor;\r\n}\r\nfunction _$isType(value, type) {\r\n    return _$type(type) === 'string' ? type.split('\\|').some(function (t) { return t.trim() === _$type(value); }) : value instanceof type;\r\n}\r\nfunction _$isObject(obj) {\r\n    return _$isType(obj, 'object');\r\n}\r\nfunction _$isArray(obj) {\r\n    return Array.isArray ? Array.isArray(obj) : _$isType(obj, 'array');\r\n}\r\nfunction _$isFunction(obj) {\r\n    return _$isType(obj, 'function');\r\n}\r\nfunction _$isString(obj) {\r\n    return _$isType(obj, 'string');\r\n}\r\nfunction _$toType(value, type, root, key) {\r\n    switch (type) {\r\n        case 'date':\r\n            return new Date(value);\r\n        case 'string':\r\n            return _$toString(value);\r\n        case 'number':\r\n            return +value;\r\n        case 'boolean':\r\n            return _$isString(value) && !value ? true : !!value;\r\n        case 'array':\r\n            return _$isType(value, _$List) ? value : new _$List(value, root, key);\r\n        default:\r\n            return value;\r\n    }\r\n}\r\nfunction _$type(obj) {\r\n    return _$toLowerCase(/ (\\w+)/.exec({}.toString.call(obj))[1]);\r\n}\r\nfunction _$hasProp(obj, prop) {\r\n    return obj.hasOwnProperty(prop);\r\n}\r\nfunction _$directive(dd) {\r\n    var hasProp = function (prop, instance, options, element) { return _$isObject(dd) && dd[prop] && dd[prop](instance, options, element); };\r\n    return {\r\n        $init: function (instance, options, element) {\r\n            hasProp('$init', instance, options, element);\r\n        },\r\n        $inserted: function (instance, options, element) {\r\n            hasProp('$inserted', instance, options, element);\r\n        },\r\n        $update: function (instance, options, element) {\r\n            if (_$isFunction(dd)) {\r\n                dd(instance, options, element);\r\n            }\r\n            else {\r\n                hasProp('$update', instance, options, element);\r\n            }\r\n        },\r\n        $destroy: function (instance, options, element) {\r\n            hasProp('$destroy', instance, options, element);\r\n        }\r\n    };\r\n}\r\nfunction _$noop() { }\r\nfunction _$addChild(inst, Child, attrs) {\r\n    var child = null;\r\n    if (Child) {\r\n        child = new Child(attrs, inst);\r\n        inst.$children.push(child);\r\n    }\r\n    return child;\r\n}\r\nfunction _$removeChild(inst, child) {\r\n    var index = inst.$children.indexOf(child);\r\n    index >= 0 && inst.$children.splice(index, 1);\r\n}\r\nfunction _$toString(obj) {\r\n    var str = _$type(obj);\r\n    return !/null|undefined/.test(str) ? obj.toString() : str;\r\n}\r\nfunction _$toPlainObject(obj) {\r\n    var data = {};\r\n    _$each(_$isObject(obj) ? obj : {}, function (_v, k) {\r\n        if (k[0] !== '$' && !_$isFunction(obj[k])) {\r\n            if (_$isType(obj[k], _$List)) {\r\n                data[k] = obj[k].map(_$toPlainObject);\r\n            }\r\n            else if (_$isObject(obj[k])) {\r\n                data[k] = _$toPlainObject(obj[k]);\r\n            }\r\n            else {\r\n                data[k] = obj[k];\r\n            }\r\n        }\r\n    });\r\n    return _$isObject(obj) ? data : obj;\r\n}\r\nfunction _$setReference(refs, prop, node) {\r\n    if (!_$hasProp(refs, prop)) {\r\n        var value_1 = [];\r\n        _$define(refs, prop, {\r\n            get: function () { return value_1.length <= 1 ? value_1[0] : value_1; },\r\n            set: function (val) { val && !~value_1.indexOf(val) && value_1.push(val); },\r\n            enumerable: true, configurable: true\r\n        });\r\n    }\r\n    refs[prop] = node;\r\n}\r\nfunction _$accesor(object, path, value) {\r\n    return path.split('.').reduce(function (obj, key, i, arr) {\r\n        if (_$isType(value, 'undefined')) {\r\n            if (obj == null) {\r\n                arr.splice(0, arr.length);\r\n                return i > 0 && obj === null ? obj : undefined;\r\n            }\r\n        }\r\n        else {\r\n            if (i === arr.length - 1) {\r\n                if (_$isType(obj, _$List) && _$toString(+key) === key) {\r\n                    obj.pull(+key, value);\r\n                }\r\n                else {\r\n                    var oldVal = obj[key];\r\n                    obj[key] = !_$isType(value, _$List) && _$isArray(value) ? new _$List(value, object, key) : value;\r\n                    _$dispatch(object, path, oldVal, obj[key]);\r\n                }\r\n            }\r\n            else if (!_$isObject(obj[key])) {\r\n                obj[key] = {};\r\n            }\r\n        }\r\n        return obj ? obj[key] : null;\r\n    }, object);\r\n}\r\nfunction _$emptyElse() {\r\n    return { type: 'empty-else', $create: _$noop, $mount: _$noop, $update: _$noop, $destroy: _$noop };\r\n}\r\nfunction _$isKey(event, key) {\r\n    return _$toLowerCase(event.key) === key || !!event[key + \"Key\"];\r\n}\r\nfunction _$bindClasses(value) {\r\n    var classes = '';\r\n    if (_$isString(value)) {\r\n        classes += \" \" + value;\r\n    }\r\n    else if (_$isArray(value)) {\r\n        classes = value.map(_$bindClasses).join(' ');\r\n    }\r\n    else if (_$isObject(value)) {\r\n        for (var key in value)\r\n            if (_$hasProp(value, key) && value[key])\r\n                classes += \" \" + key;\r\n    }\r\n    return classes.trim();\r\n}\r\nfunction _$bindStyle(value) {\r\n    var el = _$el();\r\n    if (_$isObject(value)) {\r\n        var style_1 = el.style;\r\n        _$each(value, function (val, prop) {\r\n            if (val !== style_1[prop])\r\n                style_1[prop] = val;\r\n        });\r\n        return style_1.cssText;\r\n    }\r\n    else if (_$isString(value)) {\r\n        return value;\r\n    }\r\n    else {\r\n        return '';\r\n    }\r\n}\r\nfunction _$conditionalUpdate(block, condition, parent, anchor, inst) {\r\n    var globs = _$toArgs(arguments, 5);\r\n    if (block && block.type === _$apply(condition, [inst], globs).type) {\r\n        _$apply(block.$update, [inst], globs, block);\r\n    }\r\n    else {\r\n        block && block.$destroy();\r\n        block = _$apply(condition, [inst], globs);\r\n        block.$create();\r\n        block.$mount(parent || inst.$parentEl, anchor);\r\n    }\r\n    return block;\r\n}\r\nfunction _$bindUpdate(el, binding) {\r\n    var attr = binding[0], value = binding[1];\r\n    var _value = _$toString(value);\r\n    if (_$isValueAttr(attr)) {\r\n        if (el[attr] !== _value)\r\n            el[attr] = _value;\r\n        el[PROP_MAP._] = value;\r\n    }\r\n    else if (_$getAttr(el, attr) !== _value) {\r\n        _$setAttr(el, [attr, _value]);\r\n    }\r\n}\r\nfunction _$bindBooleanAttr(el, attrAndValue) {\r\n    var attr = attrAndValue[0], value = attrAndValue[1];\r\n    el[attr] = value == null || value === false ? (el.removeAttribute(attr), false) : (_$setAttr(el, [attr, '']), true);\r\n}\r\nfunction _$textUpdate(text, value) {\r\n    if (text.data !== (value = _$toString(value)))\r\n        text.data = value;\r\n}\r\nfunction _$tagUpdate(node, tag) {\r\n    return _$toLowerCase(tag) !== _$toLowerCase(node.tagName) ? _$assignEl(node, _$el(tag)) : node;\r\n}\r\nfunction _$removeReference(refs, prop, node) {\r\n    var nodes = refs[prop];\r\n    _$isArray(nodes) ? refs[prop].splice(nodes.indexOf(node), 1) : (delete refs[prop]);\r\n}\r\nfunction _$htmlUpdate(node, value) {\r\n    if (node.innerHTML !== (value = _$toString(value)))\r\n        node.innerHTML = value;\r\n}\r\nfunction _$componentUpdate(parent, Ctor, inst, value, attrs, el, sibling) {\r\n    if (value === Ctor) {\r\n        inst && inst.$update();\r\n    }\r\n    else {\r\n        Ctor = value;\r\n        if (inst) {\r\n            inst.$destroy();\r\n            _$removeChild(parent, inst);\r\n        }\r\n        if (inst) {\r\n            inst = _$addChild(parent, Ctor, attrs);\r\n            inst.$create();\r\n            inst.$mount(el, sibling);\r\n        }\r\n    }\r\n    return [inst, Ctor];\r\n}\r\nfunction _$destroyComponent(component) {\r\n    component.$unmount();\r\n    component.$parent = null;\r\n    component.$parentEl = null;\r\n    component.$siblingEl = null;\r\n    component.$children.splice(0, component.$children.length);\r\n}\r\nfunction _$setElements(component, parent, sibling) {\r\n    var brother = _$select(sibling);\r\n    component.$siblingEl = brother;\r\n    component.$parentEl = sibling && brother.parentElement || _$select(parent);\r\n}\r\nfunction _$forLoop(root, obj, loop) {\r\n    var items = {}, loopParent, loopSibling;\r\n    var globs = _$toArgs(arguments, 3);\r\n    _$each(obj, function (item, i, index) { items[i] = _$apply(loop, [root, item, i, index], globs); });\r\n    return {\r\n        $create: function () {\r\n            _$each(items, function (item) { item.$create(); });\r\n        },\r\n        $mount: function (parent, sibling) {\r\n            loopParent = _$select(parent);\r\n            loopSibling = _$select(sibling);\r\n            _$each(items, function (item) { item.$mount(loopParent, loopSibling); });\r\n        },\r\n        $update: function (root, obj) {\r\n            var globs = _$toArgs(arguments, 2);\r\n            _$each(items, function (item, i, index) {\r\n                if (obj[i]) {\r\n                    _$apply(item.$update, [root, obj[i], i, index], globs, item);\r\n                }\r\n                else {\r\n                    item.$destroy();\r\n                    delete items[i];\r\n                }\r\n            });\r\n            _$each(obj, function (item, i, index) {\r\n                if (!items[i]) {\r\n                    items[i] = _$apply(loop, [root, item, i, index], globs);\r\n                    items[i].$create();\r\n                    items[i].$mount(loopParent, loopSibling);\r\n                }\r\n            });\r\n        },\r\n        $destroy: function () {\r\n            _$each(items, function (item) { item.$destroy(); });\r\n        }\r\n    };\r\n}\r\nfunction _$each(obj, cb) {\r\n    var i = 0;\r\n    for (var key in obj) {\r\n        if (_$hasProp(obj, key)) {\r\n            cb(obj[key], (isNaN(+key) ? key : +key), i++);\r\n        }\r\n    }\r\n}\n\nfunction _$BaseComponent(attrs, template, options, parent) {\r\n    var self = this;\r\n    var _$set = function (prop, value) { _$define(self, prop, { value: value, writable: true }); };\r\n    if (!attrs)\r\n        attrs = {};\r\n    _$each(PROPS, function (prop) { _$define(self, prop, { value: {} }); });\r\n    _$set('$parent', parent || null);\r\n    _$set('$children', []);\r\n    _$set(PROP_MAP.s, {});\r\n    _$set('$options', options);\r\n    var opts = self.$options;\r\n    if (!opts.attrs)\r\n        opts.attrs = {};\r\n    if (!opts.children)\r\n        opts.children = {};\r\n    _$each(TPS, function (plugin) { plugin.fn.call(self, _$BaseComponent, plugin.options); });\r\n    if (opts.filters)\r\n        _$assign(self.$filters, opts.filters);\r\n    if (opts.directives)\r\n        _$each(opts.directives, function (drt, k) { self.$directives[k] = _$directive(drt); });\r\n    _$each(opts.attrs, function (attrOps, key) {\r\n        _$define(self, (_$isType(key, 'number') ? attrOps : key), {\r\n            get: function () {\r\n                if (_$isString(attrOps)) {\r\n                    var value = attrs[attrOps];\r\n                    return _$isFunction(value) ? value() : value;\r\n                }\r\n                else {\r\n                    if (!_$hasProp(attrs, key) && attrOps.required) {\r\n                        return console.error(\"Attribute '\" + key + \"' is required.\");\r\n                    }\r\n                    else {\r\n                        var value = _$isFunction(attrs[key]) ? attrs[key]() : attrs[key];\r\n                        if (value === void 0 && _$hasProp(attrOps, 'default')) {\r\n                            var def = attrOps.default;\r\n                            value = _$isFunction(def) ? def() : def;\r\n                        }\r\n                        var typ = attrOps.type;\r\n                        if (typ && !_$isType(value, typ) && attrOps.required) {\r\n                            return console.error(\"Attribute '\" + key + \"' must be type '\" + typ + \"'.\");\r\n                        }\r\n                        value = _$toType(value, value === void 0 ? 'undefined' : typ, self, key);\r\n                        if (value !== void 0 && _$hasProp(attrOps, 'validator')) {\r\n                            var validator = attrOps.validator;\r\n                            if (_$isFunction(validator) && !validator(value)) {\r\n                                return console.error(\"Assigment '\" + key + \"'='\" + JSON.stringify(value) + \"' invalid.\");\r\n                            }\r\n                        }\r\n                        return value;\r\n                    }\r\n                }\r\n            },\r\n            set: function () {\r\n                console.error(\"'\" + key + \"' is read only.\");\r\n            },\r\n            enumerable: true, configurable: true\r\n        });\r\n    });\r\n    var data = opts.model || {};\r\n    var _loop_1 = function (key) {\r\n        if (_$hasProp(data, key)) {\r\n            var desc = Object.getOwnPropertyDescriptor(data, key);\r\n            if (desc.value && _$isArray(desc.value)) {\r\n                desc.value = new _$List(desc.value, self, key);\r\n            }\r\n            else {\r\n                if (desc.get) {\r\n                    var getter_1 = desc.get;\r\n                    desc.get = function () {\r\n                        var value = getter_1.call(self);\r\n                        if (_$isArray(value))\r\n                            value = new _$List(value, self, key);\r\n                        return value;\r\n                    };\r\n                }\r\n                if (desc.set) {\r\n                    var setter_1 = desc.set;\r\n                    desc.set = function (v) {\r\n                        if (_$isArray(v))\r\n                            v = new _$List(v, self, key);\r\n                        setter_1.call(self, v);\r\n                    };\r\n                }\r\n            }\r\n            _$define(self, key, desc);\r\n        }\r\n    };\r\n    for (var key in data) {\r\n        _loop_1(key);\r\n    }\r\n    var tpl = template(self);\r\n    _$each(tpl, function (value, key) {\r\n        _$define(self, key, {\r\n            value: (function (key) {\r\n                var hook = key[1].toUpperCase() + key.slice(2);\r\n                var bhook = opts[\"will\" + hook];\r\n                var ahook = opts[\"did\" + hook];\r\n                return function () {\r\n                    bhook && bhook.call(this);\r\n                    key === '$update' ? value.call(this, this) : value.apply(this, arguments);\r\n                    ahook && ahook.call(this);\r\n                };\r\n            })(key)\r\n        });\r\n    });\r\n    _$define(self, '$data', {\r\n        get: function () {\r\n            return _$toPlainObject(this);\r\n        }\r\n    });\r\n}\r\n_$assign(_$BaseComponent[PROP_MAP.h], {\r\n    $get: function (path) {\r\n        return _$accesor(this, path);\r\n    },\r\n    $set: function (path, value) {\r\n        _$accesor(this, path, value);\r\n    },\r\n    $on: function (event, handler) {\r\n        var _this = this;\r\n        if (!this[PROP_MAP.e][event]) {\r\n            this[PROP_MAP.e][event] = [];\r\n        }\r\n        var i = this[PROP_MAP.e][event].push(handler);\r\n        return {\r\n            $off: function () {\r\n                _this[PROP_MAP.e][event].splice(i - 1, 1);\r\n            }\r\n        };\r\n    },\r\n    $once: function (event, handler) {\r\n        var e = this.$on(event, function (args) {\r\n            handler(args);\r\n            e.$off();\r\n        });\r\n    },\r\n    $fire: function (event, data) {\r\n        if (this[PROP_MAP.e][event]) {\r\n            _$each(this[PROP_MAP.e][event], function (handler) { handler(data); });\r\n        }\r\n    },\r\n    $notify: function (key) {\r\n        if (this[PROP_MAP.s][key]) {\r\n            _$each(this[PROP_MAP.s][key], function (suscriber) { suscriber(); });\r\n        }\r\n    },\r\n    $observe: function (deps, listener) {\r\n        var _this = this;\r\n        var subs = [];\r\n        if (_$isArray(deps)) {\r\n            _$each(deps, function (dep) {\r\n                subs.push({ sub: dep, i: _$subscribers.call(_this, dep, listener) });\r\n            });\r\n        }\r\n        else {\r\n            subs.push({ sub: deps, i: _$subscribers.call(this, deps, listener) });\r\n        }\r\n        return {\r\n            $unobserve: function () {\r\n                _$each(subs, function (sub) {\r\n                    _this[PROP_MAP.s][sub.sub].splice(sub.i, 1);\r\n                });\r\n            }\r\n        };\r\n    },\r\n    $watch: function (key, watcher) {\r\n        var _this = this;\r\n        if (!this[PROP_MAP.w][key]) {\r\n            this[PROP_MAP.w][key] = [];\r\n        }\r\n        var i = this[PROP_MAP.w][key].push(watcher.bind(this));\r\n        return {\r\n            $unwatch: function () {\r\n                _this[PROP_MAP.w][key].splice(i - 1, 1);\r\n            }\r\n        };\r\n    }\r\n});\r\nfunction _$Ctor(moduleName, tpl, options) {\r\n    var _a;\r\n    var ctor = (_a = {},\r\n        _a[moduleName] = function (_$attrs, _$parent) {\r\n            _$BaseComponent.call(this, _$attrs, tpl, options, _$parent);\r\n            !_$parent && this.$create();\r\n        },\r\n        _a)[moduleName];\r\n    ctor.plugin = function (fn, options) {\r\n        TPS.push({ options: options, fn: fn });\r\n    };\r\n    _$extends(ctor, _$BaseComponent);\r\n    return ctor;\r\n}\n\n\n//# sourceMappingURL=index.js.map\n\n// CONCATENATED MODULE: ./components/counter.html\n\r\nfunction _$tplCounter(_$state) {\r\n  var _$frag, div_1, h3_1, label_1, strong_1, txt_1, setTxt_1, bindClassStrong_1, br_1, button_1, txt_2, clickEvent_1, handlerClickEvent_1, button_2, txt_3, clickEvent_2, handlerClickEvent_2;\r\n  _$frag = _$docFragment();\r\n  setTxt_1 = function(_$state) {\r\n    return _$state.count;\r\n  };\r\n  bindClassStrong_1 = function(_$state) {\r\n    return ['class', _$bindClasses(_$state.negative).trim()];\r\n  };\r\n  clickEvent_1 = function(_$state) {\r\n    _$state.increment();\r\n  };\r\n  clickEvent_2 = function(_$state) {\r\n    _$state.decrement();\r\n  };\r\n  return {\r\n    $create: function() {\r\n      div_1 = _$el();\r\n      h3_1 = _$el('h3');\r\n      h3_1.innerHTML = 'Counter Example';\r\n      label_1 = _$el('label');\r\n      label_1.innerHTML = 'Counter: ';\r\n      strong_1 = _$el('strong');\r\n      txt_1 = _$text();\r\n      txt_1.data = setTxt_1(_$state);\r\n      br_1 = _$el('br');\r\n      br_1.innerHTML = '';\r\n      button_1 = _$el('button');\r\n      txt_2 = _$text('Increment');\r\n      button_2 = _$el('button');\r\n      txt_3 = _$text('Decrement');\r\n      _$setAttr(h3_1, ['class', 'title is-3']);\r\n      _$setAttr(strong_1, bindClassStrong_1(_$state));\r\n      _$setAttr(button_1, ['class', 'button is-primary']);\r\n      _$addListener(button_1, 'click', handlerClickEvent_1 = function(event) {\r\n        clickEvent_1(_$state, event, button_1);\r\n      });\r\n      _$setAttr(button_2, ['class', 'button is-danger']);\r\n      _$addListener(button_2, 'click', handlerClickEvent_2 = function(event) {\r\n        clickEvent_2(_$state, event, button_2);\r\n      });\r\n      _$setAttr(div_1, ['class', 'container']);\r\n    },\r\n\r\n    $mount: function(parent, sibling) {\r\n      this.$unmount();\r\n      _$insertStyle('scope_a64f8780', '.negative {color:crimson;}');\r\n      _$append(_$select(parent), _$frag, _$select(sibling));\r\n      _$setElements(this, parent, sibling);\r\n    },\r\n\r\n    $update: function(_$state) {\r\n      _$textUpdate(txt_1, setTxt_1(_$state));\r\n      _$bindUpdate(strong_1, bindClassStrong_1(_$state));\r\n    },\r\n\r\n    $unmount: function() {\r\n      _$append(div_1, h3_1);\r\n      _$append(div_1, label_1);\r\n      _$append(strong_1, txt_1);\r\n      _$append(div_1, strong_1);\r\n      _$append(div_1, br_1);\r\n      _$append(button_1, txt_2);\r\n      _$append(div_1, button_1);\r\n      _$append(button_2, txt_3);\r\n      _$append(div_1, button_2);\r\n      _$append(_$frag, div_1);\r\n    },\r\n\r\n    $destroy: function() {\r\n      _$destroyComponent(this);\r\n      _$removeStyle('scope_a64f8780');\r\n      _$removeListener(button_1, 'click', handlerClickEvent_1);\r\n      _$removeListener(button_2, 'click', handlerClickEvent_2);\r\n      delete _$state.$root;\r\n      _$frag = div_1 = h3_1 = label_1 = strong_1 = txt_1 = setTxt_1 = bindClassStrong_1 = br_1 = button_1 = txt_2 = clickEvent_1 = handlerClickEvent_1 = button_2 = txt_3 = clickEvent_2 = handlerClickEvent_2 = void 0;\r\n    }\r\n  };\r\n}\r\nvar Counter = _$Ctor('Counter', _$tplCounter, {\r\n  model: {\r\n    count: 0,\r\n\r\n    increment: function() {\r\n      this.$set('count', this.count + 1);\r\n    },\r\n\r\n    decrement: function() {\r\n      this.$set('count', this.count - 1);\r\n    },\r\n\r\n    get negative() {\r\n      return {\r\n        negative: this.count < 0\r\n      };\r\n    }\r\n  }\r\n});\r\n/* harmony default export */ var counter = (Counter);\r\n\n// CONCATENATED MODULE: ./main.ts\n\r\nvar main_counter = new counter();\r\nmain_counter.$mount('main');\r\n\n\n//# sourceURL=webpack:///./main.ts_+_2_modules?");

/***/ })

/******/ });