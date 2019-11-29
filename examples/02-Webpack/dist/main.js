!function(root, factory) {
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
}(window, (function() {
  return function(modules) {
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
    __webpack_require__.d = function(exports, name, getter) {
      if (!__webpack_require__.o(exports, name)) {
        Object.defineProperty(exports, name, {
          enumerable: !0,
          get: getter
        });
      }
    };
    __webpack_require__.r = function(exports) {
      if ('undefined' != typeof Symbol && Symbol.toStringTag) {
        Object.defineProperty(exports, Symbol.toStringTag, {
          value: 'Module'
        });
      }
      Object.defineProperty(exports, '__esModule', {
        value: !0
      });
    };
    __webpack_require__.t = function(value, mode) {
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
          __webpack_require__.d(ns, key, function(key) {
            return value[key];
          }.bind(null, key));
        }
      }
      return ns;
    };
    __webpack_require__.n = function(module) {
      var getter = module && module.__esModule ? function() {
        return module.default;
      } : function() {
        return module;
      };
      __webpack_require__.d(getter, 'a', getter);
      return getter;
    };
    __webpack_require__.o = function(object, property) {
      return Object.prototype.hasOwnProperty.call(object, property);
    };
    __webpack_require__.p = '';
    return __webpack_require__(__webpack_require__.s = 0);
  }([ function(module, __webpack_exports__, __webpack_require__) {
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
      _$each(_$isObject(obj) ? obj : {}, (function(value, k) {
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
      return path.split('.').reduce((function(obj, key, i, arr) {
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
        _$each(component._watchers[key], (function(watcher) {
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
    var _$Component = function() {
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
        _$each(compCtor.$attributes || [], (function(attrOps, key) {
          key = _$isType(key, 'number') ? attrOps : key;
          propMap[key] = {
            get: function() {
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
            set: function() {
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
          get: function() {
            return _$plainObject(this);
          },
          enumerable: !0,
          configurable: !0
        }
      });
      prototype.$get = function(path) {
        return _$accesor(this, path);
      };
      prototype.$set = function(path, value) {
        _$accesor(this, path, value);
      };
      prototype.$on = function(event, handler) {
        if (!this._events[event]) {
          this._events[event] = [];
        }
        this._events[event].push(handler);
      };
      prototype.$off = function(event, handler) {
        var index = this._events[event].indexOf(handler);
        ~index && this._events[event].splice(index, 1);
      };
      prototype.$once = function(event, handler) {
        var _this = this;
        var _handler = function(args) {
          handler(args);
          _this.$off(event, _handler);
        };
        this.$on(event, _handler);
      };
      prototype.$fire = function(event, data) {
        if (this._events[event]) {
          _$each(this._events[event], (function(handler) {
            handler(data);
          }));
        }
      };
      prototype.$notify = function(key) {
        if (this._subscribers[key]) {
          _$each(this._subscribers[key], (function(suscriber) {
            suscriber();
          }));
        }
      };
      prototype.$observe = function(keyOrKeys, handler) {
        var _this = this;
        var subs = [];
        if (_$isArray(keyOrKeys)) {
          _$each(keyOrKeys, (function(key) {
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
          $unobserve: function() {
            _$each(subs, (function(_a) {
              var subscrition = _a.subscrition, index = _a.index;
              _this._subscribers[subscrition].splice(index, 1);
            }));
          }
        };
      };
      prototype.$watch = function(key, handler) {
        var _this = this;
        if (!this._watchers[key]) {
          this._watchers[key] = [];
        }
        var i = this._watchers[key].push(handler.bind(this));
        return {
          $unwatch: function() {
            _this._watchers[key].splice(i - 1, 1);
          }
        };
      };
      return _$Component;
    }();
    var _$List = function(_super) {
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
        _$apply(_super.prototype.push, value.map((function(val, i) {
          if (0 !== self.length) {
            i += self.length;
          }
          return !_$isType(val, List) && _$isArray(val) ? new List(val, component, key + '.' + i) : val;
        })), [], self);
      }
      List.prototype.pull = function(index) {
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
          _$apply(self.splice, [ index, 1 ].concat(args), [], self);
        }
      };
      [ 'pop', 'push', 'reverse', 'shift', 'sort', 'fill', 'unshift', 'splice' ].forEach((function(method) {
        List.prototype[method] = function() {
          var self = this;
          var args = _$slice(arguments);
          var old = self.slice();
          var result = void 0;
          if ('push' === method) {
            _$apply([].push, args.map((function(v, i) {
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
        _$apply(_$Component, [ attrs, $ComponentCtor, parent ], [], self);
        $ComponentClass.call(self);
        var descriptors = {};
        _$each(self, (function(_, key) {
          if (_$hasProp(self, key)) {
            var descriptor = Object.getOwnPropertyDescriptor(self, key);
            if (descriptor.value && _$isArray(descriptor.value)) {
              descriptor.value = new _$List(descriptor.value, self, key);
            } else {
              if (descriptor.get) {
                var getter_1_1 = descriptor.get;
                descriptor.get = function() {
                  var value = getter_1_1.call(this);
                  if (_$isArray(value)) {
                    value = new _$List(value, this, key);
                  }
                  return value;
                };
              }
              if (descriptor.set) {
                var setter_1_1 = descriptor.set;
                descriptor.set = function(value) {
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
        _$each(tpl, (function(value, key) {
          tplDesc[key] = function(key, value) {
            var hook = key[1].toUpperCase() + _$slice(key, 2);
            return {
              enumerable: !1,
              configurable: !1,
              writable: !1,
              value: function() {
                var args = _$slice(arguments);
                var ahook = this['did' + hook];
                var bhook = this['will' + hook];
                bhook && bhook.call(this);
                _$apply(value, '$update' === key ? [ this, _$slice(args, 1) ] : args, this);
                ahook && ahook.call(this);
              }
            };
          }(key, value);
        }));
        _$define(self, tplDesc);
        _$each(_$treborPlugins(), (function(_a) {
          var plugin = _a.plugin, options = _a.options;
          plugin.call(self, $ComponentCtor, options);
        }));
        !parent && this.$create();
      }
      var proto = [ $ComponentClass.prototype, _$Component.prototype ].reduceRight((function(superProto, proto) {
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
      $ComponentCtor.$plugin = function(plugin, options) {
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
        _$each(els, (function(el) {
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
    function _$context(ctx, cb) {
      var args = _$slice(arguments, 2).map((function(prop) {
        return prop in ctx ? ctx[prop] : window[prop];
      }));
      return args.length ? cb(args) : cb();
    }
    function _$tplMain(_$ctx) {
      var _a;
      var _$tpl, _$elements, _$h1_1, _$txt_1, _$setTxt_1;
      _$setTxt_1 = function(_$ctx) {
        return _$context(_$ctx, (function(_a) {
          return 'Hello, ' + _a[0] + '!';
        }), 'name');
      };
      _a = _$fragTpl('<h1> </h1>'), _$tpl = _a[0], _$elements = _a.slice(1);
      return {
        $create: function() {
          _$h1_1 = _$child(_$tpl);
          _$txt_1 = _$child(_$h1_1);
        },
        $mount: function(parent, sibling) {
          this.$unmount();
          _$append(_$(parent), _$tpl, _$(sibling));
          _$setElements(this, parent, sibling);
        },
        $update: function(_$ctx) {
          _$updateTxt(_$txt_1, _$setTxt_1(_$ctx));
        },
        $unmount: function() {
          _$prepareFragment(_$tpl, _$elements);
          _$updateTxt(_$txt_1, _$setTxt_1(_$ctx));
        },
        $destroy: function() {
          _$destroyComponent(this);
          _$tpl = _$elements = _$h1_1 = _$txt_1 = _$setTxt_1 = void 0;
        }
      };
    }
    (new (_$createComponent(function() {
      function class_1() {
        this.name = 'World';
      }
      return class_1;
    }(), _$tplMain))).$mount('main');
  } ]);
}));