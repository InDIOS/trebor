type AttrTypes = string | number | RegExp | null | boolean;
type AttrParams = string[] | ObjectLike<AttrDefinition>;
type DirectiveDefinition = (inst: Component, options: DirectiveOptions, node: HTMLElement) => void | DirectiveDefObject;
type TemplateFn = (component: Component, children: ObjectLike<ComponentConstructor>) => ComponentTemplate;
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
	$hydrate?(): void;
	$mount(parent: string | Element, sibling?: string | boolean | Element): void;
	$update(state: Component, ...args: any[]): void;
	$unmout(): void;
	$destroy(): void;
}

interface Component extends ComponentTemplate {
	$parent: Component;
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

const TPK = '__TREBOR_PLUGINS__';
const PROPS = ['$slots', '$refs', '$filters', '$directives', '_events', '_watchers'];
let TPS: { options: ObjectLike<any>, fn: PluginFn }[] = window[TPK] || (window[TPK] = []);
const _$assign = Object['assign'] || function (t: Object) {
	for (let s, i = 1, n = arguments.length; i < n; i++) {
		s = arguments[i];
		for (const p in s) if (_$hasProp(s, p)) t[p] = s[p];
	}
	return t;
};
export function _$CompCtr(attrs: AttrParams, template: TemplateFn, options: ComponentOptions, parent: Component) {
	const self = this;
	const _$set = (prop: string, value: any) => { _$def(self, prop, { value, writable: true }); };
	if (!attrs) attrs = {};
	_$e(PROPS, prop => { _$def(self, prop, { value: {} }); });
	_$set('$parent', parent || null);
	_$set('$children', []);
	_$set('_subscribers', {});
	_$set('$options', options);
	const opts: ComponentOptions = self.$options;
	if (!opts.attrs) opts.attrs = {};
	if (!opts.children) opts.children = {};
	_$e(TPS, (plugin) => { plugin.fn.call(self, _$CompCtr, plugin.options); });
	if (opts.filters) _$assign(self.$filters, opts.filters);
	if (opts.directives) _$e(opts.directives, (drt, k) => { self.$directives[k] = _$drt(drt); });
	_$e(opts.attrs, (attrOps, key) => {
		_$def(self, <string>(_$isType(key, 'number') ? attrOps : key), {
			get() {
				if (_$isStr(attrOps)) {
					let value = attrs[<string>attrOps];
					return _$isFunction(value) ? value() : value;
				} else {
					if (!_$hasProp(attrs, <string>key) && (<AttrDefinition>attrOps).required) {
						console.error(`Attribute '${key}' must be present because it's required.`);
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
								return console.error(`Attribute '${key}' with value '${JSON.stringify(value)}' is not valid.`);
							}
						}
						return value;
					}
				}
			},
			set() {
				console.error(`Can not modify attribute '${key}' because attributes al read only.`);
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
			_$def(self, key, desc);
		}
	}
	const tpl = template(self, opts.children);
	_$e(tpl, (value, key) => {
		_$def(self, key, {
			value: (function (key) {
				const hook = key[1].toUpperCase() + key.slice(2);
				const bhook = opts[`before${hook}`];
				const ahook = opts[`after${hook}`];
				return function () {
					bhook && bhook.call(this);
					key.slice(1) === 'update' ? value.call(this, this) : value.apply(this, arguments);
					ahook && ahook.call(this);
				};
			})(<string>key)
		});
	});
	_$def(self, '$data', {
		get() {
			return _$toPlainObj(this);
		}
	});
}
function _$subs(dep: string, listener: Function) {
	if (!this._subscribers[dep]) {
		this._subscribers[dep] = [];
	}
	return this._subscribers[dep].push(listener.bind(this)) - 1;
}
function _$def(obj: Object, key: string, desc: PropertyDescriptor) {
	Object.defineProperty(obj, key, desc);
}
_$assign(_$CompCtr.prototype, {
	$get(path: string) {
		return _$accesor(this, path);
	},
	$set(path: string, value: any) {
		_$accesor(this, path, value);
	},
	$on(event: string, handler: Function) {
		if (!this._events[event]) {
			this._events[event] = [];
		}
		const i = this._events[event].push(handler);
		return {
			$off: () => {
				this._events[event].splice(i - 1, 1);
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
		if (this._events[event]) {
			_$e(this._events[event], handler => { handler(data); });
		}
	},
	$notify(key: string) {
		if (this._subscribers[key]) {
			_$e(this._subscribers[key], suscriber => { suscriber(); });
		}
	},
	$observe(deps: string | string[], listener: Function) {
		const subs: { sub: string, i: number }[] = [];
		if (_$isArray(deps)) {
			_$e(<string[]>deps, dep => {
				subs.push({ sub: dep, i: _$subs.call(this, dep, listener) });
			});
		} else {
			subs.push({ sub: <string>deps, i: _$subs.call(this, deps, listener) });
		}
		return {
			$unobserve: () => {
				_$e(subs, sub => {
					this._subscribers[sub.sub].splice(sub.i, 1);
				});
			}
		};
	},
	$watch(key: string, watcher: Function) {
		if (!this._watchers[key]) {
			this._watchers[key] = [];
		}
		const i = this._watchers[key].push(watcher.bind(this));
		return {
			$unwatch: () => {
				this._watchers[key].splice(i - 1, 1);
			}
		};
	}
});
const array = Array.prototype;
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
	_$def(self, '_key', _$assign({ value: key }, desc));
	_$def(self, '_root', _$assign({ value: root }, desc));
	_$arrayValues(self, value, root, key);
	desc.writable = true;
	_$def(self, 'length', _$assign({ value: self.length }, desc));
}
_$extends(_$List, Array);
['pop', 'push', 'reverse', 'shift', 'sort', 'fill', 'unshift', 'splice'].forEach(method => {
	_$List.prototype[method] = function () {
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
_$List.prototype.pull = function (index: number) {
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
	if (root._watchers[key]) {
		_$e(root._watchers[key], watcher => { watcher(oldVal, value); });
	}
	root.$update();
}
export function _$extends(ctor: Function, exts: Function) {
	ctor['plugin'] = function (fn: PluginFn, options?: ObjectLike<any>) {
		TPS.push({ options, fn });
	};
	ctor.prototype = Object.create(exts.prototype);
	ctor.prototype.constructor = ctor;
}
export function _$isType(value: any, type: string | Function) {
	return _$type(type) === 'string' ? (<string>type).split('\|').some(t => t.trim() === _$type(value)) : value instanceof <Function>type;
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
function _$toType(value, type, root: Component, key: string) {
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
function _$type(obj: any) {
	return /\[object (\w+)\]/.exec(Object.prototype.toString.call(obj))[1].toLowerCase();
}
function _$hasProp(obj: Object, prop: string) {
	return obj.hasOwnProperty(prop);
}
function _$drt(dd: DirectiveDefinition): DirectiveDefObject {
	const hasProp = (prop, instance, options, element) => _$isObject(dd) && dd[prop] && dd[prop](instance, options, element);
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
export function _$add(inst: Component, Child: ComponentConstructor, attrs: string[] | ObjectLike<AttrDefinition>) {
	let child: Component = null;
	if (Child) {
		child = new Child(attrs, inst);
		inst.$children.push(child);
	}
	return child;
}
export function _$remove(inst: Component, child: Component) {
	let index = inst.$children.indexOf(child);
	index >= 0 && inst.$children.splice(index, 1);
}
export function _$toStr(obj: any) {
	const str: string = _$type(obj);
	return !/null|undefined/.test(str) ? obj.toString() : str;
}
function _$toPlainObj(obj: Component) {
	const data: ObjectLike<any> = {};
	_$e(_$isObject(obj) ? obj : {}, (_v, k) => {
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
export function _$setRef(obj: Object, prop: string) {
	const value = [];
	_$def(obj, prop, {
		get: () => value.length <= 1 ? value[0] : value,
		set: val => { val && !~value.indexOf(val) && value.push(val); },
		enumerable: true, configurable: true
	});
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
				if (_$isType(obj, _$List) && _$toStr(+key) === key) {
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
export function _$isKey(event: KeyboardEvent, key: string) {
	return event.key.toLowerCase() === key || !!event[`${key}Key`];
}
export function _$bindGroup(input: HTMLInputElement, selection: string[]) {
	let _value = _$gv(input);
	let _$index = selection.indexOf(_value);
	input.checked && !~_$index ? selection.push(_value) : selection.splice(_$index, 1);
}
export function _$bindMultiSelect(select: HTMLSelectElement, selections: any[]) {
	if (!selections.length) return;
	let { options } = select;
	for (let i = 0; i < options.length; i++) {
		options[i].selected = !!~selections.indexOf(_$gv(options[i]));
	}
}
export function _$updateMultiSelect(select: HTMLSelectElement, obj: Component, prop: string) {
	let items = [];
	let selection = obj[prop];
	let { selectedOptions } = select;
	for (let i = 0; i < selectedOptions.length; i++) {
		items.push(_$gv(selectedOptions[i]));
	}
	obj[prop] = new _$List(items, selection['_root'], selection['_key']);
	obj.$update();
}
export function _$(selector: string | Element, parent?: Element) {
	return _$isStr(selector) ? (parent || document).querySelector(<string>selector) : <Element>selector;
}
export function _$d() {
	return document.createDocumentFragment();
}
export function _$a(parent: Element, child: Element, sibling?: boolean | Element) {
	if (_$isType(sibling, 'boolean') && sibling) parent.parentElement.replaceChild(child, parent);
	else if (!sibling) parent.appendChild(child);
	else parent.insertBefore(child, <Element>sibling);
}
export function _$as(source: Element, dest: Element) {
	const childNodes = source.childNodes;
	const attributes = source.attributes;
	for (let i = 0; i < childNodes.length; i++) {
		_$a(dest, <Element>childNodes[i]);
	}
	for (let i = 0; i < attributes.length; i++) {
		const attr = attributes[i];
		dest.setAttributeNS(source.namespaceURI, attr.name, attr.value);
	}
	source.parentElement.replaceChild(dest, source);
	return dest;
}
export function _$r(el: Element, parent: Element) {
	let root = parent || el.parentElement;
	if (root) root.removeChild(el);
}
export function _$ce<T extends keyof HTMLElementTagNameMap>(tagName?: T) {
	return document.createElement(tagName || 'div');
}
export function _$cse<T extends keyof SVGElementTagNameMap>(tagName?: T) {
	return document.createElementNS('http://www.w3.org/2000/svg', tagName || 'svg');
}
export function _$ct(content?: string) {
	return document.createTextNode(content || '');
}
export function _$cm(content?: string) {
	return document.createComment(content || '');
}
export function _$sa(el: Element, attr: string, value: any) {
	el.setAttribute(attr, _$toStr(value));
	if (attr === 'value' && !_$isStr(value)) el['_value'] = value;
}
export function _$ga(el: Element, attr: string) {
	return attr === 'value' ? _$gv(<HTMLInputElement>el) : el.getAttribute(attr);
}
export function _$gv(el: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement | HTMLOptionElement) {
	return _$hasProp(el, '_value') ? el['_value'] : el.value;
}
export function _$al(el: HTMLElement, event: string, handler: EventListenerOrEventListenerObject) {
	el.addEventListener(event, handler, false);
}
export function _$ul(el: HTMLElement, event: string, oldHandler: EventListenerOrEventListenerObject, newHandler: EventListenerOrEventListenerObject) {
	_$rl(el, event, oldHandler);
	_$al(el, event, oldHandler = newHandler);
	return oldHandler;
}
export function _$rl(el: HTMLElement, event: string, handler: EventListenerOrEventListenerObject) {
	el.removeEventListener(event, handler, false);
}
export function _$bc(value: string | ObjectLike<boolean> | (string | ObjectLike<boolean>)[]) {
	let classes = '';
	if (_$isStr(value)) {
		classes += ` ${value}`;
	} else if (_$isArray(value)) {
		classes = (<any[]>value).map(_$bc).join(' ');
	} else if (_$isObject(value)) {
		for (let key in <Object>value)
			if (_$hasProp(value, key) && value[key]) classes += ` ${key}`;
	}
	return classes.trim();
}
export function _$bs(value: string | ObjectLike<any>) {
	let el = _$ce();
	if (_$isObject(value)) {
		const { style } = <HTMLElement>el;
		_$e(value, (val, prop) => {
			if (val !== style[prop]) {
				style[prop] = val;
			}
		});
		return style.cssText;
	} else if (_$isStr(value)) {
		return value;
	} else {
		return '';
	}
}
export function _$cu(block: { type: string } & ComponentTemplate, condition: Function, inst: Component, parent: Element, anchor: Element) {
	if (block && block.type === condition(inst).type) {
		block.$update(inst);
	} else {
		block && block.$destroy();
		block = condition(inst);
		block.$create();
		block.$mount(parent, anchor);
	}
	return block;
}
export function _$iu(el: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement, attr: string, value: any) {
	let _value: string | boolean = attr === 'checked' ? !!value : _$toStr(value);
	if (/value|checked/.test(attr)) {
		if (el[attr] !== _value) el[attr] = attr === 'value' ? _value : value;
		el['_value'] = attr === 'value' ? value : el.value;
	} else if (_$ga(el, attr) !== _value) {
		_$sa(el, attr, _value);
	}
}
export function _$tu(text: Text, value: string) {
	value = _$toStr(value);
	if (text.data !== value) text.data = value;
}
export function _$f(root: Component, obj: any[], loop: (...args: any[]) => ComponentTemplate) {
	let items: ObjectLike<ComponentTemplate> = {}, loopParent: Element, loopSibling: Element;
	let globs = _$toArgs(arguments, 3);
	_$e(obj, (item, i) => { items[i] = loop.apply(null, [root, item, i].concat(globs)); });
	return {
		$create() {
			_$e(items, item => { item.$create(); });
		},
		$mount(parent, sibling) {
			loopParent = _$(parent);
			loopSibling = _$(sibling);
			_$e(items, item => { item.$mount(loopParent, loopSibling); });
		},
		$update(root: Component, obj: any[]) {
			let globs = _$toArgs(arguments, 2);
			_$e(items, (item, i) => {
				if (obj[i]) {
					item.$update.apply(item, [root, obj[i], i].concat(globs));
				} else {
					item.$destroy();
					delete items[i];
				}
			});
			_$e(obj, (item, i) => {
				if (!items[i]) {
					items[i] = loop.apply(null, [root, item, i].concat(globs));
					items[i].$create();
					items[i].$mount(loopParent, loopSibling);
				}
			});
		},
		$destroy() {
			_$e(items, item => { item.$destroy(); });
		}
	};
}
export function _$e<T>(obj: T, cb: (value: IterateValue<T>, key: IterateKey<T>) => void) {
	for (const key in obj) {
		if (_$hasProp(obj, key)) {
			cb(<any>obj[key], <any>(isNaN(+key) ? key : +key));
		}
	}
}
export function _$is(id: string, css: string) {
	let isNew = false;
	let style = _$(`#${id}`, document.head);
	if (!style) {
		isNew = true;
		style = _$ce('style');
		style.id = id;
		_$sa(style, 'refs', '1');
	}
	if (style.textContent !== css) {
		style.textContent = css;
	}
	if (isNew) {
		_$a(document.head, style);
	} else {
		let count = +_$ga(style, 'refs');
		_$sa(style, 'refs', _$toStr(++count));
	}
}
export function _$ds(id: string) {
	let style = _$(`#${id}`, document.head);
	if (style) {
		let count = +_$ga(style, 'refs');
		if (--count === 0) {
			_$r(style, document.head);
		} else {
			_$sa(style, 'refs', _$toStr(count));
		}
	}
}
