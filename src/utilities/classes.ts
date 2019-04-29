import svg2 from 'svg-tag-names';
import html5 from 'html-tag-names';
import { escapeExp } from './tools';
import { removeEmptyNodes, stripWhitespace } from './html';
import { serialize, DefaultTreeNode, DefaultTreeElement, DefaultTreeTextNode, Attribute } from 'parse5';

export interface Condition {
  index: number;
  ifCond?: string;
  elseIfConds?: string[];
  elseCond?: boolean;
}

export class BlockAreas {
  loops: number;
  conditions: number;
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

  constructor(loops: number = 0, conditions: number = 0) {
    this.loops = loops || 0;
    this.conditions = conditions || 0;
  }
}

interface Blocks {
  loops: number;
  conditions: { if: boolean, elseIf: number, else: boolean }[];
}

export class NodeElement {
  isBlock: boolean;
  varName: string;
  dymTag: string;
  tagName: string;
  nodeType: number;
  isSVGElement: boolean;
  private _textContent: string;
  content: NodeElement;
  parentElement: NodeElement;
  childNodes: NodeElement[];
  attributes: Attribute[];
  isUnknownElement: boolean;

  constructor(node: DefaultTreeNode, parent: NodeElement, blocks?: Blocks) {
    this.nodeType = nodeType(node.nodeName);
    this.tagName = (<DefaultTreeElement>node).tagName || node.nodeName;
    this.isUnknownElement = false;
    this.isSVGElement = (<DefaultTreeElement>node).namespaceURI === 'http://www.w3.org/2000/svg' && this.tagName !== 'template';
    if (this.nodeType === 1) {
      this.isUnknownElement = !(html5.includes(this.tagName) || svg2.includes(this.tagName));
    }
    this._textContent = (<DefaultTreeTextNode>node).value || '';
    this.attributes = (<DefaultTreeElement>node).attrs || [];
    this.content = null;
    this.childNodes = [];
    this.parentElement = null;
    if (parent) this.parentElement = parent;
    if (blocks && this.nodeType === 1) {
      if (this.hasAttribute('$for')) {
        blocks.loops++;
      }
      if (this.hasAttribute('$if')) {
        let cond = { if: true, elseIf: 0, else: false };
        let sibling = this.nextElementSibling;
        if (sibling && sibling.hasAttribute('$else')) {
          cond.else = true;
        } else {
          while (sibling && sibling.hasAttribute('$else-if')) {
            cond.elseIf++;
            sibling = sibling.nextElementSibling;
          }
          if (sibling && sibling.hasAttribute('$else')) {
            cond.else = true;
          }
        }
        blocks.conditions.push(cond);
      }
    }
    if ((<DefaultTreeElement>node).childNodes && this.tagName !== 'template') {
      this.childNodes = (<DefaultTreeElement>node).childNodes.map(n => new NodeElement(n, this, blocks));
    }
    if (this.nodeType === 1 && this.tagName === 'template') {
      const childNodes = removeEmptyNodes(stripWhitespace(node['content'] ? node['content'].childNodes : (<DefaultTreeElement>node).childNodes));
      this.content = new NodeElement(<DefaultTreeElement>{ nodeName: '#document-fragment', childNodes }, null, blocks);
    }
  }

  get children() {
    return this.childNodes.filter(n => n.nodeType === 1);
  }

  get textContent() {
    if (this.nodeType === 1 || this.nodeType === 11) {
      this._textContent = this.childNodes.reduce((text, child) => text += child.textContent, '');
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
        return nexts.filter(n => n.nodeType === 1)[0] || null;
      }
    }
    return null;
  }

  get innerHTML() {
    const html = serialize({
      nodeName: '#document-fragment',
      childNodes: this.childNodes.map(toNode)
    });
    return escapeExp(html);
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
    ~position && this.attributes.splice(position, 1);
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

  hasExpression(): boolean {
    return this.isBlock || this.isUnknownElement || this.tagName === 'slot' ||
      this.attributes.some(a => /^[$@:#]/.test(a.name)) ||
      /\{\{\s*((?!\}\})(.|\n))*\}\}/.test(this.textContent) ||
      this.childNodes.some(c => c.hasExpression());
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
