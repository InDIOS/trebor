const AMP_REGEX = /&/g;
const NBSP_REGEX = /\u00a0/g;
const DOUBLE_QUOTE_REGEX = /"/g;
const LT_REGEX = /</g;
const GT_REGEX = />/g;

export type SerializerNode = HtmlElement | HtmlText | HtmlComment;

export interface HtmlNode {
  nodeName: string;
  parentNode: HtmlElement;
}

export interface HtmlElement extends HtmlNode {
  tagName: string;
  childNodes: SerializerNode[];
  attrs: { name: string, value: any }[];
}

export interface HtmlText extends HtmlNode {
  value: string;
}

export interface HtmlComment extends HtmlNode {
  data: string;
}

export class Serializer {
  html: string;
  startNode: SerializerNode;

  constructor(node: SerializerNode) {
    this.html = '';
    this.startNode = node;
  }

  serialize() {
    this._serializeChildNodes(<HtmlElement>this.startNode);

    return this.html;
  }

  _serializeChildNodes(parentNode: HtmlElement) {
    const childNodes = parentNode.childNodes;

    for (let i = 0, cnLength = childNodes.length; i < cnLength; i++) {
      const currentNode = childNodes[i];

      if ((<HtmlElement>currentNode).tagName) {
        this._serializeElement(<HtmlElement>currentNode);
      } else if (currentNode.nodeName === '#text') {
        this._serializeTextNode(<HtmlText>currentNode);
      } else if (currentNode.nodeName === '#comment') {
        this._serializeCommentNode(<HtmlComment>currentNode);
      }
    }
  }

  _serializeElement(node: HtmlElement) {
    const tn = node.tagName;

    this.html += `<${tn}`;
    this._serializeAttributes(node);
    this.html += '>';

    if (
      tn !== 'area' &&
      tn !== 'base' &&
      tn !== 'basefont' &&
      tn !== 'bgsound' &&
      tn !== 'br' &&
      tn !== 'col' &&
      tn !== 'command' &&
      tn !== 'embed' &&
      tn !== 'frame' &&
      tn !== 'hr' &&
      tn !== 'image' &&
      tn !== 'img' &&
      tn !== 'input' &&
      tn !== 'isindex' &&
      tn !== 'keygen' &&
      tn !== 'link' &&
      tn !== 'menuitem' &&
      tn !== 'meta' &&
      tn !== 'nextid' &&
      tn !== 'param' &&
      tn !== 'source' &&
      tn !== 'track' &&
      tn !== 'wbr'
    ) {
      const childNodesHolder = node;

      this._serializeChildNodes(childNodesHolder);
      this.html += `</${tn}>`;
    }
  }

  _serializeAttributes(node: HtmlElement) {
    const attrs = node.attrs;

    for (let i = 0, attrsLength = attrs.length; i < attrsLength; i++) {
      const attr = attrs[i];
      const value = escapeString(attr.value, true);
      this.html += ` ${attr.name}="${value}"`;
    }
  }

  _serializeTextNode(node: HtmlText) {
    const content = node.value;
    const parent = node.parentNode;
    let parentTn = void 0;

    if (parent && parent.tagName) {
      parentTn = parent.tagName;
    }

    if (
      parentTn === 'style' ||
      parentTn === 'script' ||
      parentTn === 'xmp' ||
      parentTn === 'iframe' ||
      parentTn === 'noembed' ||
      parentTn === 'noframes' ||
      parentTn === 'plaintext' ||
      parentTn === 'noscript'
    ) {
      this.html += content;
    } else {
      this.html += escapeString(content, false);
    }
  }

  _serializeCommentNode(node: HtmlComment) {
    this.html += `<!--${node.data}-->`;
  }
}

function escapeString(str: string, attrMode?: boolean) {
  str = str.replace(AMP_REGEX, '&amp;').replace(NBSP_REGEX, '&nbsp;');

  if (attrMode) {
    str = str.replace(DOUBLE_QUOTE_REGEX, '&quot;');
  } else {
    str = str.replace(LT_REGEX, '&lt;').replace(GT_REGEX, '&gt;');
  }

  return str;
}

export function serialize(node: SerializerNode) {
  const serializer = new Serializer(node);
  return serializer.serialize();
}
