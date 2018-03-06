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
// CONCATENATED MODULE: ./components/todo.ts
var filters = {
    actives: function (todos) {
        return todos.filter(function (todo) { return !todo.completed; });
    },
    filterByView: function (todos, view) {
        switch (view) {
            case 'active':
                return todos.filter(function (todo) { return !todo.completed; });
            case 'completed':
                return todos.filter(function (todo) { return todo.completed; });
            default:
                return todos;
        }
    },
    pluralize: function (word, count) {
        return "" + word + (count > 1 ? 's' : '');
    }
};
var model = {
    view: '',
    todos: [],
    newTodo: '',
    oldTitle: '',
    allDone: false,
    editedTodo: null,
    get remaining() {
        return this.$filters.actives(this.todos).length;
    },
    markAll: function (value) {
        var _this = this;
        this.allDone = value;
        this.todos.forEach(function (todo) { todo.completed = _this.allDone; });
    },
    addTodo: function (e) {
        if (e.key === 'Enter') {
            var title = this.newTodo && this.newTodo.trim();
            if (!title)
                return;
            this.todos.push({ title: title, completed: false });
            this.newTodo = '';
        }
    },
    editTodo: function (todo) {
        this.editedTodo = todo;
        this.oldTitle = todo.title;
    },
    doneEdit: function (todo, e) {
        if (e.key === 'Enter') {
            todo.title = todo.title.trim();
            if (!todo.title) {
                this.removeTodo(todo);
            }
            this.clearTmps();
        }
        else if (e.key === 'Escape') {
            todo.title = this.oldTitle;
            this.clearTmps();
        }
    },
    removeTodo: function (todo) {
        var index = this.todos.indexOf(todo);
        this.todos.splice(index, 1);
    },
    removeCompleted: function () {
        this.todos = this.$filters.actives(this.todos);
    },
    clearTmps: function () {
        this.editedTodo = null;
        this.oldTitle = '';
    }
};
var directives = {
    'focus-edit': function (_inst, options, el) {
        if (options.value) {
            el.focus();
        }
    }
};
/* harmony default export */ var components_todo = ({ model: model, filters: filters, directives: directives });

// CONCATENATED MODULE: ./components/todo.html


