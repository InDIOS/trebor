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
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
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
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });

// CONCATENATED MODULE: d:/OTHERS/Downloads/comp-test/tools/index.js
function _$CompCtr(attrs, template, options) {
    var _this = this;
    if (!attrs)
        attrs = {};
    ['$slots', '$refs', '$filters', '$directives', '_events', '_watchers']
        .forEach(function (prop) { _$def(_this, prop, { value: {} }); });
    _$def(this, '_subscribers', { value: {}, writable: true });
    _$def(this, '$options', { value: options, writable: true });
    if (!this.$options.attrs)
        this.$options.attrs = {};
    if (options.filters)
        _$e(options.filters, function (filter, key) { _this.$filters[key] = filter; });
    if (!this.$options.children)
        this.$options.children = {};
    if (options.directives)
        _$e(options.directives, function (directive, key) { _this.$directives[key] = _$drt(directive); });
    _$e(this.$options.attrs, function (attrOps, key) {
        _$def(_this, _$isType(key, 'number') ? attrOps : key, {
            get: function () {
                if (_$isType(attrOps, 'string')) {
                    return _$isType(attrs[attrOps], 'function') ? attrs[attrOps]() : attrs[attrOps];
                }
                else {
                    if (!_$hasProp(attrs, key) && attrOps.required) {
                        console.error("Attribute '" + key + "' most be present because it's required.");
                    }
                    else {
                        var value = _$isType(attrs[key], 'function') ? attrs[key]() : attrs[key];
                        if (value === void 0 && _$hasProp(options, 'default')) {
                            value = _$isType(attrOps.default, 'function') ? attrOps.default : attrOps.default();
                        }
                        if (attrOps.type && !_$isType(value, attrOps.type)) {
                            return console.error("Attribute '" + key + "' most be type '" + attrOps.type + "'.");
                        }
                        return _$toType(value, attrOps.type, this, key);
                    }
                }
            },
            set: function () {
                console.error("Can not modify attribute '" + key + "' because attributes al read only.");
            },
            enumerable: true, configurable: true
        });
    });
    var mounted = (this.$options.model || {}).mounted || function () { };
    this.$set(this.$options.model || {});
    var tpl = template(this, this.$options.children);
    _$e(tpl, function (value, key) {
        if (key === '$mount') {
            value = (function (key) {
                return function (parent, sibling) {
                    this.$root = _$(parent);
                    tpl[key].call(this, parent, sibling);
                    mounted.call(this);
                };
            })(key);
        }
        _$def(_this, key, { value: value });
    });
    _$def(this, '$data', {
        get: function () {
            return _$toPlainObj(this);
        }
    });
    this.$create();
}
_$CompCtr.prototype.$set = function (value) {
    _$accesor(this, value, this, null);
};
_$CompCtr.prototype.$on = function (event, handler) {
    var _this = this;
    if (!this._events[event]) {
        this._events[event] = [];
    }
    var i = this._events[event].push(handler);
    return {
        $off: function () {
            _this._events[event].splice(i - 1, 1);
        }
    };
};
_$CompCtr.prototype.$once = function (event, handler) {
    var e = this.$on(event, function (args) {
        handler(args);
        e.$off();
    });
};
_$CompCtr.prototype.$fire = function (event, data) {
    if (this._events[event]) {
        this._events[event].forEach(function (handler) { handler(data); });
    }
};
_$CompCtr.prototype.$notify = function (key) {
    if (this._subscribers[key]) {
        this._subscribers[key].forEach(function (suscriber) { suscriber(); });
    }
};
_$CompCtr.prototype.$observe = function (deps, listener) {
    var _this = this;
    var subs = [];
    if (Array.isArray(deps)) {
        deps.forEach(function (dep) {
            subs.push({ sub: dep, i: _$subs.call(_this, dep, listener) });
        });
    }
    else {
        subs.push({ sub: deps, i: _$subs.call(this, deps, listener) });
    }
    return {
        $unobserve: function () {
            subs.forEach(function (sub) {
                _this._subscribers[sub.sub].splice(sub.i, 1);
            });
        }
    };
};
_$CompCtr.prototype.$watch = function (key, watcher) {
    var _this = this;
    if (!this._watchers[key]) {
        this._watchers[key] = [];
    }
    var i = this._watchers[key].push(watcher.bind(this));
    return {
        $unwatch: function () {
            _this._watchers[key].splice(i - 1, 1);
        }
    };
};
var array = Array.prototype;
function _$arrayValues(list, value, root, key) {
    value.forEach(function (v) {
        array.push.call(list, null);
        _$accesor(list, (_a = {}, _a[list.length - 1] = v, _a), root, key);
        var _a;
    });
}
function _$List(value, root, key) {
    Array.apply(this, [value.length]);
    _$arrayValues(this, value, root, key);
    _$def(this, 'length', { value: value.length, writable: true, configurable: false, enumerable: false });
    ['pop', 'push', 'reverse', 'shift', 'sort', 'fill', 'unshift', 'splice'].forEach(function (method) {
        _$List.prototype[method] = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            var old = this.slice();
            var result;
            if (method === 'push') {
                _$arrayValues(this, args, root, key);
                result = this.length;
            }
            else {
                result = array[method].apply(this, args);
            }
            _$dispatch(root, key, old, this.slice());
            return result;
        };
    });
}
_$List.prototype = Object.create(array);
_$List.prototype.constructor = _$List;
_$List.prototype.pull = function (index) {
    var items = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        items[_i - 1] = arguments[_i];
    }
    var length = this.length;
    if (index > length) {
        length = index + 1;
        var pull = new Array(index - this.length);
        pull.push.apply(pull, items);
        for (var i = 0; i < length; i++) {
            if (i === index) {
                this.push.apply(this, pull);
            }
        }
    }
    else {
        this.splice.apply(this, [index, 1].concat(items));
    }
};
function _$dispatch(root, key, oldVal, value) {
    root.$notify(key);
    if (root._watchers[key]) {
        root._watchers[key].forEach(function (watcher) { watcher(oldVal, value); });
    }
    root.$update(root);
}
function _$isType(value, type) {
    return _$type(type) === 'function' ? value instanceof type : _$type(value) === type;
}
function _$isObject(obj) {
    return _$isType(obj, 'object');
}
function _$toType(value, type, root, key) {
    switch (type) {
        case 'date':
            return new Date(value);
        case 'string':
            return value.toString();
        case 'number':
            return +value;
        case 'boolean':
            return !!value;
        case 'array':
            return value instanceof _$List ? value : new _$List(value, root, key);
        case 'object':
            _$accesor(value, value, root, key);
            return value;
        default:
            return value;
    }
}
function _$type(obj) {
    return /\[object (\w+)\]/.exec(Object.prototype.toString.call(obj))[1].toLowerCase();
}
function _$hasProp(obj, prop) {
    return obj.hasOwnProperty(prop);
}
function _$drt(directive) {
    return {
        $init: function (instance, options, element) {
            if (_$isObject(directive) && directive.$init) {
                directive.$init(instance, options, element);
            }
        },
        $inserted: function (instance, options, element) {
            if (_$isObject(directive) && directive.$inserted) {
                directive.$inserted(instance, options, element);
            }
        },
        $update: function (instance, options, element) {
            if (_$isObject(directive) && directive.$update) {
                directive.$update(instance, options, element);
            }
            else if (_$isType(directive, 'function')) {
                directive(instance, options, element);
            }
        },
        $destroy: function (instance, options, element) {
            if (_$isObject(directive) && directive.$destroy) {
                directive.$destroy(instance, options, element);
            }
        }
    };
}
function _$toStr(obj) {
    var str = _$type(obj);
    return !/null|undefined/.test(str) ? obj.toString() : str;
}
function _$toPlainObj(obj) {
    var data = {};
    _$e(_$isObject(obj) ? obj : {}, function (_v, k) {
        if (k[0] !== '$' && !_$isType(obj[k], 'function')) {
            if (obj[k] instanceof _$List) {
                data[k] = obj[k].map(_$toPlainObj);
            }
            else if (_$isObject(obj[k])) {
                data[k] = _$toPlainObj(obj[k]);
            }
            else {
                data[k] = obj[k];
            }
        }
    });
    return _$isObject(obj) ? data : obj;
}
function _$setRef(obj, prop) {
    var value = [];
    _$def(obj, prop, {
        get: function () {
            return value.length <= 1 ? value[0] : value;
        },
        set: function (val) {
            if (val && !~value.indexOf(val)) {
                value.push(val);
            }
        },
        enumerable: true,
        configurable: true
    });
}
function _$accesor(obj, data, root, pKey) {
    var _loop_1 = function (key) {
        if (_$hasProp(data, key)) {
            var desc = Object.getOwnPropertyDescriptor(data, key);
            if (_$isType(desc.value, 'function') || desc.get) {
                _$def(obj, key, desc);
            }
            else {
                var value_1 = data[key];
                var k_1 = pKey ? pKey + "." + key : key;
                _$def(obj, key, {
                    get: function () {
                        return value_1;
                    },
                    set: function (v) {
                        var oldVal = value_1;
                        value_1 = v;
                        if (_$type(value_1) === 'array') {
                            value_1 = new _$List(value_1, root, k_1);
                        }
                        else if (_$isObject(value_1)) {
                            _$accesor(value_1, v, root, k_1);
                        }
                        _$dispatch(root || this, k_1, oldVal, value_1);
                    },
                    enumerable: desc.enumerable, configurable: desc.configurable
                });
                if (_$type(value_1) === 'array') {
                    value_1 = new _$List(value_1, root, k_1);
                }
                else if (_$isObject(value_1)) {
                    _$accesor(obj[key], value_1, root, k_1);
                }
            }
        }
    };
    for (var key in data) {
        _loop_1(key);
    }
}
function _$subs(dep, listener) {
    if (!this._subscribers[dep]) {
        this._subscribers[dep] = [];
    }
    return this._subscribers[dep].push(listener.bind(this)) - 1;
}
function _$def(obj, key, desc) {
    Object.defineProperty(obj, key, desc);
}
function _$(selector, parent) {
    return _$isType(selector, 'string') ? (parent || document).querySelector(selector) : selector;
}
function _$d() {
    return document.createDocumentFragment();
}
function _$a(parent, child, sibling) {
    if (!sibling)
        parent.appendChild(child);
    else
        parent.insertBefore(child, sibling);
}
function _$r(el, parent) {
    var root = parent || el.parentElement;
    if (root)
        root.removeChild(el);
}
function _$ce(tagName) {
    return document.createElement(tagName || 'div');
}
function _$ct(content) {
    return document.createTextNode(content || '');
}
function _$cm(content) {
    return document.createComment(content || '');
}
function _$sa(el, attr, value) {
    el.setAttribute(attr, value);
}
function _$ga(el, attr) {
    return el.getAttribute(attr);
}
function _$al(el, event, handler) {
    el.addEventListener(event, handler, false);
}
function _$ul(el, event, oldHandler, newHandler) {
    _$rl(el, event, oldHandler);
    _$al(el, event, oldHandler = newHandler);
    return oldHandler;
}
function _$rl(el, event, handler) {
    el.removeEventListener(event, handler, false);
}
function _$bc(value) {
    var classes = '';
    if (_$isType(value, 'string')) {
        classes += " " + value;
    }
    else if (Array.isArray(value)) {
        classes = value.map(_$bc).join(' ');
    }
    else if (_$isObject(value)) {
        for (var key in value)
            if (_$hasProp(value, key) && value[key])
                classes += " " + key;
    }
    return classes.trim();
}
function _$bs(value) {
    var el = _$ce();
    if (_$isObject(value)) {
        var style_1 = el.style;
        _$e(value, function (val, prop) {
            if (val !== style_1[prop]) {
                style_1[prop] = val;
            }
        });
        return style_1.cssText;
    }
    else if (_$isType(value, 'string')) {
        return value;
    }
    else {
        return '';
    }
}
function _$f(root, obj, loop) {
    var items = {}, loopParent, loopSibling;
    _$e(obj, function (item, i) { items[i] = loop(root, item, i); });
    return {
        $create: function () {
            _$e(items, function (item) { item.$create(); });
        },
        $mount: function (parent, sibling) {
            loopParent = _$(parent);
            loopSibling = _$(sibling);
            _$e(items, function (item) { item.$mount(loopParent, loopSibling); });
        },
        $update: function (root, obj) {
            _$e(items, function (item, i) {
                if (obj[i]) {
                    item.$update(root, obj[i], i);
                }
                else {
                    item.$destroy();
                    delete items[i];
                }
            });
            _$e(obj, function (item, i) {
                if (!items[i]) {
                    items[i] = loop(root, item, i);
                    items[i].$create();
                    items[i].$mount(loopParent, loopSibling);
                }
            });
        },
        $destroy: function () {
            _$e(items, function (item) { item.$destroy(); });
        }
    };
}
function _$e(obj, cb) {
    for (var key in obj) {
        if (_$hasProp(obj, key)) {
            cb(obj[key], isNaN(+key) ? key : +key);
        }
    }
}
function _$is(id, css) {
    var isNew = false;
    var style = _$("#" + id, document.head);
    if (!style) {
        isNew = true;
        style = _$ce('style');
        style.id = id;
        _$sa(style, 'refs', 1);
    }
    if (style.textContent !== css) {
        style.textContent = css;
    }
    if (isNew) {
        _$a(document.head, style);
    }
    else {
        var count = +_$ga(style, 'refs');
        _$sa(style, 'refs', (++count).toString());
    }
}
function _$ds(id) {
    var style = _$("#" + id, document.head);
    if (style) {
        var count = +_$ga(style, 'refs');
        if (--count === 0) {
            _$r(style, document.head);
        }
        else {
            _$sa(style, 'refs', count.toString());
        }
    }
}
//# sourceMappingURL=index.js.map
// CONCATENATED MODULE: ./components/counter.html

