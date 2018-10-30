type AttrTypes = string | number | RegExp | null | boolean;
type AttrParams = string[] | ObjectLike<AttrDefinition>;
type DirectiveDefinition = (inst: Component, options: DirectiveOptions, node: HTMLElement) => void | DirectiveDefObject;
type TemplateFn = (component: Component) => ComponentTemplate;
type IterateKey<T> = T extends any[] ? number : string;
type IterateValue<T> = T extends any[] ? T[number] : T[keyof T];
type PluginFn = (this: Component, ctor: ComponentConstructor, pluginOptions?: ObjectLike<any>) => void;
interface ObjectLike<T> { [key: string]: T; }

interface DirectiveDefObject {
  $init?(inst: Component, options: DirectiveOptions, node: HTMLElement): void;
  $inserted?(inst: Component, options: DirectiveOptions, node: HTMLElement): void;
  $update(inst: Component, options: DirectiveOptions, node: HTMLElement): void;
  $destroy?(inst: Component, options: DirectiveOptions, node: HTMLElement): void;
}

interface AttrDefinition {
  required?: boolean;
  type: string | Function;
  validator?(value: any): boolean;
  default?: AttrTypes | (() => AttrTypes | Object);
}

interface DirectiveOptions {
  value: any;
  expression: string;
  modifiers: ObjectLike<boolean>;
}

interface ComponentOptions {
  model: ObjectLike<any>;
  attrs: string[] | ObjectLike<AttrDefinition>;
  filters: ObjectLike<(...args: any[]) => any>;
  children: ObjectLike<ComponentConstructor>;
  directives: ObjectLike<DirectiveDefinition>;
}

interface ComponentTemplate {
  $create(): void;
  $mount(parent: string | Element, sibling?: string | boolean | Element): void;
  $update(state: Component, ...args: any[]): void;
  $unmount(): void;
  $destroy(): void;
}

interface Component extends ComponentTemplate {
  $parent: Component;
  $parentEl: HTMLElement;
  $siblingEl: HTMLElement;
  readonly $refs: ObjectLike<HTMLElement[]>;
  readonly $slots: ObjectLike<DocumentFragment>;
  readonly $filters: ObjectLike<(...args: any[]) => any>;
  readonly $options: ComponentOptions;
  readonly $children: Component[];
  readonly $directives: ObjectLike<DirectiveDefinition>;
  $get<T>(path: string): T;
  $set<T>(path: string, value: T): void;
  $update(): void;
  $on(event: string, handler: (data?: any) => void): { $off(): void };
  $once(event: string, handler: (data?: any) => void): void;
  $fire(event: string, data?: any): void;
  $notify(key: string): void;
  $observe(key: string | string[], handler: () => void): { $unobserve(): void };
  $watch(key: string, handler: (oldValue?: any, newValue?: any) => void): { $unwatch(): void };
  [key: string]: any;
}

interface ComponentConstructor {
  new <T extends Component>(attrs?: string[] | ObjectLike<AttrDefinition>, parent?: Component): T;
  plugin(fn: PluginFn, options?: ObjectLike<any>): void;
  prototype: Component;
}

