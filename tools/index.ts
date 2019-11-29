type ObjectMap<T> = Record<string, T>;
type AttrTypes = string | number | RegExp | null | boolean;
type PluginFn = (this: Component, ctor: typeof Component, pluginOptions?: ObjectMap<any>) => void;

interface AttrDefinition {
  required?: boolean;
  type: string | Function;
  validator?(value: any): boolean;
  default?: AttrTypes | (() => AttrTypes | Object);
}

interface ComponentOptions {
  children?: ObjectMap<Component>;
  filters?: ObjectMap<(...args: any[]) => any>;
  attributes?: string[] | ObjectMap<AttrDefinition>;
}

declare class BaseComponent {
  $parent: Component;
  $parentEl: HTMLElement;
  $siblingEl: HTMLElement;
  readonly $refs: ObjectMap<HTMLElement | HTMLElement[]>;
  readonly $slots: ObjectMap<DocumentFragment>;
  readonly $filters: ObjectMap<(...args: any[]) => any>;
  readonly $options: ComponentOptions;
  readonly $children: Component[];

  $get<T extends any>(path: string): T;
  $set<T extends any>(path: string, value: T): void;
  $on(event: string, handler: (data?: any) => void): void;
  $off(event: string, handler: (data?: any) => void): void;
  $once(event: string, handler: (data?: any) => void): void;
  $fire(event: string, data?: any): void;
  $notify(key: string): void;
  $observe(key: string | string[], handler: () => void): { $unobserve(): void };
  $watch(key: string, handler: (oldValue?: any, newValue?: any) => void): { $unwatch(): void };
}

declare class TemplateObject extends BaseComponent {
  $create(): void;
  $mount(parent: string | Element, sibling?: string | boolean | Element): void;
  $update(this: Component, ...args: any[]): void;
  $unmount(): void;
  $destroy(): void;
}

declare class Component extends TemplateObject {
  static $children?: ObjectMap<Component>;
  static $filters?: ObjectMap<(...args: any[]) => any>;
  static $attributes?: string[] | ObjectMap<AttrDefinition>;
  static $plugin(fn: PluginFn, options?: ObjectMap<any>): void;

  constructor(attrs?: ObjectMap<any>, parent?: Component);

  willCreate?(this: Component): void;
  willMount?(this: Component): void;
  willUpdate?(this: Component): void;
  willUnmount?(this: Component): void;
  willDestroy?(this: Component): void;

  didCreate?(this: Component): void;
  didMount?(this: Component): void;
  didUpdate?(this: Component): void;
  didUnmount?(this: Component): void;
  didDestroy?(this: Component): void;

  [key: string]: any;
}

