!function (global, factory) {
		typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
		typeof define === 'function' && define.amd ? define('loop', factory) :
		(global.Loop = factory());
	}(this, function () {
		'use strict';
var PROP_MAP = {
  p: '__TP__',
  v: 'value',
  _: '_value',
  s: '_subscribers',
  e: '_events',
  w: '_watchers',
  h: 'prototype'
};
var PROPS = ['$slots', '$refs', '$filters', '$directives', '_events', '_watchers'];
var TPS = window[PROP_MAP.p] || (window[PROP_MAP.p] = []);
var _$assign = Object['assign'] || function(t) {
  for (var s = void 0, i = 1, n = arguments.length; i < n; i++) {
    s = arguments[i];
    for (var p in s) if (_$hasProp(s, p))
      t[p] = s[p];
  }
  return t;
};
function _$CompCtr(attrs, template, options, parent) {
  var self = this;
  var _$set = function(prop, value) {
    _$def(self, prop, {
      value: value,
      writable: true
    });
  };
  if (!attrs)
    attrs = {};
  _$e(PROPS, function(prop) {
    _$def(self, prop, {
      value: {}
    });
  });
  _$set('$parent', parent || null);
  _$set('$children', []);
  _$set(PROP_MAP.s, {});
  _$set('$options', options);
  var opts = self.$options;
  if (!opts.attrs)
    opts.attrs = {};
  if (!opts.children)
    opts.children = {};
  _$e(TPS, function(plugin) {
    plugin.fn.call(self, _$CompCtr, plugin.options);
  });
  if (opts.filters)
    _$assign(self.$filters, opts.filters);
  if (opts.directives) _$e(opts.directives, function(drt, k) {
    self.$directives[k] = _$drt(drt);
  });
  _$e(opts.attrs, function(attrOps, key) {
    _$def(self, _$isType(key, 'number') ? attrOps : key, {
      get: function() {
        if (_$isStr(attrOps)) {
          var value = attrs[attrOps];
          return _$isFunction(value) ? value() : value;
        } else {
          if (!_$hasProp(attrs, key) && attrOps.required) {
            return console.error('Attribute \'' + key + '\' is required.');
          } else {
            var value = _$isFunction(attrs[key]) ? attrs[key]() : attrs[key];
            if (value === void 0 && _$hasProp(attrOps, 'default')) {
              var def = attrOps.default;
              value = _$isFunction(def) ? def() : def;
            }
            var typ = attrOps.type;
            if (typ && !_$isType(value, typ) && attrOps.required) {
              return console.error('Attribute \'' + key + '\' must be type \'' + typ + '\'.');
            }
            value = _$toType(value, value === void 0 ? 'undefined' : typ, self, key);
            if (value !== void 0 && _$hasProp(attrOps, 'validator')) {
              var validator = attrOps.validator;
              if (_$isFunction(validator) && !validator(value)) {
                return console.error('Assigment \'' + key + '\'=\'' + JSON.stringify(value) + '\' invalid.');
              }
            }
            return value;
          }
        }
      },

      set: function() {
        console.error('\'' + key + '\' is read only.');
      },

      enumerable: true,
      configurable: true
    });
  });
  var data = opts.model || {};
  var _loop_1 = function(key) {
    if (_$hasProp(data, key)) {
      var desc = Object.getOwnPropertyDescriptor(data, key);
      if (desc.value && _$isArray(desc.value)) {
        desc.value = new _$List(desc.value, self, key);
      } else {
        if (desc.get) {
          var getter_1 = desc.get;
          desc.get = function() {
            var value = getter_1.call(self);
            if (_$isArray(value))
              value = new _$List(value, self, key);
            return value;
          };
        }
        if (desc.set) {
          var setter_1 = desc.set;
          desc.set = function(v) {
            if (_$isArray(v))
              v = new _$List(v, self, key);
            setter_1.call(self, v);
          };
        }
      }
      _$def(self, key, desc);
    }
  };
  for (var key in data) {
    _loop_1(key);
  }
  var tpl = template(self, opts.children);
  _$e(tpl, function(value, key) {
    _$def(self, key, {
      value: function(key) {
        var hook = key[1].toUpperCase() + key.slice(2);
        var bhook = opts['before' + hook];
        var ahook = opts['after' + hook];
        return function() {
          bhook && bhook.call(this);
          key.slice(1) === 'update' ? value.call(this, this) : value.apply(this, arguments);
          ahook && ahook.call(this);
        };
      }(key)
    });
  });
  _$def(self, '$data', {
    get: function() {
      return _$toPlainObj(this);
    }
  });
}
function _$isValueAttr(attr) {
  return attr === 'value';
}
function _$subs(dep, listener) {
  if (!this[PROP_MAP.s][dep]) {
    this[PROP_MAP.s][dep] = [];
  }
  return this[PROP_MAP.s][dep].push(listener.bind(this)) - 1;
}
function _$def(obj, key, desc) {
  Object.defineProperty(obj, key, desc);
}
_$assign(_$CompCtr[PROP_MAP.h], {
  $get: function(path) {
    return _$accesor(this, path);
  },

  $set: function(path, value) {
    _$accesor(this, path, value);
  },

  $on: function(event, handler) {
    var _this = this;
    if (!this[PROP_MAP.e][event]) {
      this[PROP_MAP.e][event] = [];
    }
    var i = this[PROP_MAP.e][event].push(handler);
    return {
      $off: function() {
        _this[PROP_MAP.e][event].splice(i - 1, 1);
      }
    };
  },

  $once: function(event, handler) {
    var e = this.$on(event, function(args) {
      handler(args);
      e.$off();
    });
  },

  $fire: function(event, data) {
    if (this[PROP_MAP.e][event]) {
      _$e(this[PROP_MAP.e][event], function(handler) {
        handler(data);
      });
    }
  },

  $notify: function(key) {
    if (this[PROP_MAP.s][key]) {
      _$e(this[PROP_MAP.s][key], function(suscriber) {
        suscriber();
      });
    }
  },

  $observe: function(deps, listener) {
    var _this = this;
    var subs = [];
    if (_$isArray(deps)) {
      _$e(deps, function(dep) {
        subs.push({
          sub: dep,
          i: _$subs.call(_this, dep, listener)
        });
      });
    } else {
      subs.push({
        sub: deps,
        i: _$subs.call(this, deps, listener)
      });
    }
    return {
      $unobserve: function() {
        _$e(subs, function(sub) {
          _this[PROP_MAP.s][sub.sub].splice(sub.i, 1);
        });
      }
    };
  },

  $watch: function(key, watcher) {
    var _this = this;
    if (!this[PROP_MAP.w][key]) {
      this[PROP_MAP.w][key] = [];
    }
    var i = this[PROP_MAP.w][key].push(watcher.bind(this));
    return {
      $unwatch: function() {
        _this[PROP_MAP.w][key].splice(i - 1, 1);
      }
    };
  }
});
var array = Array[PROP_MAP.h];
function _$toArgs(args, start) {
  if (start === void 0) {
    start = 0;
  }
  return array.slice.call(args, start);
}
function _$arrayValues(list, value, root, key) {
  array.push.apply(list, value.map(function(v, i) {
    if (list.length !== 0)
      i += list.length;
    return !_$isType(v, _$List) && _$isArray(v) ? new _$List(v, root, key + '.' + i) : v;
  }));
}
function _$List(value, root, key) {
  var self = this;
  Array.apply(self, [value.length]);
  var desc = {
    writable: false,
    configurable: false,
    enumerable: false
  };
  _$def(self, '_key', _$assign({
    value: key
  }, desc));
  _$def(self, '_root', _$assign({
    value: root
  }, desc));
  _$arrayValues(self, value, root, key);
  desc.writable = true;
  _$def(self, 'length', _$assign({
    value: self.length
  }, desc));
}
_$extends(_$List, Array);
['pop', 'push', 'reverse', 'shift', 'sort', 'fill', 'unshift', 'splice'].forEach(function(method) {
  _$List[PROP_MAP.h][method] = function() {
    var self = this;
    var old = self.slice();
    var result;
    if (method === 'push') {
      _$arrayValues(self, _$toArgs(arguments), self._root, self._key);
      result = self.length;
    } else {
      result = array[method].apply(self, arguments);
    }
    _$dispatch(self._root, self._key, old, self.slice());
    return result;
  };
});
_$List[PROP_MAP.h].pull = function(index) {
  var self = this;
  var items = _$toArgs(arguments, 1);
  var length = self.length;
  if (index > length) {
    length = index + 1;
    var pull = new Array(index - self.length);
    pull.push.apply(pull, items);
    for (var i = 0; i < length; i++) {
      if (i === index) {
        self.push.apply(self, pull);
      }
    }
  } else {
    self.splice.apply(self, [index, 1].concat(items));
  }
};
function _$dispatch(root, key, oldVal, value) {
  root.$notify(key);
  if (root[PROP_MAP.w][key]) {
    _$e(root[PROP_MAP.w][key], function(watcher) {
      watcher(oldVal, value);
    });
  }
  root.$update();
}
function _$extends(ctor, exts) {
  ctor['plugin'] = function(fn, options) {
    TPS.push({
      options: options,
      fn: fn
    });
  };
  ctor[PROP_MAP.h] = Object.create(exts[PROP_MAP.h]);
  ctor[PROP_MAP.h].constructor = ctor;
}
function _$isType(value, type) {
  return _$type(type) === 'string' ? type.split('|').some(function(t) {
    return t.trim() === _$type(value);
  }) : value instanceof type;
}
function _$isObject(obj) {
  return _$isType(obj, 'object');
}
function _$isArray(obj) {
  return Array.isArray ? Array.isArray(obj) : _$isType(obj, 'array');
}
function _$isFunction(obj) {
  return _$isType(obj, 'function');
}
function _$isStr(obj) {
  return _$isType(obj, 'string');
}
function _$toType(value, type, root, key) {
  switch (type) {
  case 'date':
    return new Date(value);
  case 'string':
    return _$toStr(value);
  case 'number':
    return +value;
  case 'boolean':
    return _$isStr(value) && !value ? true : !!value;
  case 'array':
    return _$isType(value, _$List) ? value : new _$List(value, root, key);
  default:
    return value;
  }
}
function _$type(obj) {
  return / (\w+)/.exec({}.toString.call(obj))[1].toLowerCase();
}
function _$hasProp(obj, prop) {
  return obj.hasOwnProperty(prop);
}
function _$drt(dd) {
  var hasProp = function(prop, instance, options, element) {
    return _$isObject(dd) && dd[prop] && dd[prop](instance, options, element);
  };
  return {
    $init: function(instance, options, element) {
      hasProp('$init', instance, options, element);
    },

    $inserted: function(instance, options, element) {
      hasProp('$inserted', instance, options, element);
    },

    $update: function(instance, options, element) {
      if (_$isFunction(dd)) {
        dd(instance, options, element);
      } else {
        hasProp('$update', instance, options, element);
      }
    },

    $destroy: function(instance, options, element) {
      hasProp('$destroy', instance, options, element);
    }
  };
}
function _$toStr(obj) {
  var str = _$type(obj);
  return !/null|undefined/.test(str) ? obj.toString() : str;
}
function _$toPlainObj(obj) {
  var data = {};
  _$e(_$isObject(obj) ? obj : {}, function(_v, k) {
    if (k[0] !== '$' && !_$isFunction(obj[k])) {
      if (_$isType(obj[k], _$List)) {
        data[k] = obj[k].map(_$toPlainObj);
      } else if (_$isObject(obj[k])) {
        data[k] = _$toPlainObj(obj[k]);
      } else {
        data[k] = obj[k];
      }
    }
  });
  return _$isObject(obj) ? data : obj;
}
function _$accesor(object, path, value) {
  return path.split('.').reduce(function(obj, key, i, arr) {
    if (_$isType(value, 'undefined')) {
      if (obj == null) {
        arr.splice(0, arr.length);
        return i > 0 && obj === null ? obj : undefined;
      }
    } else {
      if (i === arr.length - 1) {
        if (_$isType(obj, _$List) && _$toStr(+key) === key) {
          obj.pull(+key, value);
        } else {
          var oldVal = obj[key];
          obj[key] = !_$isType(value, _$List) && _$isArray(value) ? new _$List(value, object, key) : value;
          _$dispatch(object, path, oldVal, obj[key]);
        }
      } else if (!_$isObject(obj[key])) {
        obj[key] = {};
      }
    }
    return obj ? obj[key] : null;
  }, object);
}
function _$(selector, parent) {
  return _$isStr(selector) ? (parent || document).querySelector(selector) : selector;
}
function _$d() {
  return document.createDocumentFragment();
}
function _$a(parent, child, sibling) {
  if (_$isType(sibling, 'boolean') && sibling)
    parent.parentElement.replaceChild(child, parent);
  else if (!sibling)
    parent.appendChild(child);
  else
    parent.insertBefore(child, sibling);
}
function _$ce(tagName) {
  return document.createElement(tagName || 'div');
}
function _$ct(content) {
  return document.createTextNode(content || '');
}
function _$sa(el, attrOrBind) {
  var attr = attrOrBind[0], value = attrOrBind[1];
  el.setAttribute(attr, _$toStr(value));
  if (_$isValueAttr(attr) && !_$isStr(value))
    el[PROP_MAP._] = value;
}
function _$tu(text, value) {
  if (text.data !== (value = _$toStr(value)))
    text.data = value;
}
function _$f(root, obj, loop) {
  var items = {}, loopParent, loopSibling;
  var globs = _$toArgs(arguments, 3);
  _$e(obj, function(item, i) {
    items[i] = loop.apply(null, [root, item, i].concat(globs));
  });
  return {
    $create: function() {
      _$e(items, function(item) {
        item.$create();
      });
    },

    $mount: function(parent, sibling) {
      loopParent = _$(parent);
      loopSibling = _$(sibling);
      _$e(items, function(item) {
        item.$mount(loopParent, loopSibling);
      });
    },

    $update: function(root, obj) {
      var globs = _$toArgs(arguments, 2);
      _$e(items, function(item, i) {
        if (obj[i]) {
          item.$update.apply(item, [root, obj[i], i].concat(globs));
        } else {
          item.$destroy();
          delete items[i];
        }
      });
      _$e(obj, function(item, i) {
        if (!items[i]) {
          items[i] = loop.apply(null, [root, item, i].concat(globs));
          items[i].$create();
          items[i].$mount(loopParent, loopSibling);
        }
      });
    },

    $destroy: function() {
      _$e(items, function(item) {
        item.$destroy();
      });
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
function itemLoop_1(_$state, item) {
  var _$frag, li_1, txt_1, setTxt_1;
  _$frag = _$d();
  setTxt_1 = function(_$state, item) {
    return item;
  };
  return {
    $create: function() {
      li_1 = _$ce('li');
      txt_1 = _$ct();
      txt_1.data = setTxt_1(_$state, item);
    },

    $mount: function(parent, sibling) {
      this.$unmount();
      _$a(_$(parent), _$frag, _$(sibling));
    },

    $update: function(_$state, item) {
      _$tu(txt_1, setTxt_1(_$state, item));
    },

    $unmount: function() {
      _$a(li_1, txt_1);
      _$a(_$frag, li_1);
    },

    $destroy: function() {
      this.$unmount();
      _$frag = li_1 = txt_1 = setTxt_1 = void 0;
    }
  };
}
function itemLoop_2(_$state, item) {
  var _$frag, li_1, txt_1, setTxt_1;
  _$frag = _$d();
  setTxt_1 = function(_$state, item) {
    return item;
  };
  return {
    $create: function() {
      li_1 = _$ce('li');
      txt_1 = _$ct();
      txt_1.data = setTxt_1(_$state, item);
    },

    $mount: function(parent, sibling) {
      this.$unmount();
      _$a(_$(parent), _$frag, _$(sibling));
    },

    $update: function(_$state, item) {
      _$tu(txt_1, setTxt_1(_$state, item));
    },

    $unmount: function() {
      _$a(li_1, txt_1);
      _$a(_$frag, li_1);
    },

    $destroy: function() {
      this.$unmount();
      _$frag = li_1 = txt_1 = setTxt_1 = void 0;
    }
  };
}
function itemLoop_3(_$state, item) {
  var _$frag, li_1, txt_1, setTxt_1;
  _$frag = _$d();
  setTxt_1 = function(_$state, item) {
    return item;
  };
  return {
    $create: function() {
      li_1 = _$ce('li');
      txt_1 = _$ct();
      txt_1.data = setTxt_1(_$state, item);
    },

    $mount: function(parent, sibling) {
      this.$unmount();
      _$a(_$(parent), _$frag, _$(sibling));
    },

    $update: function(_$state, item) {
      _$tu(txt_1, setTxt_1(_$state, item));
    },

    $unmount: function() {
      _$a(li_1, txt_1);
      _$a(_$frag, li_1);
    },

    $destroy: function() {
      this.$unmount();
      _$frag = li_1 = txt_1 = setTxt_1 = void 0;
    }
  };
}
function itemLoop_4(_$state, item) {
  var _$frag, li_1, txt_1, setTxt_1;
  _$frag = _$d();
  setTxt_1 = function(_$state, item) {
    return item;
  };
  return {
    $create: function() {
      li_1 = _$ce('li');
      txt_1 = _$ct();
      txt_1.data = setTxt_1(_$state, item);
    },

    $mount: function(parent, sibling) {
      this.$unmount();
      _$a(_$(parent), _$frag, _$(sibling));
    },

    $update: function(_$state, item) {
      _$tu(txt_1, setTxt_1(_$state, item));
    },

    $unmount: function() {
      _$a(li_1, txt_1);
      _$a(_$frag, li_1);
    },

    $destroy: function() {
      this.$unmount();
      _$frag = li_1 = txt_1 = setTxt_1 = void 0;
    }
  };
}
function itemLoop_5(_$state, item) {
  var _$frag, li_1, txt_1, setTxt_1;
  _$frag = _$d();
  setTxt_1 = function(_$state, item) {
    return item;
  };
  return {
    $create: function() {
      li_1 = _$ce('li');
      txt_1 = _$ct();
      txt_1.data = setTxt_1(_$state, item);
    },

    $mount: function(parent, sibling) {
      this.$unmount();
      _$a(_$(parent), _$frag, _$(sibling));
    },

    $update: function(_$state, item) {
      _$tu(txt_1, setTxt_1(_$state, item));
    },

    $unmount: function() {
      _$a(li_1, txt_1);
      _$a(_$frag, li_1);
    },

    $destroy: function() {
      this.$unmount();
      _$frag = li_1 = txt_1 = setTxt_1 = void 0;
    }
  };
}
function _$tplLoop(_$state) {
  var _$frag, ul_1, loopAnchor_1_1, loopBlock_1, ul_2, loopAnchor_2_1, loopBlock_2, ul_3, loopAnchor_3_1, loopBlock_3, ul_4, loopAnchor_4_1, loopBlock_4, ul_5, loopAnchor_5_1, loopBlock_5;
  _$frag = _$d();
  loopBlock_1 = _$f(_$state, _$state.items, itemLoop_1);
  loopAnchor_1_1 = _$ct();
  loopBlock_2 = _$f(_$state, _$state.object, itemLoop_2);
  loopAnchor_2_1 = _$ct();
  loopBlock_3 = _$f(_$state, [1, 2, 3, 4, 5], itemLoop_3);
  loopAnchor_3_1 = _$ct();
  loopBlock_4 = _$f(_$state, [0, 1, 2, 3, 4], itemLoop_4);
  loopAnchor_4_1 = _$ct();
  loopBlock_5 = _$f(_$state, [0, 1, 2, 3, 4], itemLoop_5);
  loopAnchor_5_1 = _$ct();
  return {
    $create: function() {
      ul_1 = _$ce('ul');
      loopBlock_1.$create();
      ul_2 = _$ce('ul');
      loopBlock_2.$create();
      ul_3 = _$ce('ul');
      loopBlock_3.$create();
      ul_4 = _$ce('ul');
      loopBlock_4.$create();
      ul_5 = _$ce('ul');
      loopBlock_5.$create();
      _$sa(ul_1, ['id', 'loop_1']);
      _$sa(ul_2, ['id', 'loop_2']);
      _$sa(ul_3, ['id', 'loop_3']);
      _$sa(ul_4, ['id', 'loop_4']);
      _$sa(ul_5, ['id', 'loop_5']);
    },

    $mount: function(parent, sibling) {
      this.$unmount();
      _$a(_$(parent), _$frag, _$(sibling));
      this.$siblingEl = _$(sibling);
      this.$parentEl = sibling && _$(sibling).parentElement || _$(parent);
    },

    $update: function(_$state) {
      loopBlock_1.$update(_$state, _$state.items);
      loopBlock_2.$update(_$state, _$state.object);
      loopBlock_3.$update(_$state, [1, 2, 3, 4, 5]);
      loopBlock_4.$update(_$state, [0, 1, 2, 3, 4]);
      loopBlock_5.$update(_$state, [0, 1, 2, 3, 4]);
    },

    $unmount: function() {
      _$a(ul_1, loopAnchor_1_1);
      loopBlock_1.$mount(ul_1, loopAnchor_1_1);
      _$a(_$frag, ul_1);
      _$a(ul_2, loopAnchor_2_1);
      loopBlock_2.$mount(ul_2, loopAnchor_2_1);
      _$a(_$frag, ul_2);
      _$a(ul_3, loopAnchor_3_1);
      loopBlock_3.$mount(ul_3, loopAnchor_3_1);
      _$a(_$frag, ul_3);
      _$a(ul_4, loopAnchor_4_1);
      loopBlock_4.$mount(ul_4, loopAnchor_4_1);
      _$a(_$frag, ul_4);
      _$a(ul_5, loopAnchor_5_1);
      loopBlock_5.$mount(ul_5, loopAnchor_5_1);
      _$a(_$frag, ul_5);
    },

    $destroy: function() {
      this.$unmount();
      this.$parent = null;
      this.$parentEl = null;
      this.$siblingEl = null;
      this.$children.splice(0, this.$children.length);
      loopBlock_1.$destroy();
      loopBlock_2.$destroy();
      loopBlock_3.$destroy();
      loopBlock_4.$destroy();
      loopBlock_5.$destroy();
      delete _$state.$root;
      _$frag = ul_1 = loopAnchor_1_1 = loopBlock_1 = ul_2 = loopAnchor_2_1 = loopBlock_2 = ul_3 = loopAnchor_3_1 = loopBlock_3 = ul_4 = loopAnchor_4_1 = loopBlock_4 = ul_5 = loopAnchor_5_1 = loopBlock_5 = void 0;
    }
  };
}
function Loop(_$attrs, _$parent) {
  _$CompCtr.call(this, _$attrs, _$tplLoop, {
    model: {
      items: [1, 2, 3, 4, 5],

      object: {
        a: 'a',
        b: 'b',
        c: 'c',
        d: 'd',
        e: 'e'
      }
    }
  }, _$parent);
  !_$parent && this.$create();
}
_$extends(Loop, _$CompCtr);
return Loop;

	});