import { parse, stringify } from 'himalaya';
import { Node, Element, Attribute, Text } from '../types.d';

export interface Condition {
	ifCond?: string;
	elseIfConds?: string[];
	elseCond?: boolean;
}

export class BlockAreas {
	variables: string[] = [];
	create: string[] = [];
	hydrate: string[] = [];
	mount: string[] = [];
	mountDirt: string[] = [];
	update: string[] = [];
	destroy: string[] = [];
	outer: string[] = [];
	extras: string[] = [];
	globals: string[] = [];
	loops: number = 0;
	conditions: Condition[] = [];
}

const html5 = [
	'!doctype',
	'a', 'abbr', 'address', 'area', 'article', 'aside', 'audio',
	'b', 'base', 'bdi', 'bdo', 'blockquote', 'body', 'br', 'button',
	'canvas', 'caption', 'cite', 'code', 'col', 'colgroup',
	'data', 'datalist', 'dd', 'del', 'details', 'dfn', 'dialog', 'div', 'dl', 'dt',
	'em', 'embed',
	'fieldset', 'figcaption', 'figure', 'footer', 'form',
	'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'head', 'header', 'hr', 'html',
	'i', 'iframe', 'img', 'input', 'ins',
	'kbd',
	'label', 'legend', 'li', 'link',
	'main', 'map', 'mark', 'meta', 'meter',
	'nav', 'noscript',
	'object', 'ol', 'optgroup', 'option', 'output',
	'p', 'param', 'pre', 'progress',
	'q',
	'rp', 'rt', 'rtc', 'ruby',
	's', 'samp', 'script', 'section', 'select', 'slot', 'small', 'source', 'span', 'strong', 'style', 'sub', 'summary', 'sup',
	'table', 'tbody', 'td', 'template', 'textarea', 'tfoot', 'th', 'thead', 'time', 'title', 'tr', 'track',
	'u', 'ul',
	'var', 'video',
	'wbr'
];

export class NodeElement {
	tagName: string;
	nodeType: number;
	private _textContent: string;
	content: NodeElement;
	parentElement: NodeElement;
	childNodes: NodeElement[];
	attributes: Attribute[];
	isUnknownElement: boolean;

	constructor(node: Node, parent: NodeElement) {
		this.nodeType = nodeType(node.type);
		this.tagName = nodeTag(this.nodeType, (<Element>node).tagName);
		this.isUnknownElement = false;
		if (this.nodeType === 1) this.isUnknownElement = !html5.includes(this.tagName);
		this._textContent = (<Text>node).content || '';
		this.attributes = (<Element>node).attributes || [];
		this.content = null;
		this.childNodes = [];
		this.parentElement = null;
		if (parent) this.parentElement = parent;
		if ((<Element>node).children && this.tagName !== 'template') {
			this.childNodes = (<Element>node).children.map(n => new NodeElement(n, this));
		}
		if (this.nodeType === 1 && this.tagName === 'template') {
			const { content } = <Text>(<Element>node).children[0];
			this._textContent = content;
			const children = parse(content);
			const frag = new NodeElement(<any>{ type: 'fragment', children }, null);
			this.content = frag;
		}
	}

	get children() {
		return this.childNodes.filter(n => n.nodeType === 1);
	}

	get textContent() {
		if (this.nodeType === 1 || this.nodeType === 11) {
			this._textContent = this.childNodes.reduce((acc, cur) => {
				if (cur.nodeType === 3) {
					acc += cur.textContent;
				}
				return acc;
			}, '');
		}
		return this._textContent;
	}

	set textContent(value: string) {
		if (this.nodeType === 1 || this.nodeType === 11) {
			const text = new NodeElement(<Text>{ type: 'text', content: value }, this);
			this.appendChild(text);
		} else {
			this._textContent = value;
		}
	}

	get nextElementSibling() {
		if (this.parentElement) {
			if (this.nodeType === 1) {
				const index = this.parentElement.children.indexOf(this);
				return this.parentElement.children[index + 1] || null;
			} else {
				const index = this.parentElement.childNodes.indexOf(this);
				const { length } = this.parentElement.childNodes;
				const nexts = this.parentElement.childNodes.slice(index + 1, length);
				return nexts.filter(n => n.nodeType === 1).shift() || null;
			}
		}
		return null;
	}

	get innerHTML() {
		return stringify(this.childNodes.map(toNode));
	}

	querySelectorAll(tagName: string) {
		let elements: NodeElement[] = [];
		this.childNodes.forEach(el => {
			if (el.nodeType === 1) {
				if (el.tagName === tagName) {
					elements.push(el);
				} else {
					elements = elements.concat(el.querySelectorAll(tagName));
				}
			}
		});
		return elements;
	}

	querySelector(tagName: string) {
		return this.querySelectorAll(tagName)[0];
	}

	hasAttribute(key: string) {
		return !!this.attributes.find(attr => attr.key.split('.')[0] === key);
	}

	getAttribute(key: string) {
		const attr = this.attributes.find(attr => attr.key.split('.')[0] === key);
		return attr ? attr.value : undefined;
	}

	setAttribute(key: string, value?: any) {
		const attr = this.attributes.find(attr => attr.key.split('.')[0] === key);
		if (attr) attr.value = value;
		else this.attributes.push({ key, value });
	}

	removeAttribute(key: string) {
		const position = this.attributes.findIndex(attr => attr.key.split('.')[0] === key);
		this.attributes.splice(position, 1);
	}

	appendChild(...children: NodeElement[]) {
		children.forEach(node => {
			if (node.nodeType === 11) {
				this.appendChild(...node.childNodes);
			} else {
				node.parentElement = this;
				this.childNodes.push(node);
			}
		});
	}

	removeChild(child: NodeElement) {
		const i = this.childNodes.indexOf(child);
		if (~i) {
			child.parentElement = null;
			this.childNodes.splice(i, 1);
		}
	}

	remove() {
		if (this.parentElement) {
			this.parentElement.removeChild(this);
		}
	}
}

function nodeType(type: string) {
	switch (type) {
		case 'element':
			return 1;
		case 'comment':
			return 8;
		case 'fragment':
			return 11;
		default:
			return 3;
	}
}

function nodeTag(type: number, tag: string) {
	switch (type) {
		case 1:
			return tag;
		case 8:
			return '#comment';
		case 11:
			return '#fragment';
		default:
			return '#text';
	}
}

function toNode(node: NodeElement): Node {
	const n = { type: node.nodeType === 1 ? 'element' : node.nodeType === 3 ? 'text' : 'comment' };
	if (n.type === 'element') {
		n['tagName'] = node.tagName.toLowerCase();
		n['attributes'] = node.attributes;
		n['children'] = node.childNodes.map(toNode);
	} else {
		n['content'] = node.textContent;
	}
	return <Node>n;
}