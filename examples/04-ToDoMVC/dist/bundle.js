!function (root, factory) {
  if ('object' == typeof exports && 'object' == typeof module) {
    module.exports = factory();
  } else if ('function' == typeof define && define.amd) {
    define([], factory);
  } else {
    var a = factory();
    for (var i in a) {
      ('object' == typeof exports ? exports : root)[i] = a[i];
    }
  }
}(window, (function () {
  return function (modules) {
    var installedModules = {};
    function __webpack_require__(moduleId) {
      if (installedModules[moduleId]) {
        return installedModules[moduleId].exports;
      }
      var module = installedModules[moduleId] = {
        i: moduleId,
        l: !1,
        exports: {}
      };
      modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
      module.l = !0;
      return module.exports;
    }
    __webpack_require__.m = modules;
    __webpack_require__.c = installedModules;
    __webpack_require__.d = function (exports, name, getter) {
      if (!__webpack_require__.o(exports, name)) {
        Object.defineProperty(exports, name, {
          enumerable: !0,
          get: getter
        });
      }
    };
    __webpack_require__.r = function (exports) {
      if ('undefined' != typeof Symbol && Symbol.toStringTag) {
        Object.defineProperty(exports, Symbol.toStringTag, {
          value: 'Module'
        });
      }
      Object.defineProperty(exports, '__esModule', {
        value: !0
      });
    };
    __webpack_require__.t = function (value, mode) {
      if (1 & mode) {
        value = __webpack_require__(value);
      }
      if (8 & mode) {
        return value;
      }
      if (4 & mode && 'object' == typeof value && value && value.__esModule) {
        return value;
      }
      var ns = Object.create(null);
      __webpack_require__.r(ns);
      Object.defineProperty(ns, 'default', {
        enumerable: !0,
        value: value
      });
      if (2 & mode && 'string' != typeof value) {
        for (var key in value) {
          __webpack_require__.d(ns, key, function (key) {
            return value[key];
          }.bind(null, key));
        }
      }
      return ns;
    };
    __webpack_require__.n = function (module) {
      var getter = module && module.__esModule ? function () {
        return module.default;
      } : function () {
        return module;
      };
      __webpack_require__.d(getter, 'a', getter);
      return getter;
    };
    __webpack_require__.o = function (object, property) {
      return Object.prototype.hasOwnProperty.call(object, property);
    };
    __webpack_require__.p = '';
    return __webpack_require__(__webpack_require__.s = 0);
  }([function (module, __webpack_exports__, __webpack_require__) {
    __webpack_require__.r(__webpack_exports__);
    function _$extends(d, b) {
      _$assign(d, b);
      function _() {
        this.constructor = d;
      }
      d.prototype = null === b ? Object.create(b) : (_.prototype = b.prototype, new _);
    }
    function _$(selector, parent) {
      return _$isString(selector) ? (parent || document.body).querySelector(selector) : selector;
    }
    function _$type(obj) {
      return _$lowerCase(Object.prototype.toString.call(obj).slice(8, -1));
    }
    function _$isType(obj, objType) {
      return _$isString(objType) ? _$type(obj) === objType : obj instanceof objType;
    }
    function _$isString(str) {
      return 'string' === _$type(str);
    }
    function _$isArray(array) {
      return 'array' === _$type(array) || array instanceof _$List;
    }
    function _$isObject(obj) {
      return 'object' === _$type(obj);
    }
    function _$isFunction(obj) {
      return 'function' === _$type(obj);
    }
    function _$toString(obj) {
      if (_$isString(obj)) {
        return obj;
      }
      var str = _$type(obj);
      return /(^(null|undefined)$)/.test(str) ? str : obj.toString();
    }
    function _$toType(value, type, component, key) {
      switch (type) {
        case 'date':
          return new Date(value);

        case 'string':
          return _$toString(value);

        case 'number':
          return +value;

        case 'boolean':
          return _$isString(value) && !value ? !0 : !!value;

        case 'array':
          return _$isType(value, _$List) ? value : new _$List(value, component, key);

        default:
          return value;
      }
    }
    function _$slice(array, from) {
      var args = [];
      for (var i = from = from || 0; i < array.length; i++) {
        args[i - from] = array[i];
      }
      return args;
    }
    function _$hasProp(obj, prop) {
      return obj.hasOwnProperty(prop);
    }
    function _$define(obj, mapDesc) {
      Object.defineProperties(obj, mapDesc);
    }
    function _$each(obj, cb) {
      if (_$isArray(obj)) {
        for (var i = 0; i < obj.length; i++) {
          cb(obj[i], i);
        }
      } else if (_$isObject(obj)) {
        var keys = Object.keys(obj);
        for (i = 0; i < keys.length; i++) {
          var key = keys[i];
          cb(obj[key], key, i);
        }
      }
    }
    function _$lowerCase(str) {
      return str.toLowerCase();
    }
    function _$apply(callee, args, globs, thisArg) {
      if (globs && !_$isArray(globs)) {
        thisArg = globs;
        globs = [];
      } else if (void 0 === globs) {
        globs = [];
      } else if (void 0 === thisArg) {
        thisArg = null;
      }
      return callee.apply(thisArg, args.concat(globs));
    }
    function _$treborPlugins() {
      var _a;
      var TREBOR_PK = '__TREBOR_PLUGINS__';
      if (!window[TREBOR_PK]) {
        _$define(window, ((_a = {})[TREBOR_PK] = {
          value: [],
          configurable: !0,
          writable: !0,
          enumerable: !1
        }, _a));
      }
      return window[TREBOR_PK];
    }
    function _$assign(child, parent) {
      for (var property in parent) {
        if (parent.hasOwnProperty(property)) {
          child[property] = parent[property];
        }
      }
      return child;
    }
    function _$plainObject(obj) {
      var data = {};
      _$each(_$isObject(obj) ? obj : {}, (function (value, k) {
        if ('$' !== k[0] && !_$isFunction(value)) {
          if (_$isType(value, _$List)) {
            data[k] = value.map(_$plainObject);
          } else if (_$isObject(value)) {
            data[k] = _$plainObject(value);
          } else {
            data[k] = value;
          }
        }
      }));
      return _$isObject(obj) ? data : obj;
    }
    function _$accesor(component, path, value) {
      return path.split('.').reduce((function (obj, key, i, arr) {
        if (_$isType(value, 'undefined')) {
          if (null == obj) {
            arr.splice(0, arr.length);
            return i > 0 && null === obj ? obj : void 0;
          }
        } else if (i === arr.length - 1) {
          if (_$isType(obj, _$List) && _$toString(+key) === key) {
            obj.pull(+key, value);
          } else {
            var oldVal = obj[key];
            obj[key] = Array.isArray(value) ? new _$List(value, component, key) : value;
            _$dispatch(component, path, oldVal, obj[key]);
          }
        } else if (!_$isObject(obj[key])) {
          obj[key] = {};
        }
        return obj ? obj[key] : null;
      }), component);
    }
    function _$dispatch(component, key, oldVal, value) {
      component.$notify(key);
      if (component._watchers[key]) {
        _$each(component._watchers[key], (function (watcher) {
          watcher(oldVal, value);
        }));
      }
      component.$update();
    }
    function _$subscribers(dep, handler) {
      if (!this._subscribers[dep]) {
        this._subscribers[dep] = [];
      }
      return this._subscribers[dep].push(handler.bind(this)) - 1;
    }
    var _$Component = function () {
      function _$Component(attrs, compCtor, parent) {
        var self = this;
        if (!attrs) {
          attrs = {};
        }
        var propMap = {
          $refs: {
            value: {},
            enumerable: !1,
            configurable: !0
          },
          $slots: {
            value: {},
            enumerable: !1,
            configurable: !0
          },
          $parent: {
            value: parent || null,
            enumerable: !1,
            configurable: !0
          },
          $children: {
            value: [],
            enumerable: !1,
            configurable: !0
          },
          $filters: {
            value: {},
            enumerable: !1,
            configurable: !0
          },
          $options: {
            value: {
              filters: compCtor.$filters || {},
              children: compCtor.$children || {},
              attributes: compCtor.$attributes || {}
            },
            enumerable: !1,
            configurable: !0
          }
        };
        _$each(compCtor.$attributes || [], (function (attrOps, key) {
          key = _$isType(key, 'number') ? attrOps : key;
          propMap[key] = {
            get: function () {
              if (_$isString(attrOps)) {
                return _$isFunction(value = attrs[attrOps]) ? value() : value;
              } else if (!_$hasProp(attrs, key) && attrOps.required) {
                return console.error('Attribute \'' + key + '\' is required.');
              } else {
                var value;
                if (void 0 === (value = _$isFunction(attrs[key]) ? attrs[key]() : attrs[key]) && _$hasProp(attrOps, 'default')) {
                  var def = attrOps.default;
                  value = _$isFunction(def) ? def() : def;
                }
                var typ = attrOps.type;
                if (typ && !_$isType(value, typ) && attrOps.required) {
                  return console.error('Attribute \'' + key + '\' must be type \'' + typ + '\'.');
                }
                if (void 0 !== (value = _$toType(value, void 0 === value ? 'undefined' : typ, self, key)) && _$hasProp(attrOps, 'validator')) {
                  var validator = attrOps.validator;
                  if (_$isFunction(validator) && !validator(value)) {
                    return console.error('Assigment \'' + key + '\'=\'' + JSON.stringify(value) + '\' invalid.');
                  }
                }
                return value;
              }
            },
            set: function () {
              console.error('\'' + key + '\' is read only.');
            },
            enumerable: !0,
            configurable: !0
          };
        }));
        var desc = {
          enumerable: !1,
          configurable: !1
        };
        propMap._events = _$assign({
          value: {}
        }, desc);
        propMap._watchers = _$assign({
          value: {}
        }, desc);
        propMap._subscribers = _$assign({
          value: {}
        }, desc);
        _$define(self, propMap);
        _$assign(self.$filters, compCtor.$filters || {});
      }
      var prototype = _$Component.prototype;
      _$define(prototype, {
        $data: {
          get: function () {
            return _$plainObject(this);
          },
          enumerable: !0,
          configurable: !0
        }
      });
      prototype.$get = function (path) {
        return _$accesor(this, path);
      };
      prototype.$set = function (path, value) {
        _$accesor(this, path, value);
      };
      prototype.$on = function (event, handler) {
        if (!this._events[event]) {
          this._events[event] = [];
        }
        this._events[event].push(handler);
      };
      prototype.$off = function (event, handler) {
        var index = this._events[event].indexOf(handler);
        ~index && this._events[event].splice(index, 1);
      };
      prototype.$once = function (event, handler) {
        var _this = this;
        var _handler = function (args) {
          handler(args);
          _this.$off(event, _handler);
        };
        this.$on(event, _handler);
      };
      prototype.$fire = function (event, data) {
        if (this._events[event]) {
          _$each(this._events[event], (function (handler) {
            handler(data);
          }));
        }
      };
      prototype.$notify = function (key) {
        if (this._subscribers[key]) {
          _$each(this._subscribers[key], (function (suscriber) {
            suscriber();
          }));
        }
      };
      prototype.$observe = function (keyOrKeys, handler) {
        var _this = this;
        var subs = [];
        if (_$isArray(keyOrKeys)) {
          _$each(keyOrKeys, (function (key) {
            subs.push({
              subscrition: key,
              index: _$subscribers.call(_this, key, handler)
            });
          }));
        } else {
          subs.push({
            subscrition: keyOrKeys,
            index: _$subscribers.call(this, keyOrKeys, handler)
          });
        }
        return {
          $unobserve: function () {
            _$each(subs, (function (_a) {
              var subscrition = _a.subscrition, index = _a.index;
              _this._subscribers[subscrition].splice(index, 1);
            }));
          }
        };
      };
      prototype.$watch = function (key, handler) {
        var _this = this;
        if (!this._watchers[key]) {
          this._watchers[key] = [];
        }
        var i = this._watchers[key].push(handler.bind(this));
        return {
          $unwatch: function () {
            _this._watchers[key].splice(i - 1, 1);
          }
        };
      };
      return _$Component;
    }();
    var _$List = function (_super) {
      _$extends(List, _super);
      function List(value, component, key) {
        _super.call(this, value.length);
        var self = this;
        _$define(self, {
          _key: {
            value: key,
            enumerable: !1
          },
          _root: {
            value: component,
            enumerable: !1
          }
        });
        _$apply(_super.prototype.push, value.map((function (val, i) {
          if (0 !== self.length) {
            i += self.length;
          }
          return !_$isType(val, List) && _$isArray(val) ? new List(val, component, key + '.' + i) : val;
        })), [], self);
      }
      List.prototype.pull = function (index) {
        var self = this;
        var args = _$slice(arguments, 1);
        var length = self.length;
        if (index > length) {
          length = index + 1;
          var pull = new Array(index - self.length);
          _$apply(pull.push, args, [], pull);
          for (var i = 0; i < length; i++) {
            if (i === index) {
              _$apply(self.push, pull, [], self);
            }
          }
        } else {
          _$apply(self.splice, [index, 1].concat(args), [], self);
        }
      };
      ['pop', 'push', 'reverse', 'shift', 'sort', 'fill', 'unshift', 'splice'].forEach((function (method) {
        List.prototype[method] = function () {
          var self = this;
          var args = _$slice(arguments);
          var old = self.slice();
          var result = void 0;
          if ('push' === method) {
            _$apply([].push, args.map((function (v, i) {
              if (0 !== self.length) {
                i += self.length;
              }
              return !_$isType(v, List) && _$isArray(v) ? new List(v, self._root, self._key + '.' + i) : v;
            })), [], self);
            result = self.length;
          } else {
            result = _$apply(Array.prototype[method], args, [], self);
          }
          _$dispatch(self._root, self._key, old, self.slice());
          return result;
        };
      }));
      return List;
    }(Array);
    function _$createComponent($ComponentClass, templateFn) {
      function $ComponentCtor(attrs, parent) {
        var self = this;
        _$apply(_$Component, [attrs, $ComponentCtor, parent], [], self);
        $ComponentClass.call(self);
        var descriptors = {};
        _$each(self, (function (_, key) {
          if (_$hasProp(self, key)) {
            var descriptor = Object.getOwnPropertyDescriptor(self, key);
            if (descriptor.value && _$isArray(descriptor.value)) {
              descriptor.value = new _$List(descriptor.value, self, key);
            } else {
              if (descriptor.get) {
                var getter_1_1 = descriptor.get;
                descriptor.get = function () {
                  var value = getter_1_1.call(this);
                  if (_$isArray(value)) {
                    value = new _$List(value, this, key);
                  }
                  return value;
                };
              }
              if (descriptor.set) {
                var setter_1_1 = descriptor.set;
                descriptor.set = function (value) {
                  if (_$isArray(value)) {
                    value = new _$List(value, this, key);
                  }
                  setter_1_1.call(this, value);
                };
              }
            }
            descriptors[key] = descriptor;
          }
        }));
        _$define(self, descriptors);
        var tpl = templateFn(self);
        var tplDesc = {};
        _$each(tpl, (function (value, key) {
          tplDesc[key] = function (key, value) {
            var hook = key[1].toUpperCase() + _$slice(key, 2);
            return {
              enumerable: !1,
              configurable: !1,
              writable: !1,
              value: function () {
                var args = _$slice(arguments);
                var ahook = this['did' + hook];
                var bhook = this['will' + hook];
                bhook && bhook.call(this);
                _$apply(value, '$update' === key ? [this, _$slice(args, 1)] : args, this);
                ahook && ahook.call(this);
              }
            };
          }(key, value);
        }));
        _$define(self, tplDesc);
        _$each(_$treborPlugins(), (function (_a) {
          var plugin = _a.plugin, options = _a.options;
          plugin.call(self, $ComponentCtor, options);
        }));
        !parent && this.$create();
      }
      var proto = [$ComponentClass.prototype, _$Component.prototype].reduceRight((function (superProto, proto) {
        var inheritedProto = Object.create(superProto);
        for (var key in proto) {
          if (proto.hasOwnProperty(key)) {
            var desc = Object.getOwnPropertyDescriptor(proto, key);
            Object.defineProperty(inheritedProto, key, desc);
          }
        }
        _$assign($ComponentCtor, proto.constructor);
        inheritedProto.constructor = proto.constructor;
        return inheritedProto;
      }), Object.prototype);
      $ComponentCtor.prototype = Object.create(proto);
      $ComponentCtor.prototype.constructor = $ComponentCtor;
      $ComponentCtor.$plugin = function (plugin, options) {
        _$treborPlugins().push({
          options: options,
          plugin: plugin
        });
      };
      return $ComponentCtor;
    }
    function _$fragTpl() {
      var htmlParts = [];
      for (var _i = 0; _i < arguments.length; _i++) {
        htmlParts[_i] = arguments[_i];
      }
      var template = document.createElement('template');
      template.innerHTML = htmlParts.join('\x3c!----\x3e');
      var fragment = template.content;
      var nodes = _$slice(fragment.childNodes);
      nodes.unshift(fragment);
      return nodes;
    }
    function _$prepareFragment(frag, els) {
      if (!frag.hasChildNodes()) {
        _$each(els, (function (el) {
          return frag.append(el);
        }));
      }
    }
    function _$updateTxt(txt, newData) {
      if (txt.data !== newData) {
        txt.data = newData;
      }
    }
    function _$child(el, index) {
      if (void 0 === index) {
        index = 0;
      }
      var node = el.childNodes[index];
      if (3 === node.nodeType) {
        node.data = '';
      }
      return node;
    }
    function _$append(parent, child, sibling) {
      if (!0 === sibling) {
        parent.parentElement.replaceChild(child, parent);
      } else if (!sibling) {
        parent.appendChild(child);
      } else {
        parent.insertBefore(child, sibling);
      }
    }
    function _$attr(el, attribute, value) {
      if (void 0 === attribute) {
        attribute = 'value';
      }
      var isValueAttr = 'value' === attribute;
      var _value = isValueAttr ? '_' + attribute : null;
      if (void 0 === value) {
        if (isValueAttr) {
          return _$hasProp(el, _value) ? el[_value] : el[attribute];
        } else {
          return el.getAttribute(attribute);
        }
      } else {
        el.setAttribute(attribute, _$toString(value));
      }
    }
    function _$eventKeys(event) {
      var keys = _$slice(arguments, 1);
      var i = 0;
      for (; i < keys.length;) {
        var key = keys[i];
        if (_$lowerCase(event.key) !== key && !event[key + 'Key']) {
          return !1;
        }
        i++;
      }
      return !0;
    }
    function _$addEvent(node, event, listener) {
      if (0 === _$type(node).indexOf('html')) {
        node.addEventListener(event, listener, !1);
      } else {
        node.$on(event, listener);
      }
    }
    function _$removeEvent(node, event, listener) {
      if (0 === _$type(node).indexOf('html')) {
        node.removeEventListener(event, listener, !1);
      } else {
        node.$off(event, listener);
      }
    }
    function _$setElements(component, parent, sibling) {
      var brother = _$(sibling);
      if (brother && 'boolean' !== _$type(brother)) {
        component.$siblingEl = brother;
        component.$parentEl = brother.parentElement;
      } else {
        component.$parentEl = _$(parent);
      }
    }
    function _$destroyComponent(component) {
      component.$unmount();
      component.$parent = null;
      component.$parentEl = null;
      component.$siblingEl = null;
      component.$children.splice(0);
    }
    function _$bindClass(classes, classValue) {
      function parseClasses(classes, classValue) {
        var classList = classes.split(' ');
        if (_$isString(classValue)) {
          classList = classList.concat(classValue.split(' '));
        } else if (_$isArray(classValue)) {
          classValue.forEach((function (c) {
            classList = classList.concat(parseClasses('', c));
          }));
        } else if (_$isObject(classValue)) {
          _$each(classValue, (function (value, prop) {
            value && classList.push(prop);
          }));
        }
        return classList.filter((function (c, i) {
          return classList.indexOf(c) === i;
        }));
      }
      return parseClasses(classes, classValue).join(' ');
    }
    function _$bindBooleanAttr(node, attr, value) {
      if (null == value || !1 === value) {
        node.removeAttribute(attr);
        node[attr] = !1;
      } else {
        _$attr(node, attr, '');
        node[attr] = !0;
      }
    }
    function _$bindUpdate(node, attr, value) {
      if (void 0 === value) {
        value = attr;
        attr = 'value';
      }
      var _value = _$toString(value);
      if ('value' === attr) {
        if (node[attr] !== _value) {
          node[attr] = _value;
          node['_' + attr] = value;
        }
      } else if (_$attr(node, attr) !== _value) {
        _$attr(node, attr, _value);
      }
    }
    function _$filters(component, value) {
      _$each(_$slice(arguments, 2), (function (args) {
        var filter = args.splice(0, 1, value)[0];
        value = _$apply(component.$filters[filter], args, component);
      }));
      return value;
    }
    function _$context(ctx, cb) {
      var args = _$slice(arguments, 2).map((function (prop) {
        var value = prop in ctx ? ctx[prop] : window[prop];
        return _$isFunction(value) ? value.bind(ctx) : value;
      }));
      return args.length ? cb(args) : cb();
    }
    function _$insertStyle(id, css) {
      var isNew = !1;
      var style = _$('#' + id, document.head);
      if (!style) {
        isNew = !0;
        (style = document.createElement('style')).id = id;
        _$attr(style, 'refs', 1);
      }
      if (style.textContent !== css) {
        style.textContent = css;
      }
      if (isNew) {
        _$append(document.head, style);
      } else {
        var count = +_$attr(style, 'refs');
        _$attr(style, 'refs', ++count);
      }
    }
    function _$removeStyle(id) {
      var style = _$('#' + id, document.head);
      if (style) {
        var count = +_$attr(style, 'refs');
        if (0 == --count) {
          document.head.removeChild(style);
        } else {
          _$attr(style, 'refs', count);
        }
      }
    }
    var main_a;
    function _$showValue(node, value) {
      var style = node.style;
      if (style.display !== value) {
        style.display = _$toString(value);
      }
      return style.display;
    }
    function _$forLoop(ctx, list, loop) {
      var items = {};
      var globs = _$slice(arguments, 3);
      var loopParent, loopSibling;
      _$each(list, (function (item, key, index) {
        items[key] = _$apply(loop, [ctx, item, key, index], globs);
      }));
      return {
        $create: function () {
          _$each(items, (function (item) {
            item.$create();
          }));
        },
        $mount: function (parent, sibling) {
          loopParent = _$(parent);
          loopSibling = _$(sibling);
          _$each(items, (function (item) {
            item.$mount(loopParent, loopSibling);
          }));
        },
        $update: function (ctx, obj) {
          var globs = _$slice(arguments, 2);
          _$each(items, (function (item, key, index) {
            if (obj[key]) {
              _$apply(item.$update, [ctx, obj[key], key, index], globs, item);
            } else {
              item.$destroy();
              delete items[key];
            }
          }));
          _$each(obj, (function (item, key, index) {
            if (!items[key]) {
              items[key] = _$apply(loop, [ctx, item, key, index], globs);
              items[key].$create();
              items[key].$mount(loopParent, loopSibling);
            }
          }));
        },
        $destroy: function () {
          _$each(items, (function (item) {
            item.$destroy();
          }));
        }
      };
    }
    function _$loop_1(_$ctx, todo, i) {
      var _a;
      var _$tpl, _$elements, _$li_1, _$bindClassLi_1, _$div_1, _$input_1, _$bindCheckedInput_1, _$changeEvent_1, _$listenerChangeEvent_1, _$label_1, _$dblclickEvent_1, _$listenerDblclickEvent_1, _$txt_1, _$setTxt_1, _$button_1, _$clickEvent_1, _$listenerClickEvent_1, _$input_2, _$setFocusInput_2, _$inputEvent_1, _$listenerInputEvent_1, _$bindValueInput_2, _$blurEvent_1, _$listenerBlurEvent_1, _$keyupEvent_1, _$listenerKeyupEvent_1;
      _$bindClassLi_1 = function (_$ctx, todo) {
        return _$bindClass('scope_4827b611 todo', _$context(_$ctx, (function (_a) {
          var editedTodo = _a[0];
          return {
            completed: todo.completed,
            editing: todo === editedTodo
          };
        }), 'editedTodo'));
      };
      _$bindCheckedInput_1 = function (_$ctx, todo) {
        return todo.completed;
      };
      _$changeEvent_1 = function (_$ctx, todo, i, $event, $el) {
        _$context(_$ctx, (function (_a) {
          return (0, _a[0])(i, $el.checked);
        }), 'mark');
      };
      _$dblclickEvent_1 = function (_$ctx, todo, i) {
        _$context(_$ctx, (function (_a) {
          return (0, _a[0])(todo, i);
        }), 'editTodo');
      };
      _$setTxt_1 = function (_$ctx, todo) {
        return '' + todo.title;
      };
      _$clickEvent_1 = function (_$ctx, todo) {
        _$context(_$ctx, (function (_a) {
          return (0, _a[0])(todo);
        }), 'removeTodo');
      };
      _$setFocusInput_2 = function (_$ctx) {
        _$context(_$ctx, (function (_a) {
          var editedTodo = _a[0];
          return todo === editedTodo;
        }), 'editedTodo') && _$input_2.focus();
      };
      _$inputEvent_1 = function (_$ctx, todo, i, $event, $el) {
        todo.title = $el.value;
      };
      _$bindValueInput_2 = function (_$ctx, todo) {
        return todo.title;
      };
      _$blurEvent_1 = function (_$ctx) {
        _$ctx.$set('editedTodo', null);
      };
      _$keyupEvent_1 = function (_$ctx, todo, i, $event) {
        _$context(_$ctx, (function (_a) {
          return (0, _a[0])(todo, $event);
        }), 'doneEdit');
      };
      _a = _$fragTpl('<li class="scope_4827b611 todo"><div class="scope_4827b611 view"><input class="scope_4827b611 toggle" type="checkbox"><label class="scope_4827b611"> </label><button class="scope_4827b611 destroy"></button></div><input type="text" class="scope_4827b611 edit"></li>'),
        _$tpl = _a[0], _$elements = _a.slice(1);
      return {
        $create: function () {
          _$li_1 = _$child(_$tpl);
          _$div_1 = _$child(_$li_1);
          _$addEvent(_$input_1 = _$child(_$div_1), 'change', _$listenerChangeEvent_1 = function ($event) {
            _$changeEvent_1(_$ctx, todo, i, $event, _$input_1);
          });
          _$addEvent(_$label_1 = _$child(_$div_1, 1), 'dblclick', _$listenerDblclickEvent_1 = function ($event) {
            _$dblclickEvent_1(_$ctx, todo, i, $event, _$label_1);
          });
          _$txt_1 = _$child(_$label_1);
          _$addEvent(_$button_1 = _$child(_$div_1, 2), 'click', _$listenerClickEvent_1 = function ($event) {
            _$clickEvent_1(_$ctx, todo, i, $event, _$button_1);
          });
          _$addEvent(_$input_2 = _$child(_$li_1, 1), 'input', _$listenerInputEvent_1 = function ($event) {
            _$inputEvent_1(_$ctx, todo, i, $event, _$input_2);
          });
          _$addEvent(_$input_2, 'blur', _$listenerBlurEvent_1 = function ($event) {
            _$blurEvent_1(_$ctx, todo, i, $event, _$input_2);
          });
          _$addEvent(_$input_2, 'keyup', _$listenerKeyupEvent_1 = function ($event) {
            _$keyupEvent_1(_$ctx, todo, i, $event, _$input_2);
          });
        },
        $mount: function (parent, sibling) {
          this.$unmount();
          _$append(_$(parent), _$tpl, _$(sibling));
        },
        $update: function (_$ctx, todo, i) {
          _$bindUpdate(_$li_1, 'class', _$bindClassLi_1(_$ctx, todo, i));
          _$bindBooleanAttr(_$input_1, 'checked', _$bindCheckedInput_1(_$ctx, todo, i));
          _$updateTxt(_$txt_1, _$setTxt_1(_$ctx, todo, i));
          _$setFocusInput_2(_$ctx);
          _$bindUpdate(_$input_2, _$bindValueInput_2(_$ctx, todo, i));
        },
        $unmount: function () {
          _$prepareFragment(_$tpl, _$elements);
          _$bindUpdate(_$li_1, 'class', _$bindClassLi_1(_$ctx, todo, i));
          _$bindBooleanAttr(_$input_1, 'checked', _$bindCheckedInput_1(_$ctx, todo, i));
          _$updateTxt(_$txt_1, _$setTxt_1(_$ctx, todo, i));
          _$setFocusInput_2(_$ctx);
          _$bindUpdate(_$input_2, _$bindValueInput_2(_$ctx, todo, i));
        },
        $destroy: function () {
          this.$unmount();
          _$removeEvent(_$input_1, 'change', _$listenerChangeEvent_1);
          _$removeEvent(_$label_1, 'dblclick', _$listenerDblclickEvent_1);
          _$removeEvent(_$button_1, 'click', _$listenerClickEvent_1);
          _$removeEvent(_$input_2, 'input', _$listenerInputEvent_1);
          _$removeEvent(_$input_2, 'blur', _$listenerBlurEvent_1);
          _$removeEvent(_$input_2, 'keyup', _$listenerKeyupEvent_1);
          _$tpl = _$elements = _$li_1 = _$bindClassLi_1 = _$div_1 = _$input_1 = _$bindCheckedInput_1 = _$changeEvent_1 = _$listenerChangeEvent_1 = _$label_1 = _$dblclickEvent_1 = _$listenerDblclickEvent_1 = _$txt_1 = _$setTxt_1 = _$button_1 = _$clickEvent_1 = _$listenerClickEvent_1 = _$input_2 = _$setFocusInput_2 = _$inputEvent_1 = _$listenerInputEvent_1 = _$bindValueInput_2 = _$blurEvent_1 = _$listenerBlurEvent_1 = _$keyupEvent_1 = _$listenerKeyupEvent_1 = void 0;
        }
      };
    }
    function _$tplMain(_$ctx) {
      var _a;
      var _$tpl, _$elements, _$section_1, _$header_1, _$input_1, _$inputEvent_1, _$listenerInputEvent_1, _$bindValueInput_1, _$keyupEvent_1, _$listenerKeyupEvent_1, _$section_2, _$displaySection_2, _$input_2, _$bindCheckedInput_2, _$changeEvent_1, _$listenerChangeEvent_1, _$ul_1, _$loopAnchor_1, _$loopBlock_1, _$footer_1, _$displayFooter_1, _$span_1, _$txt_1, _$setTxt_1, _$ul_2, _$li_1, _$a_1, _$bindClassA_1, _$clickEvent_1, _$listenerClickEvent_1, _$li_2, _$a_2, _$bindClassA_2, _$clickEvent_2, _$listenerClickEvent_2, _$li_3, _$a_3, _$bindClassA_3, _$clickEvent_3, _$listenerClickEvent_3, _$button_1, _$displayButton_1, _$clickEvent_4, _$listenerClickEvent_4;
      _$inputEvent_1 = function (_$ctx, $event, $el) {
        _$ctx.$set('newTodo', $el.value);
      };
      _$bindValueInput_1 = function (_$ctx) {
        return _$context(_$ctx, (function (_a) {
          return _a[0];
        }), 'newTodo');
      };
      _$keyupEvent_1 = function (_$ctx) {
        _$context(_$ctx, (function (_a) {
          return (0, _a[0])();
        }), 'addTodo');
      };
      var _$showSection_2 = function (_$ctx, $el, $display) {
        _$showValue($el, _$context(_$ctx, (function (_a) {
          return _a[0].length;
        }), 'todos') ? $display : 'none');
      };
      _$bindCheckedInput_2 = function (_$ctx) {
        return _$context(_$ctx, (function (_a) {
          return _a[0];
        }), 'allDone');
      };
      _$changeEvent_1 = function (_$ctx, $event, $el) {
        _$context(_$ctx, (function (_a) {
          return (0, _a[0])($el.checked);
        }), 'markAll');
      };
      _$loopBlock_1 = _$forLoop(_$ctx, _$context(_$ctx, (function (_a) {
        var todos = _a[0], view = _a[1];
        return _$filters(_$ctx, todos, ['filterByView', view]);
      }), 'todos', 'view'), _$loop_1);
      var _$showFooter_1 = function (_$ctx, $el, $display) {
        _$showValue($el, _$context(_$ctx, (function (_a) {
          return _a[0].length;
        }), 'todos') ? $display : 'none');
      };
      _$setTxt_1 = function (_$ctx) {
        return _$context(_$ctx, (function (_a) {
          var remaining = _a[0];
          return remaining + ' ' + _$filters(_$ctx, 'item', ['pluralize', remaining]) + ' left';
        }), 'remaining');
      };
      _$bindClassA_1 = function (_$ctx) {
        return _$bindClass('scope_4827b611', _$context(_$ctx, (function (_a) {
          return {
            selected: '' === _a[0]
          };
        }), 'view'));
      };
      _$clickEvent_1 = function (_$ctx) {
        _$ctx.$set('view', '');
      };
      _$bindClassA_2 = function (_$ctx) {
        return _$bindClass('scope_4827b611', _$context(_$ctx, (function (_a) {
          return {
            selected: 'active' === _a[0]
          };
        }), 'view'));
      };
      _$clickEvent_2 = function (_$ctx) {
        _$ctx.$set('view', 'active');
      };
      _$bindClassA_3 = function (_$ctx) {
        return _$bindClass('scope_4827b611', _$context(_$ctx, (function (_a) {
          return {
            selected: 'completed' === _a[0]
          };
        }), 'view'));
      };
      _$clickEvent_3 = function (_$ctx) {
        _$ctx.$set('view', 'completed');
      };
      var _$showButton_1 = function (_$ctx, $el, $display) {
        _$showValue($el, _$context(_$ctx, (function (_a) {
          var todos = _a[0], remaining = _a[1];
          return todos.length > remaining;
        }), 'todos', 'remaining') ? $display : 'none');
      };
      _$clickEvent_4 = function (_$ctx) {
        _$context(_$ctx, (function (_a) {
          return (0, _a[0])();
        }), 'removeCompleted');
      };
      _a = _$fragTpl('<section class="scope_4827b611 todoapp"><header class="scope_4827b611 header"><h1 class="scope_4827b611">todos</h1><input class="scope_4827b611 new-todo" placeholder="What needs to be done?" autofocus=""></header><section class="scope_4827b611 main"><input id="toggle-all" class="scope_4827b611 toggle-all" type="checkbox"><label for="toggle-all" class="scope_4827b611">Mark all as complete</label><ul class="scope_4827b611 todo-list">', '</ul></section><footer class="scope_4827b611 footer"><span class="scope_4827b611 todo-count"> </span><ul class="scope_4827b611 filters"><li class="scope_4827b611"><a href="#" class="scope_4827b611">All</a></li><li class="scope_4827b611"><a href="#active" class="scope_4827b611">Active</a></li><li class="scope_4827b611"><a href="#completed" class="scope_4827b611">Completed</a></li></ul><button class="scope_4827b611 clear-completed">\r\n      Clear completed\r\n    </button></footer></section>'),
        _$tpl = _a[0], _$elements = _a.slice(1);
      return {
        $create: function () {
          _$section_1 = _$child(_$tpl);
          _$header_1 = _$child(_$section_1);
          _$addEvent(_$input_1 = _$child(_$header_1, 1), 'input', _$listenerInputEvent_1 = function ($event) {
            _$inputEvent_1(_$ctx, $event, _$input_1);
          });
          _$addEvent(_$input_1, 'keyup', _$listenerKeyupEvent_1 = function ($event) {
            if (_$eventKeys($event, 'enter')) {
              _$keyupEvent_1(_$ctx, $event, _$input_1);
            }
          });
          _$section_2 = _$child(_$section_1, 1);
          _$addEvent(_$input_2 = _$child(_$section_2), 'change', _$listenerChangeEvent_1 = function ($event) {
            _$changeEvent_1(_$ctx, $event, _$input_2);
          });
          _$ul_1 = _$child(_$section_2, 2);
          _$loopAnchor_1 = _$child(_$ul_1);
          _$loopBlock_1.$create();
          _$footer_1 = _$child(_$section_1, 2);
          _$span_1 = _$child(_$footer_1);
          _$txt_1 = _$child(_$span_1);
          _$ul_2 = _$child(_$footer_1, 1);
          _$li_1 = _$child(_$ul_2);
          _$addEvent(_$a_1 = _$child(_$li_1), 'click', _$listenerClickEvent_1 = function ($event) {
            _$clickEvent_1(_$ctx, $event, _$a_1);
          });
          _$li_2 = _$child(_$ul_2, 1);
          _$addEvent(_$a_2 = _$child(_$li_2), 'click', _$listenerClickEvent_2 = function ($event) {
            _$clickEvent_2(_$ctx, $event, _$a_2);
          });
          _$li_3 = _$child(_$ul_2, 2);
          _$addEvent(_$a_3 = _$child(_$li_3), 'click', _$listenerClickEvent_3 = function ($event) {
            _$clickEvent_3(_$ctx, $event, _$a_3);
          });
          _$addEvent(_$button_1 = _$child(_$footer_1, 2), 'click', _$listenerClickEvent_4 = function ($event) {
            _$clickEvent_4(_$ctx, $event, _$button_1);
          });
        },
        $mount: function (parent, sibling) {
          this.$unmount();
          _$insertStyle('scope_4827b611', '.scope_4827b611.view label.scope_4827b611 {\n  user-select: none;\n  -webkit-user-select: none;\n  -moz-user-select: none;\n  -ms-user-select: none;\n  -o-user-select: none;\n}\n');
          _$append(_$(parent), _$tpl, _$(sibling));
          _$setElements(this, parent, sibling);
        },
        $update: function (_$ctx) {
          _$bindUpdate(_$input_1, _$bindValueInput_1(_$ctx));
          _$showSection_2(_$ctx, _$section_2, _$displaySection_2);
          _$bindBooleanAttr(_$input_2, 'checked', _$bindCheckedInput_2(_$ctx));
          _$loopBlock_1.$update(_$ctx, _$context(_$ctx, (function (_a) {
            var todos = _a[0], view = _a[1];
            return _$filters(_$ctx, todos, ['filterByView', view]);
          }), 'todos', 'view'));
          _$showFooter_1(_$ctx, _$footer_1, _$displayFooter_1);
          _$updateTxt(_$txt_1, _$setTxt_1(_$ctx));
          _$bindUpdate(_$a_1, 'class', _$bindClassA_1(_$ctx));
          _$bindUpdate(_$a_2, 'class', _$bindClassA_2(_$ctx));
          _$bindUpdate(_$a_3, 'class', _$bindClassA_3(_$ctx));
          _$showButton_1(_$ctx, _$button_1, _$displayButton_1);
        },
        $unmount: function () {
          _$prepareFragment(_$tpl, _$elements);
          _$bindUpdate(_$input_1, _$bindValueInput_1(_$ctx));
          _$displaySection_2 = _$showValue(_$section_2);
          _$showSection_2(_$ctx, _$section_2, _$displaySection_2);
          _$bindBooleanAttr(_$input_2, 'checked', _$bindCheckedInput_2(_$ctx));
          _$loopBlock_1.$mount(_$ul_1, _$loopAnchor_1);
          _$displayFooter_1 = _$showValue(_$footer_1);
          _$showFooter_1(_$ctx, _$footer_1, _$displayFooter_1);
          _$updateTxt(_$txt_1, _$setTxt_1(_$ctx));
          _$bindUpdate(_$a_1, 'class', _$bindClassA_1(_$ctx));
          _$bindUpdate(_$a_2, 'class', _$bindClassA_2(_$ctx));
          _$bindUpdate(_$a_3, 'class', _$bindClassA_3(_$ctx));
          _$displayButton_1 = _$showValue(_$button_1);
          _$showButton_1(_$ctx, _$button_1, _$displayButton_1);
        },
        $destroy: function () {
          _$destroyComponent(this);
          _$removeStyle('scope_4827b611');
          _$removeEvent(_$input_1, 'input', _$listenerInputEvent_1);
          _$removeEvent(_$input_1, 'keyup', _$listenerKeyupEvent_1);
          _$removeEvent(_$input_2, 'change', _$listenerChangeEvent_1);
          _$loopBlock_1.$destroy();
          _$removeEvent(_$a_1, 'click', _$listenerClickEvent_1);
          _$removeEvent(_$a_2, 'click', _$listenerClickEvent_2);
          _$removeEvent(_$a_3, 'click', _$listenerClickEvent_3);
          _$removeEvent(_$button_1, 'click', _$listenerClickEvent_4);
          _$tpl = _$elements = _$section_1 = _$header_1 = _$input_1 = _$inputEvent_1 = _$listenerInputEvent_1 = _$bindValueInput_1 = _$keyupEvent_1 = _$listenerKeyupEvent_1 = _$section_2 = _$displaySection_2 = _$input_2 = _$bindCheckedInput_2 = _$changeEvent_1 = _$listenerChangeEvent_1 = _$ul_1 = _$loopAnchor_1 = _$loopBlock_1 = _$footer_1 = _$displayFooter_1 = _$span_1 = _$txt_1 = _$setTxt_1 = _$ul_2 = _$li_1 = _$a_1 = _$bindClassA_1 = _$clickEvent_1 = _$listenerClickEvent_1 = _$li_2 = _$a_2 = _$bindClassA_2 = _$clickEvent_2 = _$listenerClickEvent_2 = _$li_3 = _$a_3 = _$bindClassA_3 = _$clickEvent_3 = _$listenerClickEvent_3 = _$button_1 = _$displayButton_1 = _$clickEvent_4 = _$listenerClickEvent_4 = void 0;
        }
      };
    }
    (new (_$createComponent(((main_a = function () {
      function class_1() {
        this.todos = [];
        this.newTodo = '';
        this.oldTitle = '';
        this._allDone = !1;
        this.editedTodo = null;
      }
      Object.defineProperty(class_1.prototype, 'allDone', {
        get: function () {
          return this._allDone || 0 === this.remaining;
        },
        set: function (value) {
          this._allDone = value;
        },
        enumerable: !0,
        configurable: !0
      });
      Object.defineProperty(class_1.prototype, 'remaining', {
        get: function () {
          return this.$filters.actives(this.todos).length;
        },
        enumerable: !0,
        configurable: !0
      });
      class_1.prototype.addTodo = function () {
        var title = this.newTodo && this.newTodo.trim();
        if (!title) {
          return;
        }
        this.newTodo = '';
        this.todos.push({
          title: title,
          completed: !1
        });
        this.$set('allDone', 0 === this.remaining);
      };
      class_1.prototype.editTodo = function (todo) {
        this.editedTodo = todo;
        this.oldTitle = todo.title;
        this.$update();
      };
      class_1.prototype.doneEdit = function (todo, e) {
        if ('Enter' === e.key) {
          todo.title = todo.title.trim();
          if (!todo.title) {
            this.removeTodo(todo);
          }
          this.clearTmps();
        } else if ('Escape' === e.key) {
          todo.title = this.oldTitle;
          this.clearTmps();
        }
      };
      class_1.prototype.removeTodo = function (todo) {
        var index = this.todos.indexOf(todo);
        this.todos.splice(index, 1);
        this.$set('allDone', 0 === this.remaining);
      };
      class_1.prototype.mark = function (item, value) {
        this.$filters.filterByView(this.todos, this.view)[item].completed = value;
        this.allDone = 0 === this.remaining;
        this.$update();
      };
      class_1.prototype.markAll = function (value) {
        this.todos.forEach((function (todo) {
          todo.completed = value;
        }));
        this.$set('allDone', value);
      };
      class_1.prototype.removeCompleted = function () {
        this.$set('todos', this.$filters.actives(this.todos));
      };
      class_1.prototype.clearTmps = function () {
        this.editedTodo = null;
        this.oldTitle = '';
        this.$update();
      };
      return class_1;
    }()).$filters = {
      actives: function (todos) {
        return todos.filter((function (todo) {
          return !todo.completed;
        }));
      },
      filterByView: function (todos, view) {
        switch (view) {
          case 'active':
            return todos.filter((function (todo) {
              return !todo.completed;
            }));

          case 'completed':
            return todos.filter((function (todo) {
              return todo.completed;
            }));

          default:
            return todos;
        }
      },
      pluralize: function (word, count) {
        return word + (1 !== count ? 's' : '');
      }
    }, main_a), _$tplMain))).$mount('main');
  }]);
}));