function _$extends(d: Function, b: Function) {
  _$assign(d, b);
  function _() { this.constructor = d; }
  d.prototype = b === null ? Object.create(b) : (_.prototype = b.prototype, new _());
}
function _$(selector: string | HTMLElement, parent?: Element): HTMLElement {
  return _$isString(selector) ? (parent || document.body).querySelector(selector) : selector;
}
function _$type(obj: any) {
  return _$lowerCase(Object.prototype.toString.call(obj).slice(8, -1));
}
function _$isType(obj: any, objType: string | Function) {
  return _$isString(objType) ? _$type(obj) === objType : obj instanceof objType;
}
function _$isString(str: any): str is string {
  return _$type(str) === 'string';
}
function _$isArray(array: any): array is Array<any> {
  return _$type(array) === 'array' || array instanceof _$List;
}
function _$isObject(obj: any): obj is Object {
  return _$type(obj) === 'object';
}
function _$isFunction(obj: any): obj is Function {
  return _$type(obj) === 'function';
}
function _$toString(obj: any): string {
  if (_$isString(obj)) {
    return obj;
  }
  var str = _$type(obj);
  return /(^(null|undefined)$)/.test(str) ? str : obj.toString();
}
function _$toType(value: any, type: any, component: Component, key: string) {
  switch (type) {
    case 'date':
      return new Date(value);
    case 'string':
      return _$toString(value);
    case 'number':
      return +value;
    case 'boolean':
      return _$isString(value) && !value ? true : !!value;
    case 'array':
      return _$isType(value, _$List) ? value : new _$List(value, component, key);
    default:
      return value;
  }
}
function _$slice<T>(array: { length: number, [key: number]: T }, from?: number) {
  const args: T[] = [];
  from = from || 0;
  for (let i = from; i < array.length; i++) {
    args[i - from] = array[i];
  }
  return args;
}
function _$hasProp(obj: Object, prop: string) {
  return obj.hasOwnProperty(prop);
}
function _$define(obj: Object, mapDesc: PropertyDescriptorMap) {
  Object.defineProperties(obj, mapDesc);
}
function _$each<T extends any[]>(obj: T, cb: (item: T[number], key: number) => void): void;
function _$each<T extends any>(obj: T, cb: (item: T[string], key: string, index: number) => void): void;
function _$each(obj: Object, cb: (item: any, key: any, index?: number) => void) {
  if (_$isArray(obj)) {
    for (let i = 0; i < obj.length; i++) {
      cb(obj[i], i);
    }
  }
  else if (_$isObject(obj)) {
    const keys = Object.keys(obj);
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      cb(obj[key], key, i);
    }
  }
}
function _$lowerCase(str: string) {
  return str.toLowerCase();
}
function _$camelToSnake(str: string) {
  var result = str.replace(/([A-Z])/g, w => '-' + _$lowerCase(w));
  return result[0] === '-' ? result.slice(1) : result;
}
function _$apply(callee: Function, args: any[], globs?: any, thisArg?: any) {
  if (globs && !_$isArray(globs)) {
    thisArg = globs;
    globs = [];
  } else if (globs === void 0) {
    globs = [];
  } else if (thisArg === void 0) {
    thisArg = null;
  }
  return callee.apply(thisArg, args.concat(globs));
}
function _$removeItem<T>(list: T[], item: T) {
  var index = list.indexOf(item);
  if (~index) {
    list.splice(index, 1);
  }
}
function _$treborPlugins(): { plugin: Function, options: ObjectMap<any> }[] {
  var TREBOR_PK = '__TREBOR_PLUGINS__';
  if (!window[TREBOR_PK]) {
    _$define(window, {
      [TREBOR_PK]: { value: [], configurable: true, writable: true, enumerable: false }
    });
  }
  return window[TREBOR_PK];
}
function _$assign(child: Object, parent: Object) {
  for (const property in parent) {
    if (parent.hasOwnProperty(property)) {
      child[property] = parent[property];
    }
  }
  return child;
}
function _$plainObject(obj: any) {
  const data = {};
  _$each(_$isObject(obj) ? obj : {}, function (value, k) {
    if (k[0] !== '$' && !_$isFunction(value)) {
      if (_$isType(value, _$List)) {
        data[k] = value.map(_$plainObject);
      } else if (_$isObject(value)) {
        data[k] = _$plainObject(value);
      } else {
        data[k] = value;
      }
    }
  });
  return _$isObject(obj) ? data : obj;
}
function _$accesor(component: Component, path: string, value?: any) {
  return path.split('.').reduce((obj: any, key: string, i: number, arr) => {
    if (_$isType(value, 'undefined')) {
      if (obj == null) {
        arr.splice(0, arr.length);
        return i > 0 && obj === null ? obj : undefined;
      }
    } else {
      if (i === arr.length - 1) {
        if (_$isType(obj, _$List) && _$toString(+key) === key) {
          obj.pull(+key, value);
        } else {
          const oldVal = obj[key];
          obj[key] = Array.isArray(value) ? new _$List(value, component, key) : value;
          _$dispatch(component, path, oldVal, obj[key]);
        }
      } else if (!_$isObject(obj[key])) {
        obj[key] = {};
      }
    }
    return obj ? obj[key] : null;
  }, component);
}
function _$dispatch(component: Component, key: string, oldVal: any, value: any) {
  component.$notify(key);
  if (component._watchers[key]) {
    _$each(component._watchers[key], function (watcher) { watcher(oldVal, value); });
  }
  component.$update();
}
function _$subscribers(dep: string, handler: () => void) {
  if (!this._subscribers[dep]) {
    this._subscribers[dep] = [];
  }
  return this._subscribers[dep].push(handler.bind(this)) - 1;
}
const _$Component = (function () {
  function _$Component(attrs: ObjectMap<any>, compCtor: typeof Component, parent: Component) {
    const self = this;
    if (!attrs)
      attrs = {};
    const propMap: ObjectMap<PropertyDescriptor> = {
      $refs: { value: {}, enumerable: false, configurable: true },
      $slots: { value: {}, enumerable: false, configurable: true },
      $parent: { value: parent || null, enumerable: false, configurable: true },
      $children: { value: [], enumerable: false, configurable: true },
      $filters: { value: {}, enumerable: false, configurable: true },
      $options: {
        value: {
          filters: compCtor.$filters || {},
          children: compCtor.$children || {},
          attributes: compCtor.$attributes || {}
        }, enumerable: false, configurable: true
      },
    };
    _$each(compCtor.$attributes || [], (attrOps: string | AttrDefinition, key: string) => {
      key = _$isType(key, 'number') ? <string>attrOps : key;
      propMap[key] = {
        get() {
          if (_$isString(attrOps)) {
            const value = attrs[attrOps];
            return _$isFunction(value) ? value() : value;
          } else {
            if (!_$hasProp(attrs, key) && attrOps.required) {
              return console.error('Attribute \'' + key + '\' is required.');
            } else {
              let value = _$isFunction(attrs[key]) ? attrs[key]() : attrs[key];
              if (value === void 0 && _$hasProp(attrOps, 'default')) {
                const def = attrOps.default;
                value = _$isFunction(def) ? def() : def;
              }
              const typ = attrOps.type;
              if (typ && !_$isType(value, typ) && attrOps.required) {
                return console.error('Attribute \'' + key + '\' must be type \'' + typ + '\'.');
              }
              value = _$toType(value, value === void 0 ? 'undefined' : typ, self, key);
              if (value !== void 0 && _$hasProp(attrOps, 'validator')) {
                const validator = attrOps.validator;
                if (_$isFunction(validator) && !validator(value)) {
                  return console.error('Assigment \'' + key + '\'=\'' + JSON.stringify(value) + '\' invalid.');
                }
              }
              return value;
            }
          }
        },
        set() {
          console.error('\'' + key + '\' is read only.');
        },
        enumerable: true, configurable: true
      };
    });
    const desc = { enumerable: false, configurable: false };
    propMap._events = _$assign({ value: {}, }, desc);
    propMap._watchers = _$assign({ value: {}, }, desc);
    propMap._subscribers = _$assign({ value: {}, }, desc);
    _$define(self, propMap);
    _$assign(self.$filters, compCtor.$filters || {});
  }
  const prototype = _$Component.prototype;
  _$define(prototype, {
    $data: {
      get() {
        return _$plainObject(this);
      },
      enumerable: true,
      configurable: true
    }
  });
  prototype.$get = function (path: string) {
    return _$accesor(this, path);
  };
  prototype.$set = function (path: string, value: any) {
    _$accesor(this, path, value);
  };
  prototype.$on = function (event: string, handler: (data: any) => void) {
    if (!this._events[event]) {
      this._events[event] = [];
    }
    this._events[event].push(handler);
  };
  prototype.$off = function (event: string, handler: (data: any) => void) {
    const index = this._events[event].indexOf(handler);
    !!~index && this._events[event].splice(index, 1);
  };
  prototype.$once = function (event: string, handler: (data: any) => void) {
    const _this = this;
    const _handler = function (args: any) {
      handler(args);
      _this.$off(event, _handler);
    };
    this.$on(event, _handler);
  };
  prototype.$fire = function (event: string, data: any) {
    if (this._events[event]) {
      _$each(this._events[event], function (handler) { handler(data); });
    }
  };
  prototype.$notify = function (key: string) {
    if (this._subscribers[key]) {
      _$each(this._subscribers[key], function (suscriber) { suscriber(); });
    }
  };
  prototype.$observe = function (keyOrKeys: string | string[], handler: () => void) {
    const _this = this;
    const subs: { subscrition: string, index: number }[] = [];
    if (_$isArray(keyOrKeys)) {
      _$each(keyOrKeys, key => {
        subs.push({ subscrition: key, index: _$subscribers.call(_this, key, handler) });
      });
    } else {
      subs.push({
        subscrition: keyOrKeys, index: _$subscribers.call(this, keyOrKeys, handler)
      });
    }
    return {
      $unobserve() {
        _$each(subs, ({ subscrition, index }) => {
          _this._subscribers[subscrition].splice(index, 1);
        });
      }
    };
  };
  prototype.$watch = function (key: string, handler: () => void) {
    const _this = this;
    if (!this._watchers[key]) {
      this._watchers[key] = [];
    }
    const i = this._watchers[key].push(handler.bind(this));
    return {
      $unwatch() {
        _this._watchers[key].splice(i - 1, 1);
      }
    };
  };
  return _$Component;
}());
const _$List = (function (_super) {
  _$extends(List, _super);
  function List(value: any[], component: Component, key: string) {
    _super.call(this, value.length);
    const self = this;
    _$define(self, {
      _key: { value: key, enumerable: false },
      _root: { value: component, enumerable: false }
    });
    _$apply(_super.prototype.push, value.map((val, i) => {
      if (self.length !== 0)
        i += self.length;
      return !_$isType(val, List) && _$isArray(val) ? new List(val, component, key + '.' + i) : val;
    }), [], self);
  }
  List.prototype.pull = function (index: number) {
    const self = this;
    const args = _$slice(arguments, 1);
    let length = self.length;
    if (index > length) {
      length = index + 1;
      const pull = new Array(index - self.length);
      _$apply(pull.push, args, [], pull);
      for (let i = 0; i < length; i++) {
        if (i === index) {
          _$apply(self.push, pull, [], self);
        }
      }
    } else {
      _$apply(self.splice, [index, 1].concat(args), [], self);
    }
  };
  ['pop', 'push', 'reverse', 'shift', 'sort', 'fill', 'unshift', 'splice'].forEach(function (method) {
    List.prototype[method] = function () {
      const self = this;
      const args = _$slice(arguments);
      const old = self.slice();
      let result = void 0;
      if (method === 'push') {
        _$apply([].push, args.map(function (v, i) {
          if (self.length !== 0)
            i += self.length;
          return !(_$isType(v, List)) && _$isArray(v) ? new List(v, self._root, `${self._key}.${i}`) : v;
        }), [], self);
        result = self.length;
      } else {
        result = _$apply(Array.prototype[method], args, [], self);
      }
      _$dispatch(self._root, self._key, old, self.slice());
      return result;
    };
  });
  return List;
}(Array));
function _$createComponent($ComponentClass: Function, templateFn: (ctx: Component) => TemplateObject) {
  function $ComponentCtor(attrs: Record<string, any>, parent: Component) {
    const self: Component = this;
    _$apply(_$Component, [attrs, $ComponentCtor, parent], [], self);
    $ComponentClass.call(self);
    const descriptors = {};
    _$each(self, (_, key) => {
      if (_$hasProp(self, key)) {
        const descriptor = Object.getOwnPropertyDescriptor(self, key);
        if (descriptor.value && _$isArray(descriptor.value)) {
          descriptor.value = new _$List(descriptor.value, self, key);
        } else {
          if (descriptor.get) {
            const getter_1 = descriptor.get;
            descriptor.get = function () {
              let value = getter_1.call(this);
              if (_$isArray(value))
                value = new _$List(value, this, key);
              return value;
            };
          }
          if (descriptor.set) {
            const setter_1 = descriptor.set;
            descriptor.set = function (value) {
              if (_$isArray(value))
                value = new _$List(value, this, key);
              setter_1.call(this, value);
            };
          }
        }
        descriptors[key] = descriptor;
      }
    });
    _$define(self, descriptors);
    const tpl = templateFn(self);
    const tplDesc = {};
    _$each(tpl, (value: (...args: any[]) => void, key) => {
      tplDesc[key] = ((key, value) => {
        const hook = key[1].toUpperCase() + _$slice(key, 2);
        return {
          enumerable: false, configurable: false, writable: false,
          value() {
            const args = _$slice(arguments);
            const ahook = this['did' + hook];
            const bhook = this['will' + hook];
            bhook && bhook.call(this);
            _$apply(value, key === '$update' ? [this, _$slice(args, 1)] : args, this);
            ahook && ahook.call(this);
          }
        };
      })(key, value);
    });
    _$define(self, tplDesc);
    _$each(_$treborPlugins(), ({ plugin, options }) => { plugin.call(self, $ComponentCtor, options); });
    !parent && this.$create();
  }
  const proto = [$ComponentClass.prototype, _$Component.prototype].reduceRight((superProto, proto) => {
    const inheritedProto = Object.create(superProto);
    for (const key in proto) {
      if (proto.hasOwnProperty(key)) {
        const desc = Object.getOwnPropertyDescriptor(proto, key);
        Object.defineProperty(inheritedProto, key, desc);
      }
    }
    _$assign($ComponentCtor, proto.constructor);
    inheritedProto.constructor = proto.constructor;
    return inheritedProto;
  }, Object.prototype);

  $ComponentCtor.prototype = Object.create(proto);
  $ComponentCtor.prototype.constructor = $ComponentCtor;
  $ComponentCtor.$plugin = function (plugin: Function, options: Record<string, any>) {
    _$treborPlugins().push({ options, plugin });
  };
  return $ComponentCtor;
}
function _$setReference(refs: Record<string, HTMLElement | HTMLElement[]>, prop: string, node: HTMLElement) {
  if (!_$hasProp(refs, prop)) {
    const value: HTMLElement[] = [];
    _$define(refs, {
      [prop]: {
        get() { return value.length <= 1 ? value[0] : value; },
        set(val: HTMLElement) { val && !~value.indexOf(val) && value.push(val); },
        enumerable: true, configurable: true
      }
    });
  }
  refs[prop] = node;
}
function _$removeReference(refs: Record<string, HTMLElement[]>, prop: string, node: HTMLElement) {
  const nodes = refs[prop];
  _$isArray(nodes) ? _$removeItem(nodes, node) : (delete refs[prop]);
}
function _$fragTpl(...htmlParts: string[]) {
  const template = document.createElement('template');
  template.innerHTML = htmlParts.join('<!---->');
  const fragment = template.content;
  const nodes = <Node[]>_$slice(fragment.childNodes);
  nodes.unshift(fragment);
  return nodes;
}
function _$prepareFragment(frag: DocumentFragment, els: Node[]) {
  if (!frag.hasChildNodes()) {
    _$each(els, el => frag.append(el));
  }
}
function _$updateTxt(txt: Text, newData: string) {
  if (txt.data !== newData) {
    txt.data = newData;
  }
}
function _$noop() { }
function _$child(el: Node, index?: number) {
  if (index === void 0) { index = 0; }
  var node = el.childNodes[index];
  if (node.nodeType === 3) {
    (<Text>node).data = '';
  }
  return node;
}
function _$append(parent: Node, child: Node, sibling?: Node | boolean) {
  if (sibling === true)
    parent.parentElement.replaceChild(child, parent);
  else if (!sibling)
    parent.appendChild(child);
  else
    parent.insertBefore(child, sibling);
}
function _$attr(el: HTMLElement, attribute?: string, value?: any) {
  if (attribute === void 0) { attribute = 'value'; }
  var isValueAttr = attribute === 'value';
  var _value = isValueAttr ? `_${attribute}` : null;
  if (value === void 0) {
    if (isValueAttr) {
      return _$hasProp(el, _value) ? el[_value] : el[attribute];
    } else {
      return el.getAttribute(attribute);
    }
  } else {
    el.setAttribute(attribute, _$toString(value));
  }
}
function _$eventKeys(event: KeyboardEvent) {
  var keys = _$slice(arguments, 1);
  var i = 0;
  while (i < keys.length) {
    var key = keys[i];
    if (!(_$lowerCase(event.key) === key || !!event[`${key}Key`])) {
      return false;
    }
    i++;
  }
  return true;
}
function _$eventStop(event: Event) {
  event.stopPropagation();
}
function _$eventPrevent(event: Event) {
  event.preventDefault();
}
function _$addEvent(node: Node | Component, event: string, listener: (...args: any[]) => void) {
  if (_$type(node).indexOf('html') === 0) {
    node.addEventListener(event, listener, false);
  }
  else {
    (<Component>node).$on(event, listener);
  }
}
function _$removeEvent(node: Node | Component, event: string, listener: (...args: any[]) => void) {
  if (_$type(node).indexOf('html') === 0) {
    node.removeEventListener(event, listener, false);
  } else {
    (<Component>node).$off(event, listener);
  }
}
function _$initSlot(slots: Record<string, DocumentFragment>, slotName: string, children: string[]) {
  if (!slots[slotName].hasChildNodes()) {
    slots[slotName] = _$apply(_$fragTpl, children)[0];
  }
}
function _$declareSlots(slots: Record<string, DocumentFragment>, slotsList: string[]) {
  _$each(slotsList, slotName => {
    slots[slotName] = _$apply(_$fragTpl, [])[0];
  });
}
function _$appendSlots(slots: Record<string, DocumentFragment>, parent: Node) {
  _$each(slots, slot => {
    _$append(parent, slot);
  });
}
function _$emptySlot(component: Component, slot: string) {
  var slots = component.$slots;
  return slots[slot] && !slots[slot].hasChildNodes() ? (slots[slot] = _$apply(_$fragTpl, [])[0]) : null;
}
function _$setSlotContent(slot: DocumentFragment, content: string[]) {
  slot && _$append(slot, _$apply(_$fragTpl, content)[0]);
}
function _$setElements(component: Component, parent: HTMLElement, sibling: boolean | HTMLElement) {
  var brother = _$(<HTMLElement>sibling);
  if (brother && _$type(brother) !== 'boolean') {
    component.$siblingEl = brother;
    component.$parentEl = brother.parentElement;
  }
  else {
    component.$parentEl = _$(parent);
  }
}
function _$getComponent(parent: Component, tag: string, globName: string) {
  return !tag && !globName ? parent.constructor : parent.$options.children[tag] || window[globName];
}
function _$callHook(component: Component, hook: string) {
  const args = _$slice(arguments, 2);
  component && _$apply(component[hook], args, component);
}
function _$addChild(component: Component, Child: typeof Component, attrs: Record<string, any>) {
  let child = null;
  if (Child) {
    child = new Child(attrs, component);
    component.$children.push(child);
  }
  return child;
}
function _$componentUpdate(parent: Component, inst: Component, ctor: typeof Component, value: typeof Component, attrs: Record<string, any>, el: HTMLElement, sibling: boolean | HTMLElement) {
  if (value === ctor) {
    inst && inst.$update();
  }
  else {
    ctor = value;
    if (inst) {
      inst.$destroy();
      _$removeItem(parent.$children, inst);
      inst = _$addChild(parent, ctor, attrs);
      inst.$create();
      inst.$mount(el || parent.$parentEl, sibling);
    }
  }
  return [inst, ctor];
}
function _$destroyComponent(component: Component) {
  component.$unmount();
  component.$parent = null;
  component.$parentEl = null;
  component.$siblingEl = null;
  component.$children.splice(0);
}
function _$bindClass(classes: string, classValue: string | string[] | Record<string, boolean>) {
  function parseClasses(classes: string, classValue: string | string[] | Record<string, boolean>) {
    let classList = classes.split(' ');
    if (_$isString(classValue)) {
      classList = classList.concat(classValue.split(' '));
    }
    else if (_$isArray(classValue)) {
      classValue.forEach(c => {
        classList = classList.concat(parseClasses('', c));
      });
    }
    else if (_$isObject(classValue)) {
      _$each(classValue, (value, prop) => {
        value && classList.push(prop);
      });
    }
    return classList.filter((c, i) => classList.indexOf(c) === i);
  }
  return parseClasses(classes, classValue).join(' ');
}
function _$bindStyle(style: string, styles: string | Record<string, string>) {
  if (_$isObject(styles)) {
    _$each(styles, (value, prop) => {
      style += `;${_$camelToSnake(prop)}:${value}`;
    });
    return style;
  } else if (_$isString(styles)) {
    return `${style};${styles}`;
  }
  return style;
}
function _$bindBooleanAttr(node: HTMLElement, attr: string, value: boolean) {
  if (value == null || value === false) {
    node.removeAttribute(attr);
    node[attr] = false;
  } else {
    _$attr(node, attr, '');
    node[attr] = true;
  }
}
function _$bindUpdate(node: HTMLElement, attr: any, value?: any) {
  if (value === void 0) {
    value = attr;
    attr = 'value';
  }
  var _value = _$toString(value);
  if (attr === 'value') {
    if (node[attr] !== _value) {
      node[attr] = _value;
      node[`_${attr}`] = value;
    }
  } else if (_$attr(node, attr) !== _value) {
    _$attr(node, attr, _value);
  }
}
function _$bindMultiSelect(select: HTMLSelectElement, selections) {
  if (!selections.length) {
    return;
  }
  const options = select.options;
  _$each(options, (option: HTMLOptionElement) => {
    option.selected = !!~selections.indexOf(_$attr(option));
  });
}
function _$filters(component: Component, value) {
  const filterArgs = _$slice(arguments, 2);
  _$each(filterArgs, (args: any[]) => {
    const filter = args.splice(0, 1, value)[0];
    value = _$apply(component.$filters[filter], args, component);
  });
  return value;
}
function _$context(ctx: Component, cb: (args?: any[]) => any) {
  const props = _$slice(arguments, 2);
  const args = props.map(prop => {
    const value = prop in ctx ? ctx[prop] : window[prop];
    return _$isFunction(value) ? value.bind(ctx) : value;
  });
  return args.length ? cb(args) : cb();
}
function _$insertStyle(id: string, css: string) {
  let isNew = false;
  let style = _$('#' + id, document.head);
  if (!style) {
    isNew = true;
    style = document.createElement('style');
    style.id = id;
    _$attr(style, 'refs', 1);
  }
  if (style.textContent !== css) {
    style.textContent = css;
  }
  if (isNew) {
    _$append(document.head, style);
  } else {
    let count = +_$attr(style, 'refs');
    _$attr(style, 'refs', ++count);
  }
}
function _$removeStyle(id: string) {
  const style = _$('#' + id, document.head);
  if (style) {
    let count = +_$attr(style, 'refs');
    if (--count === 0) {
      document.head.removeChild(style);
    } else {
      _$attr(style, 'refs', count);
    }
  }
}

export {
  _$, _$attr, _$declareSlots, _$initSlot, _$bindBooleanAttr, _$bindMultiSelect, _$appendSlots, _$emptySlot,
  _$addEvent, _$removeEvent, _$noop, _$eventStop, _$eventPrevent, _$child, _$append, _$updateTxt, _$bindClass,
  _$bindStyle, _$eventKeys, _$fragTpl, _$setReference, _$removeReference, _$filters, _$type, _$each, _$apply,
  _$bindUpdate, _$getComponent, _$addChild, _$componentUpdate, _$destroyComponent, _$setElements, _$callHook,
  _$prepareFragment, _$context, _$createComponent, _$insertStyle, _$removeStyle, _$setSlotContent, _$slice, _$toString
};
