var Child = function() {
  function _$CompCtr(attrs, template, options) {
    var _this = this;
    attrs || (attrs = {}), [ "$slots", "$refs", "$filters", "$directives", "_events", "_watchers" ].forEach(function(prop) {
      _$def(_this, prop, {
        value: {}
      });
    }), _$def(this, "_subscribers", {
      value: {},
      writable: !0
    }), _$def(this, "$options", {
      value: options,
      enumerable: !0,
      writable: !0
    }), this.$options.attrs || (this.$options.attrs = {}), this.$options.filters && _$e(this.$options.filters, function(filter, key) {
      _this.$filters[key] = filter;
    }), this.$options.children || (this.$options.children = {}), this.$options.directives && _$e(this.$options.directives, function(directive, key) {
      _this.$directives[key] = directive;
    }), _$e(this.$options.attrs, function(attrOps, key) {
      _$def(_this, "number" == typeof key ? attrOps : key, {
        get: function() {
          if ("string" == typeof attrOps) {
            return "function" == typeof attrs[attrOps] ? attrs[attrOps]() : attrs[attrOps];
          }
          if (hasProp(attrs, key) || !attrOps.required) {
            var value = "function" == typeof attrs[key] ? attrs[key]() : attrs[key];
            return void 0 === value && hasProp(options, "default") && (value = "function" == typeof attrOps.default ? attrOps.default : attrOps.default()), 
            attrOps.type && !function _$isType(value, type) {
              switch (type) {
               case "string":
               case "number":
               case "object":
               case "boolean":
               case "function":
                return typeof value === type;

               case "array":
                return Array.isArray(value);

               default:
                return value instanceof type;
              }
            }(value, attrOps.type) ? void console.error("Attribute '" + key + "' most be type '" + attrOps.type + "'.") : function _$toType(value, type, root, key) {
              switch (type) {
               case "string":
                return value.toString();

               case "number":
                return +value;

               case "boolean":
                return !!value;

               case "function":
                return new Function(value);

               case "array":
                return value instanceof _$List ? value : new _$List(value, root, key);

               case "object":
                return _$accesor(value, value, root, key), value;

               default:
                return value;
              }
            }(value, attrOps.type, this, key);
          }
          console.error("Attribute '" + key + "' most be present because it's required.");
        },
        set: function() {
          console.error("Can not set attribute '" + key + "' because attributes al read only.");
        },
        enumerable: !0,
        configurable: !0
      });
    });
    var mounted = (this.$options.model || {}).mounted || function() {};
    this.$set(this.$options.model || {});
    var tpl = template(this, this.$options.children);
    _$e(tpl, function(value, key) {
      "$mount" === key && (value = function(key) {
        return function(parent, sibling) {
          this.$root = _$(parent), tpl[key].call(this, parent, sibling), mounted.call(this);
        };
      }(key)), _$def(_this, key, {
        value: value,
        enumerable: !0
      });
    }), this.$create();
  }
  function _$List(value, root, key) {
    var _a;
    Array.apply(this, [ value.length ]), _$def(this, "length", {
      value: (_a = Array.prototype.push).call.apply(_a, [ this ].concat(value.map(function(v) {
        return Array.isArray(v) && (v = new _$List(v, root, null)), "object" == typeof v && _$accesor(v, v, root, null), 
        v;
      }))),
      writable: !0,
      configurable: !0,
      enumerable: !1
    }), [ "pop", "push", "reverse", "shift", "sort", "fill", "unshift", "splice" ].forEach(function(method) {
      _$List.prototype[method] = function() {
        for (var args = [], _i = 0; _i < arguments.length; _i++) {
          args[_i] = arguments[_i];
        }
        var old = this.slice(), result = Array.prototype[method].apply(this, args);
        return _$dispatch(root, key, old, this.slice()), result;
      };
    });
  }
  function _$dispatch(root, key, oldVal, value) {
    root.$notify(key), root._watchers[key] && root._watchers[key].forEach(function(watcher) {
      watcher(oldVal, value);
    }), root.$update(root);
  }
  function hasProp(obj, prop) {
    return obj.hasOwnProperty(prop);
  }
  function _$accesor(obj, data, root, pKey) {
    var _loop_1 = function(key) {
      if (hasProp(data, key)) {
        var desc = Object.getOwnPropertyDescriptor(data, key);
        if ("function" == typeof desc.value || desc.get) {
          _$def(obj, key, desc);
        } else {
          var value_1 = data[key], k_1 = pKey ? pKey + "." + key : key;
          _$def(obj, key, {
            get: function() {
              return value_1;
            },
            set: function(v) {
              var oldVal = value_1;
              value_1 = v, Array.isArray(value_1) ? value_1 = new _$List(value_1, root, k_1) : "object" == typeof value_1 && _$accesor(value_1, v, root, k_1), 
              _$dispatch(root || this, k_1, oldVal, value_1);
            },
            enumerable: !0,
            configurable: !0
          }), Array.isArray(value_1) ? value_1 = new _$List(value_1, root, k_1) : "object" == typeof value_1 && _$accesor(obj[key], value_1, root, k_1);
        }
      }
    };
    for (var key in data) {
      _loop_1(key);
    }
  }
  function _subs(dep, listener) {
    return this._subscribers[dep] || (this._subscribers[dep] = []), this._subscribers[dep].push(listener.bind(this)) - 1;
  }
  function _$def(obj, key, desc) {
    Object.defineProperty(obj, key, desc);
  }
  function _$(selector, parent) {
    return "string" == typeof selector ? (parent || document).querySelector(selector) : selector;
  }
  function _$d() {
    return document.createDocumentFragment();
  }
  function _$a(parent, child, sibling) {
    sibling ? parent.insertBefore(child, sibling) : parent.appendChild(child);
  }
  function _$r(el, parent) {
    var root = parent || el.parentElement;
    root && root.removeChild(el);
  }
  function _$ce(tagName) {
    return document.createElement(tagName || "div");
  }
  function _$sa(el, attr, value) {
    el.setAttribute(attr, value);
  }
  function _$e(obj, cb) {
    for (var key in obj) {
      hasProp(obj, key) && cb(obj[key], isNaN(+key) ? key : +key);
    }
  }
  function itemLoop_1(state) {
    return state.$slots.item = _$d(), {
      $create: function() {},
      $mount: function(parent, sibling) {
        var frag = _$d();
        _$a(frag, state.$slots.item), _$a(_$(parent), frag, _$(sibling));
      },
      $update: function() {},
      $destroy: function() {}
    };
  }
  function _$tplChild(state) {
    var div, header, main, ul, loopAnchor_1, loopBlock_1, footer;
    return state.$slots.header = _$d(), loopBlock_1 = function _$f(root, obj, loop) {
      var loopParent, loopSibling, items = {};
      return _$e(obj, function(item, i) {
        items[i] = loop(root, item, i);
      }), {
        $create: function() {
          _$e(items, function(item) {
            item.$create();
          });
        },
        $mount: function(parent, sibling) {
          loopParent = _$(parent), loopSibling = _$(sibling), _$e(items, function(item) {
            item.$mount(loopParent, loopSibling);
          });
        },
        $update: function(_this, obj) {
          _$e(items, function(item, i) {
            obj[i] ? item.$update(_this, obj[i], i) : (item.$destroy(), delete items[i]);
          }), _$e(obj, function(item, i) {
            items[i] || (items[i] = loop(_this, item, i), items[i].$create(), items[i].$mount(loopParent, loopSibling));
          });
        },
        $destroy: function() {
          _$e(items, function(item) {
            item.$destroy();
          });
        }
      };
    }(state, state.items, itemLoop_1), loopAnchor_1 = function _$ct(content) {
      return document.createTextNode(content || "");
    }(), state.$slots.default = _$d(), state.$slots.footer = _$d(), {
      $create: function() {
        div = _$ce(), header = _$ce("header"), _$a(div, header), main = _$ce("main"), _$a(ul = _$ce("ul"), loopAnchor_1), 
        loopBlock_1.$create(), _$a(main, ul), _$a(div, main), footer = _$ce("footer"), _$a(div, footer), 
        this.$hydrate();
      },
      $hydrate: function() {
        _$sa(div, "class", "container");
      },
      $mount: function(parent, sibling) {
        var frag = _$d();
        _$a(header, state.$slots.header), loopBlock_1.$mount(ul, loopAnchor_1), _$a(main, state.$slots.default), 
        _$a(footer, state.$slots.footer), _$a(frag, div), _$a(_$(parent), frag, _$(sibling));
      },
      $update: function(state) {
        loopBlock_1.$update(state, state.items);
      },
      $destroy: function() {
        loopBlock_1.$destroy(), div && _$r(div), div = header = main = ul = loopAnchor_1 = loopBlock_1 = footer = void 0;
      }
    };
  }
  function Child(attrs) {
    _$CompCtr.call(this, attrs, _$tplChild, {
      attrs: {
        items: {
          type: "array",
          default: function() {
            return [];
          }
        }
      }
    });
  }
  return _$CompCtr.prototype.$set = function(value) {
    _$accesor(this, value, this, null);
  }, _$CompCtr.prototype.$on = function(event, handler) {
    var _this = this;
    this._events[event] || (this._events[event] = []);
    var i = this._events[event].push(handler);
    return {
      $off: function() {
        _this._events[event].splice(i - 1, 1);
      }
    };
  }, _$CompCtr.prototype.$once = function(event, handler) {
    var e = this.$on(event, function(args) {
      handler(args), e.$off();
    });
  }, _$CompCtr.prototype.$fire = function(event, data) {
    this._events[event] && this._events[event].forEach(function(handler) {
      handler(data);
    });
  }, _$CompCtr.prototype.$notify = function(key) {
    this._subscribers[key] && this._subscribers[key].forEach(function(suscriber) {
      suscriber();
    });
  }, _$CompCtr.prototype.$observe = function(deps, listener) {
    var _this = this, subs = [];
    return Array.isArray(deps) ? deps.forEach(function(dep) {
      subs.push({
        sub: dep,
        i: _subs.call(_this, dep, listener)
      });
    }) : subs.push({
      sub: deps,
      i: _subs.call(this, deps, listener)
    }), {
      $unobserve: function() {
        subs.forEach(function(sub) {
          _this._subscribers[sub.sub].splice(sub.i, 1);
        });
      }
    };
  }, _$CompCtr.prototype.$watch = function(key, watcher) {
    var _this = this;
    this._watchers[key] || (this._watchers[key] = []);
    var i = this._watchers[key].push(watcher.bind(this));
    return {
      $unwatch: function() {
        _this._watchers[key].splice(i - 1, 1);
      }
    };
  }, _$List.prototype = Object.create(Array.prototype), _$List.prototype.constructor = _$List, 
  Child.prototype = Object.create(_$CompCtr.prototype), Child.prototype.constructor = Child, 
  Child;
}();