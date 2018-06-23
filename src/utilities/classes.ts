import { removeEmptyNodes, stripWhitespace } from './html';
import { serialize, DefaultTreeNode, DefaultTreeElement, DefaultTreeTextNode, Attribute } from 'parse5';

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
  unmount: string[] = [];
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

  constructor(node: DefaultTreeNode, parent: NodeElement) {
    this.nodeType = nodeType(node.nodeName);
    this.tagName = (<DefaultTreeElement>node).tagName || node.nodeName;
    this.isUnknownElement = false;
    if (this.nodeType === 1) this.isUnknownElement = !html5.includes(this.tagName);
    this._textContent = (<DefaultTreeTextNode>node).value || '';
    this.attributes = (<DefaultTreeElement>node).attrs || [];
    this.content = null;
    this.childNodes = [];
    this.parentElement = null;
    if (parent) this.parentElement = parent;
    if ((<DefaultTreeElement>node).childNodes && this.tagName !== 'template') {
      this.childNodes = (<DefaultTreeElement>node).childNodes.map(n => new NodeElement(n, this));
    }
    if (this.nodeType === 1 && this.tagName === 'template') {
      const childNodes = removeEmptyNodes(stripWhitespace(node['content'].childNodes));
      this.content = new NodeElement(<DefaultTreeElement>{ nodeName: '#document-fragment', childNodes }, null);
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
        return removeEmpty(acc);
      }, '');
    }
    return this._textContent;
  }

  set textContent(value: string) {
    if (this.nodeType === 1 || this.nodeType === 11) {
      const text = new NodeElement(<DefaultTreeTextNode>{ nodeName: '#text', value }, this);
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
		return serialize(this.childNodes.map(toNode));
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

  hasAttribute(name: string) {
    return !!this.attributes.find(attr => attr.name.split('.')[0] === name);
  }

  getAttribute(name: string) {
    const attr = this.attributes.find(attr => attr.name.split('.')[0] === name);
    return attr ? attr.value : undefined;
  }

  setAttribute(name: string, value?: any) {
    const attr = this.attributes.find(attr => attr.name.split('.')[0] === name);
    if (attr) attr.value = value;
    else this.attributes.push({ name, value });
  }

  removeAttribute(name: string) {
    const position = this.attributes.findIndex(attr => attr.name.split('.')[0] === name);
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
    case '#text':
      return 3;
    case '#comment':
      return 8;
    case '#document-fragment':
      return 11;
    default:
      return 1;
  }
}

function toNode(node: NodeElement) {
  const n: DefaultTreeNode = { nodeName: node.tagName };
  if (node.nodeType === 1) {
    n['tagName'] = node.tagName;
    n['attrs'] = node.attributes;
    n['childNodes'] = [];
    if (n.nodeName === 'template') {
      n['content'] = node.childNodes.map(toNode);
    } else {
      n['childNodes'] = node.childNodes.map(toNode);
    }
  } else if (node.nodeType === 3) {
    n['value'] = node.textContent;
  } else if (node.nodeType === 8) {
    n['data'] = node.textContent;
  }
  return n;
}

function removeEmpty(str: string) {
  return str.replace(/[\r\t\n]/g, ' ').replace(/^\s{2,}/, ' ').replace(/\s{2,}$/, ' ');
}