import { Element } from './element';
import { toValidate } from '../../utils';

const html5 = toValidate([
  'a', 'abbr', 'acronym', 'address', 'applet', 'area', 'article', 'aside', 'audio', 'b', 'base',
  'basefont', 'bdi', 'bdo', 'bgsound', 'big', 'blink', 'blockquote', 'body', 'br', 'button', 'canvas',
  'caption', 'center', 'cite', 'code', 'col', 'colgroup', 'command', 'content', 'data', 'datalist', 'dd',
  'del', 'details', 'dfn', 'dialog', 'dir', 'div', 'dl', 'dt', 'element', 'em', 'embed', 'fieldset',
  'figcaption', 'figure', 'font', 'footer', 'form', 'frame', 'frameset', 'h1', 'h2', 'h3', 'h4', 'h5',
  'h6', 'head', 'header', 'hgroup', 'hr', 'html', 'i', 'iframe', 'image', 'img', 'input', 'ins',
  'isindex', 'kbd', 'keygen', 'label', 'legend', 'li', 'link', 'listing', 'main', 'map', 'mark',
  'marquee', 'math', 'menu', 'menuitem', 'meta', 'meter', 'multicol', 'nav', 'nextid', 'nobr', 'noembed',
  'noframes', 'noscript', 'object', 'ol', 'optgroup', 'option', 'output', 'p', 'param', 'picture',
  'plaintext', 'pre', 'progress', 'q', 'rb', 'rbc', 'rp', 'rt', 'rtc', 'ruby', 's', 'samp', 'script',
  'section', 'select', 'shadow', 'slot', 'small', 'source', 'spacer', 'span', 'strike', 'strong',
  'style', 'sub', 'summary', 'sup', 'svg', 'table', 'tbody', 'td', 'template', 'textarea', 'tfoot', 'th',
  'thead', 'time', 'title', 'tr', 'track', 'tt', 'u', 'ul', 'var', 'video', 'wbr', 'xmp'
]);

const svg2 = toValidate([
  'a', 'altGlyph', 'altGlyphDef', 'altGlyphItem', 'animate', 'animateColor', 'animateMotion',
  'animateTransform', 'animation', 'audio', 'canvas', 'circle', 'clipPath', 'color-profile', 'cursor',
  'defs', 'desc', 'discard', 'ellipse', 'feBlend', 'feColorMatrix', 'feComponentTransfer', 'feComposite',
  'feConvolveMatrix', 'feDiffuseLighting', 'feDisplacementMap', 'feDistantLight', 'feDropShadow',
  'feFlood', 'feFuncA', 'feFuncB', 'feFuncG', 'feFuncR', 'feGaussianBlur', 'feImage', 'feMerge',
  'feMergeNode', 'feMorphology', 'feOffset', 'fePointLight', 'feSpecularLighting', 'feSpotLight',
  'feTile', 'feTurbulence', 'filter', 'font', 'font-face', 'font-face-format', 'font-face-name',
  'font-face-src', 'font-face-uri', 'foreignObject', 'g', 'glyph', 'glyphRef', 'handler', 'hkern',
  'iframe', 'image', 'line', 'linearGradient', 'listener', 'marker', 'mask', 'metadata', 'missing-glyph',
  'mpath', 'path', 'pattern', 'polygon', 'polyline', 'prefetch', 'radialGradient', 'rect', 'script',
  'set', 'solidColor', 'stop', 'style', 'svg', 'switch', 'symbol', 'tbreak', 'text', 'textArea',
  'textPath', 'title', 'tref', 'tspan', 'unknown', 'use', 'video', 'view', 'vkern'
]);

function nodeTypes(type: string) {
  switch (type) {
    case 'text':
      return 3;
    case 'comment':
      return 8;
    case 'document':
      return 11;
    default:
      return 1;
  }
}

function toNode(element: Element) {
  const node = Object.create(null);
  node.nodeName = element.tagName;
  if (element.nodeType === 1) {
    node.tagName = element.tagName;
    node.attrs = element.attributes;
    node.childNodes = element.childNodes.map(toNode);
  } else if (element.nodeType === 3) {
    node.value = element.textContent;
  } else {
    node.data = element.textContent;
  }
  return node;
}

export { toNode, nodeTypes, svg2, html5 };