function _$tplCounter(state) {
  var div, h3, txt, label, txt_1, strong, txt_2, setTxt_2, br, button, txt_3, clickEvent, handlerClickEvent, button_1, txt_4, clickEvent_1, handlerClickEvent_1;
  setTxt_2 = function (state) {
    return state.count;
  };
  var bindClassStrong = function (state) {
    return _$bc(state.negative()).trim();
  };
  clickEvent = function (state) {
    state.increment();
  };
  clickEvent_1 = function (state) {
    state.decrement();
  };
  return {
    $create: function () {
      div = _$ce();
      h3 = _$ce('h3');
      txt = _$ct('Counter Example');
      _$a(h3, txt);
      _$a(div, h3);
      label = _$ce('label');
      txt_1 = _$ct('Counter: ');
      _$a(label, txt_1);
      _$a(div, label);
      strong = _$ce('strong');
      txt_2 = _$ct();
      txt_2.data = setTxt_2(state);
      _$a(strong, txt_2);
      _$a(div, strong);
      br = _$ce('br');
      _$a(div, br);
      button = _$ce('button');
      txt_3 = _$ct('Increment');
      _$a(button, txt_3);
      _$a(div, button);
      button_1 = _$ce('button');
      txt_4 = _$ct('Decrement');
      _$a(button_1, txt_4);
      _$a(div, button_1);
      this.$hydrate();
    },
    $hydrate: function () {
      _$sa(h3, 'class', 'title is-3');
      _$sa(strong, 'class', _$toStr(bindClassStrong(state)));
      _$al(button, 'click', handlerClickEvent = function (event) {
        clickEvent(state, event, button);
      });
      _$sa(button, 'class', 'button is-primary');
      _$al(button_1, 'click', handlerClickEvent_1 = function (event) {
        clickEvent_1(state, event, button_1);
      });
      _$sa(button_1, 'class', 'button is-danger');
      _$sa(div, 'class', 'container');
    },
    $mount: function (parent, sibling) {
      _$is('scope_672e9690', '.negative {color:crimson;}');
      var frag = _$d();
      _$a(frag, div);
      _$a(_$(parent), frag, _$(sibling));
    },
    $update: function (state) {
      var updateTxt_2 = setTxt_2(state);
      if (txt_2.data !== updateTxt_2.toString()) {
        txt_2.data = updateTxt_2;
      }
      updateTxt_2 = void 0;
      var updateClassStrong = _$toStr(bindClassStrong(state));
      if (_$ga(strong, 'class') !== updateClassStrong) {
        _$sa(strong, 'class', updateClassStrong);
      }
      updateClassStrong = void 0;
    },
    $destroy: function () {
      _$ds('scope_672e9690');
      _$rl(button, 'click', handlerClickEvent);
      _$rl(button_1, 'click', handlerClickEvent_1);
      if (div) {
        _$r(div);
      }
      delete state.$root;
      div = h3 = txt = label = txt_1 = strong = txt_2 = setTxt_2 = br = button = txt_3 = clickEvent = handlerClickEvent = button_1 = txt_4 = clickEvent_1 = handlerClickEvent_1 = void 0;
    }
  };
}
function Counter(attrs) {
  _$CompCtr.call(this, attrs, _$tplCounter, {
    model: {
      count: 0,
      increment: function () {
        this.count = this.count + 1;
      },
      decrement: function () {
        this.count = this.count - 1;
      },
      negative: function () {
        return { 'negative': this.count < 0 };
      }
    }
  });
}
Counter.prototype = Object.create(_$CompCtr.prototype);
Counter.prototype.constructor = Counter;
/* harmony default export */ var counter = (Counter);
// CONCATENATED MODULE: ./main.ts

var main_counter = new counter();
main_counter.$mount('main');


/***/ })
/******/ ]);