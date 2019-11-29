import { serialize } from './serializer';
import { TreeConstructor } from 'hyntax';
import { nodeTypes, svg2, html5, toNode } from './utils';
import { parseTextExpression, escapeCharacters } from '../../utils';

type AnyNode = TreeConstructor.AnyNode;
type TextNode = TreeConstructor.NodeContents.Text;
type ElementNode = TreeConstructor.NodeContents.Tag;

export class Element {
  varName: string;
  nodeType: 1 | 3 | 8 | 11;
  tagName: string;
  isUnknownElement: boolean;
  isSVGElement: boolean;
  _textContent: string;
  attributes: { name: string, value: string }[];
  parentElement: Element;
  childNodes: Element[];

  constructor(node: AnyNode, parent: Element, comments: boolean = false) {
    const { nodeType, content } = node;
    const { value } = <TextNode>content;
    const { name, attributes, children } = <ElementNode>content;

    this.nodeType = nodeTypes(nodeType);
    this.tagName = nodeType === 'tag' ? name : /style|script/.test(nodeType) ? nodeType : `#${nodeType}`;
    this.isUnknownElement = false;
    this.isSVGElement = this.tagName === 'svg';
    this._textContent = value ? value.content : '';
    this.attributes = attributes ? attributes
      .reduce((attrs, { key, value }) => {
        if (key && key.content.trim()) {
          attrs.push({ name: key.content.trim(), value: (value || { content: '' }).content });
        }
        return attrs;
      }, []) : [];
    this.childNodes = [];
    this.parentElement = null;
    if (parent) {
      this.parentElement = parent;
      this.isSVGElement = parent.isSVGElement;
    }
    if (this.nodeType === 1) {
      this.isUnknownElement = !(svg2(this.tagName) || html5(this.tagName));
    }
    if (children) {
      this.childNodes = children.reduce((nodes, node) => {
        const nodeType = nodeTypes(node.nodeType);
        const text = nodeType === 3 ? (<TextNode>node.content).value.content.trim() : '';
        if (nodeType === 1 || text || comments && nodeType === 8) {
          nodes.push(new Element(node, this, comments));
        }
        return nodes;
      }, <Element[]>[]);
    }
    if (/style|script/.test(nodeType)) {
      this.childNodes.push(new Element({
        nodeType: 'text', content: <TextNode>{ value: { content: this._textContent } }
      }, this, comments));
    }
  }

  get children() {
    return this.childNodes.filter(n => n.nodeType === 1);
  }

  get textContent() {
    if (this.nodeType === 1 || this.nodeType === 11) {
      this._textContent = this.childNodes
        .reduce((text, child) => text += ` ${child.textContent}`, '').trim();
    }
    return this._textContent;
  }

  set textContent(value) {
    if (this.nodeType === 1 || this.nodeType === 11) {
      const text = new Element({
        nodeType: 'text', content: <TextNode>{ value: { content: value } }
      }, this);
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
      nodeName: '#document',
      childNodes: this.childNodes.map(toNode),
      tagName: '', attrs: [], parentNode: null
    });
    return escapeCharacters(html);
  }

  querySelectorAll(tagName: string) {
    let elements: Element[] = [];
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
    return attr ? attr.value : null;
  }

  setAttribute(name: string, value: any) {
    const attr = this.attributes.find(attr => attr.name.split('.')[0] === name);
    if (attr) attr.value = value;
    else this.attributes.push({ name, value });
  }

  removeAttribute(name: string) {
    const position = this.attributes.findIndex(attr => attr.name.split('.')[0] === name);
    ~position && this.attributes.splice(position, 1);
  }

  appendChild(...children: Element[]) {
    children.forEach(node => {
      if (node.nodeType === 11) {
        this.appendChild(...node.childNodes);
      } else {
        node.parentElement = this;
        this.childNodes.push(node);
      }
    });
  }

  hasExpression(includeChildren = true) {
    // /{\s*([^}]*(?:}[^}]*)*)\s*}/ React style
    // /\{\{\s*((?!\}\})(.|\n))*\}\}/ Mustache style
    const thisHas = this.isUnknownElement || this.tagName === 'slot' ||
      this.attributes.some(a => /^[$@:#]/.test(a.name)) ||
      (this.nodeType === 3 && parseTextExpression(this.textContent, true));
    return includeChildren ? thisHas || this.childNodes.some(c => c.hasExpression()) : thisHas;
  }

  removeChild(child: Element) {
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
