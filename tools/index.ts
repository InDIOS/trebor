export function _$CompCtr(attrs, template, options) {
	if (!attrs) attrs = {};
	['$slots', '$refs', '$filters', '$directives', '_events', '_watchers']
		.forEach(prop => { _$def(this, prop, { value: {} }); });
	_$def(this, '_subscribers', { value: {}, writable: true });
	_$def(this, '$options', { value: options, writable: true });
	if (!this.$options.attrs) this.$options.attrs = {};
	if (options.filters) _$e(options.filters, (filter, key) => { this.$filters[key] = filter; });
	if (!this.$options.children) this.$options.children = {};
	if (options.directives) _$e(options.directives, (directive, key) => { this.$directives[key] = _$drt(directive); });
	_$e(this.$options.attrs, (attrOps, key) => {
		_$def(this, _$isType(key, 'number') ? attrOps : key, {
			get() {
				if (_$isType(attrOps, 'string')) {
					return _$isType(attrs[attrOps], 'function') ? attrs[attrOps]() : attrs[attrOps];
				} else {
					if (!_$hasProp(attrs, key) && attrOps.required) {
						console.error(`Attribute '${key}' most be present because it's required.`);
					} else {
						let value = _$isType(attrs[key], 'function') ? attrs[key]() : attrs[key];
						if (value === void 0 && _$hasProp(options, 'default')) {
							value = _$isType(attrOps.default, 'function') ? attrOps.default : attrOps.default();
						}
						if (attrOps.type && !_$isType(value, attrOps.type)) {
							return console.error(`Attribute '${key}' most be type '${attrOps.type}'.`);
						}
						return _$toType(value, attrOps.type, this, key);
					}
				}
			},
			set() {
				console.error(`Can not modify attribute '${key}' because attributes al read only.`);
			},
			enumerable: true, configurable: true
		});
	});
	const mounted = (this.$options.model || {}).mounted || function () { };
	this.$set(this.$options.model || {});
	const tpl = template(this, this.$options.children);
	_$e(tpl, (value, key) => {
		if (key === '$mount') {
			value = (function (key) {
				return function (parent, sibling) {
					this.$root = _$(parent);
					tpl[key].call(this, parent, sibling);
					mounted.call(this);
				};
			})(key);
		}
		_$def(this, key, { value });
	});
	_$def(this, '$data', {
		get() {
			return _$toPlainObj(this);
		}
	});
	this.$create();
}
_$CompCtr.prototype.$set = function (value) {
	_$accesor(this, value, this, null);
};
_$CompCtr.prototype.$on = function (event, handler) {
	if (!this._events[event]) {
		this._events[event] = [];
	}
	const i = this._events[event].push(handler);
	return {
		$off: () => {
			this._events[event].splice(i - 1, 1);
		}
	};
};
_$CompCtr.prototype.$once = function (event, handler) {
	const e = this.$on(event, args => {
		handler(args);
		e.$off();
	});
};
_$CompCtr.prototype.$fire = function (event, data) {
	if (this._events[event]) {
		this._events[event].forEach(handler => { handler(data); });
	}
};
_$CompCtr.prototype.$notify = function (key) {
	if (this._subscribers[key]) {
		this._subscribers[key].forEach(suscriber => { suscriber(); });
	}
};
_$CompCtr.prototype.$observe = function (deps, listener) {
	const subs = [];
	if (Array.isArray(deps)) {
		deps.forEach(dep => {
			subs.push({ sub: dep, i: _$subs.call(this, dep, listener) });
		});
	} else {
		subs.push({ sub: deps, i: _$subs.call(this, deps, listener) });
	}
	return {
		$unobserve: () => {
			subs.forEach(sub => {
				this._subscribers[sub.sub].splice(sub.i, 1);
			});
		}
	};
};
_$CompCtr.prototype.$watch = function (key, watcher) {
	if (!this._watchers[key]) {
		this._watchers[key] = [];
	}
	const i = this._watchers[key].push(watcher.bind(this));
	return {
		$unwatch: () => {
			this._watchers[key].splice(i - 1, 1);
		}
	};
};
const array = Array.prototype;
function _$arrayValues(list, value, root, key) {
	value.forEach(v => {
		array.push.call(list, null);
		_$accesor(list, { [list.length - 1]: v }, root, key);
	});
}
function _$List(value, root, key) {
	Array.apply(this, [value.length]);
	_$arrayValues(this, value, root, key);
	_$def(this, 'length', { value: value.length, writable: true, configurable: false, enumerable: false });
	['pop', 'push', 'reverse', 'shift', 'sort', 'fill', 'unshift', 'splice'].forEach(method => {
		_$List.prototype[method] = function (...args) {
			const old = this.slice();
			let result;
			if (method === 'push') {
				_$arrayValues(this, args, root, key);
				result = this.length;
			} else {
				result = array[method].apply(this, args);
			}
			_$dispatch(root, key, old, this.slice());
			return result;
		};
	});
}
_$List.prototype = Object.create(array);
_$List.prototype.constructor = _$List;
_$List.prototype.pull = function (index, ...items) {
	let length = this.length;
	if (index > length) {
		length = index + 1;
		const pull = new Array(index - this.length);
		pull.push(...items);
		for (let i = 0; i < length; i++) {
			if (i === index) {
				this.push(...pull);
			}
		}
	} else {
		this.splice(index, 1, ...items);
	}
};
function _$dispatch(root, key, oldVal, value) {
	root.$notify(key);
	if (root._watchers[key]) {
		root._watchers[key].forEach(watcher => { watcher(oldVal, value); });
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
function _$hasProp(obj: Object, prop: string) {
	return obj.hasOwnProperty(prop);
}
function _$drt(directive) {
	return {
		$init(instance, options, element) {
			if (_$isObject(directive) && directive.$init) {
				directive.$init(instance, options, element);
			}
		},
		$inserted(instance, options, element) {
			if (_$isObject(directive) && directive.$inserted) {
				directive.$inserted(instance, options, element);
			}
		},
		$update(instance, options, element) {
			if (_$isObject(directive) && directive.$update) {
				directive.$update(instance, options, element);
			} else if (_$isType(directive, 'function')) {
				directive(instance, options, element);
			}
		},
		$destroy(instance, options, element) {
			if (_$isObject(directive) && directive.$destroy) {
				directive.$destroy(instance, options, element);
			}
		}
	};
}
export function _$toStr(obj) {
	const str: string = _$type(obj);
	return !/null|undefined/.test(str) ? obj.toString() : str;
}
function _$toPlainObj(obj) {
	const data = {};
	_$e(_$isObject(obj) ? obj : {}, (_v, k) => {
		if (k[0] !== '$' && !_$isType(obj[k], 'function')) {
			if (obj[k] instanceof _$List) {
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
		get() {
			return value.length <= 1 ? value[0] : value;
		},
		set(val) {
			if (val && !~value.indexOf(val)) {
				value.push(val);
			}
		},
		enumerable: true,
		configurable: true
	});
}
function _$accesor(obj, data, root, pKey) {
	for (const key in data) {
		if (_$hasProp(data, key)) {
			const desc = Object.getOwnPropertyDescriptor(data, key);
			if (_$isType(desc.value, 'function') || desc.get) {
				_$def(obj, key, desc);
			} else {
				let value = data[key];
				const k = pKey ? `${pKey}.${key}` : key;
				_$def(obj, key, {
					get() {
						return value;
					},
					set(v) {
						const oldVal = value;
						value = v;
						if (_$type(value) === 'array') {
							value = new _$List(value, root, k);
						} else if (_$isObject(value)) {
							_$accesor(value, v, root, k);
						}
						_$dispatch(root || this, k, oldVal, value);
					},
					enumerable: desc.enumerable, configurable: desc.configurable
				});
				if (_$type(value) === 'array') {
					value = new _$List(value, root, k);
				} else if (_$isObject(value)) {
					_$accesor(obj[key], value, root, k);
				}
			}
		}
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
export function _$(selector, parent?) {
	return _$isType(selector, 'string') ? (parent || document).querySelector(selector) : selector;
}
export function _$d() {
	return document.createDocumentFragment();
}
export function _$a(parent, child, sibling?) {
	if (!sibling) parent.appendChild(child);
	else parent.insertBefore(child, sibling);
}
export function _$r(el, parent) {
	let root = parent || el.parentElement;
	if (root) root.removeChild(el);
}
export function _$ce(tagName?) {
	return document.createElement(tagName || 'div');
}
export function _$ct(content) {
	return document.createTextNode(content || '');
}
export function _$cm(content) {
	return document.createComment(content || '');
}
export function _$sa(el, attr, value) {
	el.setAttribute(attr, value);
}
export function _$ga(el, attr) {
	return el.getAttribute(attr);
}
export function _$al(el, event, handler) {
	el.addEventListener(event, handler, false);
}
export function _$ul(el, event, oldHandler, newHandler) {
	_$rl(el, event, oldHandler);
	_$al(el, event, oldHandler = newHandler);
	return oldHandler;
}
export function _$rl(el, event, handler) {
	el.removeEventListener(event, handler, false);
}
export function _$bc(value) {
	let classes = '';
	if (_$isType(value, 'string')) {
		classes += ` ${value}`;
	} else if (Array.isArray(value)) {
		classes = value.map(_$bc).join(' ');
	} else if (_$isObject(value)) {
		for (let key in value)
			if (_$hasProp(value, key) && value[key]) classes += ` ${key}`;
	}
	return classes.trim();
}
export function _$bs(value) {
	let el = _$ce();
	if (_$isObject(value)) {
		const { style } = el;
		_$e(value, (val, prop) => {
			if (val !== style[prop]) {
				style[prop] = val;
			}
		});
		return style.cssText;
	} else if (_$isType(value, 'string')) {
		return value;
	} else {
		return '';
	}
}
export function _$f(root, obj, loop) {
	let items = {}, loopParent, loopSibling;
	_$e(obj, (item, i) => { items[i] = loop(root, item, i); });
	return {
		$create() {
			_$e(items, item => { item.$create(); });
		},
		$mount(parent, sibling) {
			loopParent = _$(parent);
			loopSibling = _$(sibling);
			_$e(items, item => { item.$mount(loopParent, loopSibling); });
		},
		$update(root, obj) {
			_$e(items, (item, i) => {
				if (obj[i]) {
					item.$update(root, obj[i], i);
				} else {
					item.$destroy();
					delete items[i];
				}
			});
			_$e(obj, (item, i) => {
				if (!items[i]) {
					items[i] = loop(root, item, i);
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
export function _$e(obj: Object, cb: (value: any, key: string) => void);
export function _$e<T>(obj: Array<T>, cb: (value: any, key: number) => void);
export function _$e(obj: any, cb: (value: any, key: any) => void) {
	for (const key in obj) {
		if (_$hasProp(obj, key)) {
			cb(obj[key], isNaN(+key) ? key : +key);
		}
	}
}
export function _$is(id, css) {
	let isNew = false;
	let style = _$(`#${id}`, document.head);
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
	} else {
		let count = +_$ga(style, 'refs');
		_$sa(style, 'refs', (++count).toString());
	}
}
export function _$ds(id) {
	let style = _$(`#${id}`, document.head);
	if (style) {
		let count = +_$ga(style, 'refs');
		if (--count === 0) {
			_$r(style, document.head);
		} else {
			_$sa(style, 'refs', count.toString());
		}
	}
}