const PROP_MAP = { p: '__TP__', v: 'value', _: '_value', s: '_subscribers', e: '_events', w: '_watchers', h: 'prototype' };
const PROPS = ['$slots', '$refs', '$filters', '$directives', '_events', '_watchers'];
let TPS: { options: ObjectLike<any>, fn: PluginFn }[] = window[PROP_MAP.p] || (window[PROP_MAP.p] = []);
const _$assign = Object['assign'] || function (t: Object) {
  for (let s, i = 1, n = arguments.length; i < n; i++) {
    s = arguments[i];
    for (const p in s) if (_$hasProp(s, p)) t[p] = s[p];
  }
  return t;
};
function _$BaseComponent(attrs: AttrParams, template: TemplateFn, options: ComponentOptions, parent: Component) {
  const self = this;
  const _$set = (prop: string, value: any) => { _$define(self, prop, { value, writable: true }); };
  if (!attrs) attrs = {};
  _$each(PROPS, prop => { _$define(self, prop, { value: {} }); });
  _$set('$parent', parent || null);
  _$set('$children', []);
  _$set(PROP_MAP.s, {});
  _$set('$options', options);
  const opts: ComponentOptions = self.$options;
  if (!opts.attrs) opts.attrs = {};
  if (!opts.children) opts.children = {};
  _$each(TPS, (plugin) => { plugin.fn.call(self, _$BaseComponent, plugin.options); });
  if (opts.filters) _$assign(self.$filters, opts.filters);
  if (opts.directives) _$each(opts.directives, (drt, k) => { self.$directives[k] = _$directive(drt); });
  _$each(opts.attrs, (attrOps, key) => {
    _$define(self, <string>(_$isType(key, 'number') ? attrOps : key), {
      get() {
        if (_$isString(attrOps)) {
          let value = attrs[<string>attrOps];
          return _$isFunction(value) ? value() : value;
        } else {
          if (!_$hasProp(attrs, <string>key) && (<AttrDefinition>attrOps).required) {
            return console.error(`Attribute '${key}' is required.`);
          } else {
            let value = _$isFunction(attrs[key]) ? attrs[key]() : attrs[key];
            if (value === void 0 && _$hasProp(attrOps, 'default')) {
              const def = (<AttrDefinition>attrOps).default;
              value = _$isFunction(def) ? (<Function>def)() : def;
            }
            const typ = (<AttrDefinition>attrOps).type;
            if (typ && !_$isType(value, typ) && (<AttrDefinition>attrOps).required) {
              return console.error(`Attribute '${key}' must be type '${typ}'.`);
            }
            value = _$toType(value, value === void 0 ? 'undefined' : typ, self, <string>key);
            if (value !== void 0 && _$hasProp(attrOps, 'validator')) {
              const validator = (<AttrDefinition>attrOps).validator;
              if (_$isFunction(validator) && !validator(value)) {
                return console.error(`Assigment '${key}'='${JSON.stringify(value)}' invalid.`);
              }
            }
            return value;
          }
        }
      },
      set() {
        console.error(`'${key}' is read only.`);
      },
      enumerable: true, configurable: true
    });
  });
  let data = opts.model || {};
  for (const key in data) {
    if (_$hasProp(data, key)) {
      const desc = Object.getOwnPropertyDescriptor(data, key);
      if (desc.value && _$isArray(desc.value)) {
        desc.value = new _$List(desc.value, self, key);
      } else {
        if (desc.get) {
          let getter = desc.get;
          desc.get = function () {
            let value = getter.call(self);
            if (_$isArray(value)) value = new _$List(value, self, key);
            return value;
          };
        }
        if (desc.set) {
          let setter = desc.set;
          desc.set = function (v: any) {
            if (_$isArray(v)) v = new _$List(v, self, key);
            setter.call(self, v);
          };
        }
      }
      _$define(self, key, desc);
    }
  }
  const tpl = template(self);
  _$each(tpl, (value, key) => {
    _$define(self, key, {
      value: (function (key) {
        const hook = key[1].toUpperCase() + key.slice(2);
        const bhook = opts[`will${hook}`];
        const ahook = opts[`did${hook}`];
        return function () {
          bhook && bhook.call(this);
          key.slice(1) === 'update' ? value.call(this, this) : value.apply(this, arguments);
          ahook && ahook.call(this);
        };
      })(<string>key)
    });
  });
  _$define(self, '$data', {
    get() {
      return _$toPlainObj(this);
    }
  });
}
function _$isValueAttr(attr: string) {
  return attr === 'value';
}
function _$subscribers(dep: string, listener: Function) {
  if (!this[PROP_MAP.s][dep]) {
    this[PROP_MAP.s][dep] = [];
  }
  return this[PROP_MAP.s][dep].push(listener.bind(this)) - 1;
}
function _$define(obj: Object, key: string, desc: PropertyDescriptor) {
  Object.defineProperty(obj, key, desc);
}
_$assign(_$BaseComponent[PROP_MAP.h], {
  $get(path: string) {
    return _$accesor(this, path);
  },
  $set(path: string, value: any) {
    _$accesor(this, path, value);
  },
  $on(event: string, handler: Function) {
    if (!this[PROP_MAP.e][event]) {
      this[PROP_MAP.e][event] = [];
    }
    const i = this[PROP_MAP.e][event].push(handler);
    return {
      $off: () => {
        this[PROP_MAP.e][event].splice(i - 1, 1);
      }
    };
  },
  $once(event: string, handler: Function) {
    const e = this.$on(event, args => {
      handler(args);
      e.$off();
    });
  },
  $fire(event: string, data: any) {
    if (this[PROP_MAP.e][event]) {
      _$each(this[PROP_MAP.e][event], handler => { handler(data); });
    }
  },
  $notify(key: string) {
    if (this[PROP_MAP.s][key]) {
      _$each(this[PROP_MAP.s][key], suscriber => { suscriber(); });
    }
  },
  $observe(deps: string | string[], listener: Function) {
    const subs: { sub: string, i: number }[] = [];
    if (_$isArray(deps)) {
      _$each(<string[]>deps, dep => {
        subs.push({ sub: dep, i: _$subscribers.call(this, dep, listener) });
      });
    } else {
      subs.push({ sub: <string>deps, i: _$subscribers.call(this, deps, listener) });
    }
    return {
      $unobserve: () => {
        _$each(subs, sub => {
          this[PROP_MAP.s][sub.sub].splice(sub.i, 1);
        });
      }
    };
  },
  $watch(key: string, watcher: Function) {
    if (!this[PROP_MAP.w][key]) {
      this[PROP_MAP.w][key] = [];
    }
    const i = this[PROP_MAP.w][key].push(watcher.bind(this));
    return {
      $unwatch: () => {
        this[PROP_MAP.w][key].splice(i - 1, 1);
      }
    };
  }
});
const array = Array[PROP_MAP.h];
function _$toArgs(args: IArguments, start: number = 0): any[] {
  return array.slice.call(args, start);
}
function _$arrayValues(list, value: any[], root: Component, key: string) {
  array.push.apply(list, value.map((v, i) => {
    if (list.length !== 0) i += list.length;
    return !(_$isType(v, _$List)) && _$isArray(v) ? new _$List(v, root, `${key}.${i}`) : v;
  }));
}
function _$List(value: any[], root: Component, key: string) {
  let self = this;
  Array.apply(self, [value.length]);
  let desc = { writable: false, configurable: false, enumerable: false };
  _$define(self, '_key', _$assign({ value: key }, desc));
  _$define(self, '_root', _$assign({ value: root }, desc));
  _$arrayValues(self, value, root, key);
  desc.writable = true;
  _$define(self, 'length', _$assign({ value: self.length }, desc));
}
_$extends(_$List, Array);
['pop', 'push', 'reverse', 'shift', 'sort', 'fill', 'unshift', 'splice'].forEach(method => {
  _$List[PROP_MAP.h][method] = function () {
    let self = this;
    const old = self.slice();
    let result;
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
_$List[PROP_MAP.h].pull = function (index: number) {
  let self = this;
  let items = _$toArgs(arguments, 1);
  let length = self.length;
  if (index > length) {
    length = index + 1;
    const pull = new Array(index - self.length);
    pull.push.apply(pull, items);
    for (let i = 0; i < length; i++) {
      if (i === index) {
        self.push.apply(self, pull);
      }
    }
  } else {
    self.splice.apply(self, [index, 1].concat(items));
  }
};
function _$dispatch(root: Component, key: string, oldVal, value) {
  root.$notify(key);
  if (root[PROP_MAP.w][key]) {
    _$each(root[PROP_MAP.w][key], watcher => { watcher(oldVal, value); });
  }
  root.$update();
}
function _$extends(ctor: Function, exts: Function) {
  ctor[PROP_MAP.h] = Object.create(exts[PROP_MAP.h]);
  ctor[PROP_MAP.h].constructor = ctor;
}
export function _$Ctor(moduleName: string, tpl: Function, options: Object) {
	const ctor: ComponentConstructor = <any>{
    [moduleName](_$attrs, _$parent) {
      _$BaseComponent.call(this, _$attrs, tpl, options, _$parent);
      !_$parent && this.$create();
    }
	}[moduleName];
	ctor.plugin = (fn: PluginFn, options?: ObjectLike<any>) => {
		TPS.push({ options, fn });
	};
  _$extends(ctor, _$BaseComponent);
  return ctor;
}
export function _$isType(value: any, type: string | Function) {
  return _$type(type) === 'string' ? (<string>type).split('|').some(t => t.trim() === _$type(value)) : value instanceof <Function>type;
}
export function _$destroyComponent(component: Component) {
  component.$unmount();
  component.$parent = null;
  component.$parentEl = null;
  component.$siblingEl = null;
  component.$children.splice(0, component.$children.length);
}
export function _$setElements(component: Component, parent: HTMLElement, sibling?: HTMLElement) {
  let brother = _$select(sibling);
  component.$siblingEl = brother;
  component.$parentEl = sibling && brother.parentElement || _$select(parent);
}
function _$apply(callee: Function, args: any[], globs: any[], thisArg: any = null) {
  return callee.apply(thisArg, args.concat(globs));
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
function _$isString(obj) {
  return _$isType(obj, 'string');
}
function _$toType(value, type, root: Component, key: string) {
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
      return _$isType(value, _$List) ? value : new _$List(value, root, key);
    default:
      return value;
  }
}
function _$type(obj: any) {
  return / (\w+)/.exec(({}).toString.call(obj))[1].toLowerCase();
}
function _$hasProp(obj: Object, prop: string) {
  return obj.hasOwnProperty(prop);
}
function _$directive(dd: DirectiveDefinition): DirectiveDefObject {
  const hasProp = (prop, instance, options, element) =>
    _$isObject(dd) && dd[prop] && dd[prop](instance, options, element);
  return {
    $init(instance, options, element) {
      hasProp('$init', instance, options, element);
    },
    $inserted(instance, options, element) {
      hasProp('$inserted', instance, options, element);
    },
    $update(instance, options, element) {
      if (_$isFunction(dd)) {
        dd(instance, options, element);
      } else {
        hasProp('$update', instance, options, element);
      }
    },
    $destroy(instance, options, element) {
      hasProp('$destroy', instance, options, element);
    }
  };
}
export function _$noop() { }
export function _$addChild(inst: Component, Child: ComponentConstructor, attrs: string[] | ObjectLike<AttrDefinition>) {
  let child: Component = null;
  if (Child) {
    child = new Child(attrs, inst);
    inst.$children.push(child);
  }
  return child;
}
export function _$removeChild(inst: Component, child: Component) {
  let index = inst.$children.indexOf(child);
  index >= 0 && inst.$children.splice(index, 1);
}
export function _$toString(obj: any): string {
  const str: string = _$type(obj);
  return !/null|undefined/.test(str) ? obj.toString() : str;
}
function _$toPlainObj(obj: Component) {
  const data: ObjectLike<any> = {};
  _$each(_$isObject(obj) ? obj : {}, (_v, k) => {
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
export function _$setReference(refs: Object, prop: string, node: HTMLElement) {
  if (!_$hasProp(refs, prop)) {
    const value = [];
    _$define(refs, prop, {
      get: () => value.length <= 1 ? value[0] : value,
      set: val => { val && !~value.indexOf(val) && value.push(val); },
      enumerable: true, configurable: true
    });
  }
  refs[prop] = node;
}
function _$accesor(object: Component, path: string, value?: any) {
  return path.split('.').reduce((obj, key, i, arr) => {
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
          let oldVal = obj[key];
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
export function _$emptyElse() {
  return { type: 'empty-else', $create: _$noop, $mount: _$noop, $update: _$noop, $destroy: _$noop };
}
export function _$emptySlot(inst: Component, slot: string) {
	let slots = inst.$slots;
	return slots[slot] && !slots[slot].hasChildNodes() ? (slots[slot] = _$docFragment()) : null;
}
export function _$isKey(event: KeyboardEvent, key: string) {
  return event.key.toLowerCase() === key || !!event[`${key}Key`];
}
export function _$bindGroup(input: HTMLInputElement, selection: string[]) {
  let _value = _$getValue(input);
  let _$index = selection.indexOf(_value);
  input.checked && !~_$index ? selection.push(_value) : selection.splice(_$index, 1);
}
export function _$bindMultiSelect(select: HTMLSelectElement, selections: any[]) {
  if (!selections.length) return;
  let { options } = select;
  for (let i = 0; i < options.length; i++) {
    options[i].selected = !!~selections.indexOf(_$getValue(options[i]));
  }
}
export function _$updateMultiSelect(select: HTMLSelectElement, obj: Component, prop: string) {
  let items = [];
  let selection = obj[prop];
  let { selectedOptions } = select;
  for (let i = 0; i < selectedOptions.length; i++) {
    items.push(_$getValue(selectedOptions[i]));
  }
  obj[prop] = new _$List(items, selection['_root'], selection['_key']);
  obj.$update();
}
export function _$select(selector: string | Element, parent?: Element): HTMLElement {
  return _$isString(selector) ? (parent || document).querySelector(<string>selector) : <HTMLElement>selector;
}
export function _$docFragment() {
  return document.createDocumentFragment();
}
export function _$append(parent: Element, child: Element, sibling?: boolean | Element) {
  if (_$isType(sibling, 'boolean') && sibling) parent.parentElement.replaceChild(child, parent);
  else if (!sibling) parent.appendChild(child);
  else parent.insertBefore(child, <Element>sibling);
}
export function _$assignEl(source: Element, dest: Element) {
  const { childNodes, attributes } = source;
  for (let i = 0; i < childNodes.length; i++) {
    _$append(dest, <Element>childNodes[i]);
  }
  for (let i = 0; i < attributes.length; i++) {
    const attr = attributes[i];
    dest.setAttributeNS(source.namespaceURI, attr.name, attr.value);
  }
  source.parentElement.replaceChild(dest, source);
  return dest;
}
export function _$removeEl(el: Element, parent: Element) {
  let root = parent || el.parentElement;
  if (root) root.removeChild(el);
}
export function _$el<T extends keyof HTMLElementTagNameMap>(tagName?: T) {
  return document.createElement(tagName || 'div');
}
export function _$svg<T extends keyof SVGElementTagNameMap>(tagName?: T) {
  return document.createElementNS('http://www.w3.org/2000/svg', tagName || 'svg');
}
export function _$text(content?: string) {
  return document.createTextNode(content || '');
}
export function _$comment(content?: string) {
  return document.createComment(content || '');
}
export function _$setAttr(el: Element & { _value?: any }, attrAndValue: [string, any]) {
  let [attr, value] = attrAndValue;
  el.setAttribute(attr, _$toString(value));
  if (_$isValueAttr(attr) && !_$isString(value)) el[PROP_MAP._] = value;
}
export function _$getAttr(el: Element, attr: string) {
  return _$isValueAttr(attr) ? _$getValue(<HTMLInputElement>el) : el.getAttribute(attr);
}
export function _$getValue(el: (HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement | HTMLOptionElement) & { _value?: any }) {
  return _$hasProp(el, PROP_MAP._) ? el[PROP_MAP._] : el[PROP_MAP.v];
}
export function _$addListener(el: HTMLElement, event: string, handler: EventListenerOrEventListenerObject) {
  el.addEventListener(event, handler, false);
}
export function _$updateListener(el: HTMLElement, event: string, oldHandler: EventListenerOrEventListenerObject, newHandler: EventListenerOrEventListenerObject) {
  _$removeListener(el, event, oldHandler);
  _$addListener(el, event, oldHandler = newHandler);
  return oldHandler;
}
export function _$removeListener(el: HTMLElement, event: string, handler: EventListenerOrEventListenerObject) {
  el.removeEventListener(event, handler, false);
}
export function _$bindClasses(value: string | ObjectLike<boolean> | (string | ObjectLike<boolean>)[]) {
  let classes = '';
  if (_$isString(value)) {
    classes += ` ${value}`;
  } else if (_$isArray(value)) {
    classes = (<any[]>value).map(_$bindClasses).join(' ');
  } else if (_$isObject(value)) {
    for (let key in <Object>value)
      if (_$hasProp(value, key) && value[key]) classes += ` ${key}`;
  }
  return classes.trim();
}
export function _$bindStyle(value: string | ObjectLike<any>) {
  let el = _$el();
  if (_$isObject(value)) {
    const { style } = <HTMLElement>el;
    _$each(value, (val, prop) => {
      if (val !== style[prop]) style[prop] = val;
    });
    return style.cssText;
  } else if (_$isString(value)) {
    return value;
  } else {
    return '';
  }
}
export function _$conditionalUpdate(block: { type: string } & ComponentTemplate, condition: Function, parent: Element, anchor: Element, inst: Component) {
  let globs = _$toArgs(arguments, 5);
  if (block && block.type === _$apply(condition, [inst], globs).type) {
    _$apply(block.$update, [inst], globs, block);
  } else {
    block && block.$destroy();
    block = _$apply(condition, [inst], globs);
    block.$create();
    block.$mount(parent || inst.$parentEl, anchor);
  }
  return block;
}
export function _$bindBooleanAttr(el: HTMLElement, attrAndValue: [string, any]) {
  let [attr, value] = attrAndValue;
  el[attr] = value == null || value === false ? (el.removeAttribute(attr), false) : (_$setAttr(el, [attr, '']), true);
}
export function _$bindUpdate(el: (HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement) & { _value: any }, binding: [string, any]) {
  let [attr, value] = binding;
  let _value: string = _$toString(value);
  if (_$isValueAttr(attr)) {
    if (el[attr] !== _value) el[attr] = _value;
    el[PROP_MAP._] = value;
  } else if (_$getAttr(el, attr) !== _value) {
    _$setAttr(el, [attr, _value]);
  }
}
export function _$textUpdate(text: Text, value: string) {
  if (text.data !== (value = _$toString(value))) text.data = value;
}
export function _$tagUpdate<T extends keyof HTMLElementTagNameMap>(node: HTMLElement, tag: T) {
  return tag.toUpperCase() !== node.tagName ? _$assignEl(node, _$el(tag)) : node;
}
export function _$removeReference(refs: Object, prop: string, node: HTMLElement) {
  let nodes = refs[prop];
  _$isArray(nodes) ? refs[prop].splice(nodes.indexOf(node), 1) : (delete refs[prop]);
}
export function _$htmlUpdate(node: HTMLElement, value: string) {
  if (node.innerHTML !== (value = _$toString(value))) node.innerHTML = value;
}
export function _$componentUpdate(parent: Component, Ctor: ComponentConstructor, inst: Component, value: ComponentConstructor, attrs: AttrParams, el: HTMLElement, sibling: HTMLElement) {
  if (value === Ctor) {
    inst && inst.$update();
  } else {
    Ctor = value;
    if (inst) {
      inst.$destroy();
      _$removeChild(parent, inst);
    }
    if (inst) {
      inst = _$addChild(parent, Ctor, attrs);
      inst.$create();
      inst.$mount(el || parent.$parentEl, sibling);
    }
  }
  return [inst, Ctor];
}
export function _$forLoop(root: Component, obj: any[], loop: (...args: any[]) => ComponentTemplate) {
  let items: ObjectLike<ComponentTemplate> = {}, loopParent: Element, loopSibling: Element;
  let globs = _$toArgs(arguments, 3);
  _$each(obj, (item, i, index) => { items[i] = _$apply(loop, [root, item, i, index], globs); });
  return {
    $create() {
      _$each(items, item => { item.$create(); });
    },
    $mount(parent, sibling) {
      loopParent = _$select(parent);
      loopSibling = _$select(sibling);
      _$each(items, item => { item.$mount(loopParent, loopSibling); });
    },
    $update(root: Component, obj: any[]) {
      let globs = _$toArgs(arguments, 2);
      _$each(items, (item, i, index) => {
        if (obj[i]) {
          _$apply(item.$update, [root, obj[i], i, index], globs, item);
        } else {
          item.$destroy();
          delete items[i];
        }
      });
      _$each(obj, (item, i, index) => {
        if (!items[i]) {
          items[i] = _$apply(loop, [root, item, i, index], globs);
          items[i].$create();
          items[i].$mount(loopParent, loopSibling);
        }
      });
    },
    $destroy() {
      _$each(items, item => { item.$destroy(); });
    }
  };
}
export function _$each<T>(obj: T, cb: (value: IterateValue<T>, key: IterateKey<T>, index?: number) => void) {
  let i = 0;
  for (const key in obj) {
    if (_$hasProp(obj, key)) {
      cb(<any>obj[key], <any>(isNaN(+key) ? key : +key), i++);
    }
  }
}
export function _$insertStyle(id: string, css: string) {
  let isNew = false;
  let style = _$select(`#${id}`, document.head);
  if (!style) {
    isNew = true;
    style = _$el('style');
    style.id = id;
    _$setAttr(style, ['refs', 1]);
  }
  if (style.textContent !== css) {
    style.textContent = css;
  }
  if (isNew) {
    _$append(document.head, style);
  } else {
    let count = +_$getAttr(style, 'refs');
    _$setAttr(style, ['refs', ++count]);
  }
}
export function _$removeStyle(id: string) {
  let style = _$select(`#${id}`, document.head);
  if (style) {
    let count = +_$getAttr(style, 'refs');
    if (--count === 0) {
      _$removeEl(style, document.head);
    } else {
      _$setAttr(style, ['refs', count]);
    }
  }
}