function itemLoop_1(state, todo, i) {
  var li, div, input, changeEvent, handlerChangeEvent, label, txt, setTxt, dblclickEvent, handlerDblclickEvent, button, clickEvent, handlerClickEvent, input_1, focusEditDirective, inputEvent, handlerInputEvent, blurEvent, handlerBlurEvent, keyupEvent, handlerKeyupEvent;
  changeEvent = function (state, todo, i, $event, $el) {
    todo.completed = $el.checked;
  };
  var bindCheckedInput = function (state, todo) {
    return todo.completed;
  };
  setTxt = function (state, todo) {
    return todo.title;
  };
  dblclickEvent = function (state, todo, i) {
    state.editTodo(todo, i);
  };
  clickEvent = function (state, todo) {
    state.removeTodo(todo);
  };
  focusEditDirective = state.$directives['focus-edit'];
  inputEvent = function (state, todo, i, $event, $el) {
    todo.title = $el.value;
  };
  var bindValueInput_1 = function (state, todo) {
    return todo.title;
  };
  blurEvent = function (state) {
    state.editedTodo = null;
  };
  keyupEvent = function (state, todo, i, $event) {
    state.doneEdit(todo, $event);
  };
  var bindClassLi = function (state, todo) {
    return ('scope_4827b611 todo ' + _$bc({
      completed: todo.completed,
      editing: todo === state.editedTodo
    })).trim();
  };
  return {
    $create: function () {
      li = _$ce('li');
      div = _$ce();
      input = _$ce('input');
      _$a(div, input);
      label = _$ce('label');
      txt = _$ct();
      txt.data = setTxt(state, todo, i);
      _$a(label, txt);
      _$a(div, label);
      button = _$ce('button');
      _$a(div, button);
      _$a(li, div);
      input_1 = _$ce('input');
      _$a(li, input_1);
      this.$hydrate();
    },
    $hydrate: function () {
      _$al(input, 'change', handlerChangeEvent = function (event) {
        changeEvent(state, todo, i, event, input);
      });
      input.checked = !!bindCheckedInput(state, todo, i);
      _$sa(input, 'class', 'scope_4827b611 toggle');
      _$sa(input, 'type', 'checkbox');
      _$al(label, 'dblclick', handlerDblclickEvent = function (event) {
        dblclickEvent(state, todo, i, event, label);
      });
      _$sa(label, 'class', 'scope_4827b611');
      _$al(button, 'click', handlerClickEvent = function (event) {
        clickEvent(state, todo, i, event, button);
      });
      _$sa(button, 'class', 'scope_4827b611 destroy');
      _$sa(div, 'class', 'scope_4827b611 view');
      focusEditDirective.$init(state, {
        value: todo === state.editedTodo,
        expression: 'todo === editedTodo',
        modifiers: {}
      }, input_1);
      _$al(input_1, 'input', handlerInputEvent = function (event) {
        inputEvent(state, todo, i, event, input_1);
      });
      input_1.value = _$toStr(bindValueInput_1(state, todo, i));
      _$al(input_1, 'blur', handlerBlurEvent = function (event) {
        blurEvent(state, todo, i, event, input_1);
      });
      _$al(input_1, 'keyup', handlerKeyupEvent = function (event) {
        keyupEvent(state, todo, i, event, input_1);
      });
      _$sa(input_1, 'type', 'text');
      _$sa(input_1, 'class', 'scope_4827b611 edit');
      _$sa(li, 'class', _$toStr(bindClassLi(state, todo, i)));
    },
    $mount: function (parent, sibling) {
      var frag = _$d();
      _$a(frag, li);
      _$a(_$(parent), frag, _$(sibling));
      focusEditDirective.$inserted(state, {
        value: todo === state.editedTodo,
        expression: 'todo === editedTodo',
        modifiers: {}
      }, input_1);
    },
    $update: function (state, todo, i) {
      handlerChangeEvent = _$ul(input, 'change', handlerChangeEvent, function (event) {
        changeEvent(state, todo, i, event, input);
      });
      var updateCheckedInput = !!bindCheckedInput(state, todo, i);
      if (input.checked !== updateCheckedInput) {
        input.checked = updateCheckedInput;
      }
      updateCheckedInput = void 0;
      var updateTxt = setTxt(state, todo, i);
      if (txt.data !== updateTxt.toString()) {
        txt.data = updateTxt;
      }
      updateTxt = void 0;
      handlerDblclickEvent = _$ul(label, 'dblclick', handlerDblclickEvent, function (event) {
        dblclickEvent(state, todo, i, event, label);
      });
      handlerClickEvent = _$ul(button, 'click', handlerClickEvent, function (event) {
        clickEvent(state, todo, i, event, button);
      });
      focusEditDirective.$update(state, {
        value: todo === state.editedTodo,
        expression: 'todo === editedTodo',
        modifiers: {}
      }, input_1);
      handlerInputEvent = _$ul(input_1, 'input', handlerInputEvent, function (event) {
        inputEvent(state, todo, i, event, input_1);
      });
      var updateValueInput_1 = _$toStr(bindValueInput_1(state, todo, i));
      if (input_1.value !== updateValueInput_1) {
        input_1.value = updateValueInput_1;
      }
      updateValueInput_1 = void 0;
      handlerBlurEvent = _$ul(input_1, 'blur', handlerBlurEvent, function (event) {
        blurEvent(state, todo, i, event, input_1);
      });
      handlerKeyupEvent = _$ul(input_1, 'keyup', handlerKeyupEvent, function (event) {
        keyupEvent(state, todo, i, event, input_1);
      });
      var updateClassLi = _$toStr(bindClassLi(state, todo, i));
      if (_$ga(li, 'class') !== updateClassLi) {
        _$sa(li, 'class', updateClassLi);
      }
      updateClassLi = void 0;
    },
    $destroy: function () {
      _$rl(input, 'change', handlerChangeEvent);
      _$rl(label, 'dblclick', handlerDblclickEvent);
      _$rl(button, 'click', handlerClickEvent);
      focusEditDirective.$destroy(state, {
        value: todo === state.editedTodo,
        expression: 'todo === editedTodo',
        modifiers: {}
      }, input_1);
      _$rl(input_1, 'input', handlerInputEvent);
      _$rl(input_1, 'blur', handlerBlurEvent);
      _$rl(input_1, 'keyup', handlerKeyupEvent);
      if (li) {
        _$r(li);
      }
      li = div = input = changeEvent = handlerChangeEvent = label = txt = setTxt = dblclickEvent = handlerDblclickEvent = button = clickEvent = handlerClickEvent = input_1 = focusEditDirective = inputEvent = handlerInputEvent = blurEvent = handlerBlurEvent = keyupEvent = handlerKeyupEvent = void 0;
    }
  };
}
function _$tplTodo(state) {
  var section, header, h1, txt, input, inputEvent, handlerInputEvent, keyupEvent, handlerKeyupEvent, section_1, input_1, changeEvent, handlerChangeEvent, label, txt_1, ul, loopAnchor_1, loopBlock_1, displaySection_1, footer, span, txt_2, setTxt_2, ul_1, li, a, txt_3, clickEvent, handlerClickEvent, li_1, a_1, txt_4, clickEvent_1, handlerClickEvent_1, li_2, a_2, txt_5, clickEvent_2, handlerClickEvent_2, button, txt_6, clickEvent_3, handlerClickEvent_3, displayButton, displayFooter;
  inputEvent = function (state, $event, $el) {
    state.newTodo = $el.value;
  };
  var bindValueInput = function (state) {
    return state.newTodo;
  };
  keyupEvent = function (state, $event) {
    state.addTodo($event);
  };
  var bindCheckedInput_1 = function (state) {
    return state.allDone;
  };
  changeEvent = function (state, $event, $el) {
    state.markAll($el.checked);
  };
  loopBlock_1 = _$f(state, state.$filters.filterByView(state.todos, state.view), itemLoop_1);
  loopAnchor_1 = _$ct();
  var showSection_1 = function (state, el, display) {
    el.style.display = state.todos.length ? display : 'none';
  };
  setTxt_2 = function (state) {
    return state.remaining + ' ' + state.$filters.pluralize('item', state.remaining) + ' left';
  };
  var bindClassA = function (state) {
    return ('scope_4827b611 ' + _$bc({ selected: state.view === '' })).trim();
  };
  clickEvent = function (state) {
    state.view = '';
  };
  var bindClassA_1 = function (state) {
    return ('scope_4827b611 ' + _$bc({ selected: state.view === 'active' })).trim();
  };
  clickEvent_1 = function (state) {
    state.view = 'active';
  };
  var bindClassA_2 = function (state) {
    return ('scope_4827b611 ' + _$bc({ selected: state.view === 'completed' })).trim();
  };
  clickEvent_2 = function (state) {
    state.view = 'completed';
  };
  clickEvent_3 = function (state) {
    state.removeCompleted();
  };
  var showButton = function (state, el, display) {
    el.style.display = state.todos.length > state.remaining ? display : 'none';
  };
  var showFooter = function (state, el, display) {
    el.style.display = state.todos.length ? display : 'none';
  };
  return {
    $create: function () {
      section = _$ce('section');
      header = _$ce('header');
      h1 = _$ce('h1');
      txt = _$ct('todos');
      _$a(h1, txt);
      _$a(header, h1);
      input = _$ce('input');
      _$a(header, input);
      _$a(section, header);
      section_1 = _$ce('section');
      input_1 = _$ce('input');
      _$a(section_1, input_1);
      label = _$ce('label');
      txt_1 = _$ct('Mark all as complete');
      _$a(label, txt_1);
      _$a(section_1, label);
      ul = _$ce('ul');
      _$a(ul, loopAnchor_1);
      loopBlock_1.$create();
      _$a(section_1, ul);
      _$a(section, section_1);
      footer = _$ce('footer');
      span = _$ce('span');
      txt_2 = _$ct();
      txt_2.data = setTxt_2(state);
      _$a(span, txt_2);
      _$a(footer, span);
      ul_1 = _$ce('ul');
      li = _$ce('li');
      a = _$ce('a');
      txt_3 = _$ct('All');
      _$a(a, txt_3);
      _$a(li, a);
      _$a(ul_1, li);
      li_1 = _$ce('li');
      a_1 = _$ce('a');
      txt_4 = _$ct('Active');
      _$a(a_1, txt_4);
      _$a(li_1, a_1);
      _$a(ul_1, li_1);
      li_2 = _$ce('li');
      a_2 = _$ce('a');
      txt_5 = _$ct('Completed');
      _$a(a_2, txt_5);
      _$a(li_2, a_2);
      _$a(ul_1, li_2);
      _$a(footer, ul_1);
      button = _$ce('button');
      txt_6 = _$ct('Clear completed');
      _$a(button, txt_6);
      _$a(footer, button);
      _$a(section, footer);
      this.$hydrate();
    },
    $hydrate: function () {
      _$sa(h1, 'class', 'scope_4827b611');
      _$al(input, 'input', handlerInputEvent = function (event) {
        inputEvent(state, event, input);
      });
      input.value = _$toStr(bindValueInput(state));
      _$al(input, 'keyup', handlerKeyupEvent = function (event) {
        keyupEvent(state, event, input);
      });
      _$sa(input, 'class', 'scope_4827b611 new-todo');
      _$sa(input, 'placeholder', 'What needs to be done?');
      _$sa(input, 'autofocus', '');
      _$sa(header, 'class', 'scope_4827b611 header');
      input_1.checked = !!bindCheckedInput_1(state);
      _$al(input_1, 'change', handlerChangeEvent = function (event) {
        changeEvent(state, event, input_1);
      });
      _$sa(input_1, 'class', 'scope_4827b611 toggle-all');
      _$sa(input_1, 'type', 'checkbox');
      _$sa(label, 'for', 'toggle-all');
      _$sa(label, 'class', 'scope_4827b611');
      _$sa(ul, 'class', 'scope_4827b611 todo-list');
      displaySection_1 = section_1.style.display;
      showSection_1(state, section_1, displaySection_1);
      _$sa(section_1, 'class', 'scope_4827b611 main');
      _$sa(span, 'class', 'scope_4827b611 todo-count');
      _$sa(a, 'class', _$toStr(bindClassA(state)));
      _$al(a, 'click', handlerClickEvent = function (event) {
        clickEvent(state, event, a);
      });
      _$sa(a, 'href', '#/');
      _$sa(li, 'class', 'scope_4827b611');
      _$sa(a_1, 'class', _$toStr(bindClassA_1(state)));
      _$al(a_1, 'click', handlerClickEvent_1 = function (event) {
        clickEvent_1(state, event, a_1);
      });
      _$sa(a_1, 'href', '#/active');
      _$sa(li_1, 'class', 'scope_4827b611');
      _$sa(a_2, 'class', _$toStr(bindClassA_2(state)));
      _$al(a_2, 'click', handlerClickEvent_2 = function (event) {
        clickEvent_2(state, event, a_2);
      });
      _$sa(a_2, 'href', '#/completed');
      _$sa(li_2, 'class', 'scope_4827b611');
      _$sa(ul_1, 'class', 'scope_4827b611 filters');
      _$al(button, 'click', handlerClickEvent_3 = function (event) {
        clickEvent_3(state, event, button);
      });
      displayButton = button.style.display;
      showButton(state, button, displayButton);
      _$sa(button, 'class', 'scope_4827b611 clear-completed');
      displayFooter = footer.style.display;
      showFooter(state, footer, displayFooter);
      _$sa(footer, 'class', 'scope_4827b611 footer');
      _$sa(section, 'class', 'scope_4827b611 todoapp');
    },
    $mount: function (parent, sibling) {
      _$is('scope_4827b611', '.scope_4827b611.view label.scope_4827b611{user-select:none;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;-o-user-select:none;}');
      var frag = _$d();
      loopBlock_1.$mount(ul, loopAnchor_1);
      _$a(frag, section);
      _$a(_$(parent), frag, _$(sibling));
    },
    $update: function (state) {
      var updateValueInput = _$toStr(bindValueInput(state));
      if (input.value !== updateValueInput) {
        input.value = updateValueInput;
      }
      updateValueInput = void 0;
      var updateCheckedInput_1 = !!bindCheckedInput_1(state);
      if (input_1.checked !== updateCheckedInput_1) {
        input_1.checked = updateCheckedInput_1;
      }
      updateCheckedInput_1 = void 0;
      loopBlock_1.$update(state, state.$filters.filterByView(state.todos, state.view));
      showSection_1(state, section_1, displaySection_1);
      var updateTxt_2 = setTxt_2(state);
      if (txt_2.data !== updateTxt_2.toString()) {
        txt_2.data = updateTxt_2;
      }
      updateTxt_2 = void 0;
      var updateClassA = _$toStr(bindClassA(state));
      if (_$ga(a, 'class') !== updateClassA) {
        _$sa(a, 'class', updateClassA);
      }
      updateClassA = void 0;
      var updateClassA_1 = _$toStr(bindClassA_1(state));
      if (_$ga(a_1, 'class') !== updateClassA_1) {
        _$sa(a_1, 'class', updateClassA_1);
      }
      updateClassA_1 = void 0;
      var updateClassA_2 = _$toStr(bindClassA_2(state));
      if (_$ga(a_2, 'class') !== updateClassA_2) {
        _$sa(a_2, 'class', updateClassA_2);
      }
      updateClassA_2 = void 0;
      showButton(state, button, displayButton);
      showFooter(state, footer, displayFooter);
    },
    $destroy: function () {
      _$ds('scope_4827b611');
      _$rl(input, 'input', handlerInputEvent);
      _$rl(input, 'keyup', handlerKeyupEvent);
      _$rl(input_1, 'change', handlerChangeEvent);
      loopBlock_1.$destroy();
      _$rl(a, 'click', handlerClickEvent);
      _$rl(a_1, 'click', handlerClickEvent_1);
      _$rl(a_2, 'click', handlerClickEvent_2);
      _$rl(button, 'click', handlerClickEvent_3);
      if (section) {
        _$r(section);
      }
      delete state.$root;
      section = header = h1 = txt = input = inputEvent = handlerInputEvent = keyupEvent = handlerKeyupEvent = section_1 = input_1 = changeEvent = handlerChangeEvent = label = txt_1 = ul = loopAnchor_1 = loopBlock_1 = displaySection_1 = footer = span = txt_2 = setTxt_2 = ul_1 = li = a = txt_3 = clickEvent = handlerClickEvent = li_1 = a_1 = txt_4 = clickEvent_1 = handlerClickEvent_1 = li_2 = a_2 = txt_5 = clickEvent_2 = handlerClickEvent_2 = button = txt_6 = clickEvent_3 = handlerClickEvent_3 = displayButton = displayFooter = void 0;
    }
  };
}
function Todo(attrs) {
  _$CompCtr.call(this, attrs, _$tplTodo, components_todo);
}
Todo.prototype = Object.create(_$CompCtr.prototype);
Todo.prototype.constructor = Todo;
/* harmony default export */ var components_todo_0 = (Todo);
// CONCATENATED MODULE: ./main.ts

var main_todo = new components_todo_0();
main_todo.$mount('main');


/***/ })
/******/ ]);