import ctx from './context';
import { Segments } from './segments';
import componentTpl from './templates';
import { Element } from '../html/element';
import parseComponent from '../../component';
import parseDirective from './parseDirective';
import { serialize } from '../html/serializer';
import { AllHtmlEntities } from 'html-entities';
import processEvent from '../../attributes/event';
import { processSlot } from '../../component/slot';
import processBinding from '../../attributes/binding';
import processReference from '../../attributes/reference';
import { callExpression, assignmentExpression, literal } from './nodes';
import { capitalize, each, filters, parseTextExpression, filterPlaceholders } from '../../utils';

const entities = new AllHtmlEntities();

function getChildExp(parent: string, childIndex = 0) {
  return callExpression('_$child', childIndex ? [parent, literal(childIndex)] : [parent]);
}

function hasSpecialAttrs(element: Element, specials: string[]) {
  return specials.some(attr => element.hasAttribute(`$${attr}`));
}

function isExpAttr(attr: { name: string }) {
  return /^[$@:#]/.test(attr.name);
}

function toNodeWithoutExp(element: Element) {
  const node = Object.create(null);
  node.nodeName = element.tagName;
  if (element.nodeType === 1) {
    node.tagName = element.tagName;
  }
  if (element.hasExpression(false)) {
    if (element.nodeType === 1) {
      if (hasSpecialAttrs(element, specialAttrs) || element.isUnknownElement) {
        node.nodeName = '#comment';
        delete node.tagName;
        node.data = '';
      } else {
        if (node.tagName === 'slot') {
          node.nodeName = '#text';
          delete node.tagName;
          node.value = '';
        } else {
          node.attrs = element.attributes.filter(attr => !isExpAttr(attr));
        }
      }
    } else {
      node.value = ' ';
    }
  } else {
    if (element.nodeType === 8) {
      node.data = element.textContent;
    } else if (element.nodeType === 3) {
      node.value = entities.decode(element.textContent);
    } else {
      node.attrs = element.attributes;
    }
  }
  node.childNodes = hasSpecialAttrs(element, nonWalkAttrs) ? [] : element.childNodes.map(toNodeWithoutExp);
  return node;
}

function htmlWihtoutExp(element: { childNodes: Element[] }) {
  const childNodes = element.childNodes.map(el => toNodeWithoutExp(el));
  const node = { nodeName: '#document', childNodes, tagName: '', attrs: [], parentNode: null };
  const html = serialize(node);
  return html.split('<!---->');
}

function parseAttrs(node: Element, segmts: Segments) {
  const { varName, attributes } = node;
  if (!attributes.length) {
    return;
  }
  const attrs = attributes.filter(attr => isExpAttr(attr));
  if (attrs.length) {
    each(attrs, ({ name, value }) => {
      const [type, attr] = [name[0], name.slice(1)];
      switch (type) {
        case '$':
          throw new Error(`Directive '${attr}' is not registered.`);
        case ':':
          processBinding(node, attr, value, segmts);
          break;
        case '@':
          processEvent(node, attr, value, segmts);
          break;
        case '#':
          processReference(varName, attr, segmts);
          break;
        default: {
          throw new Error(`Unknown pattern '${type}' on attribute ${name}.`);
        }
      }
    });
  }
}

function parseTextNode(node: Element, parentVarName: string, text: string, index: number, segmts: Segments) {
  const { varName } = node;
  const setText = `_$set${capitalize(varName, 2)}`;
  segmts.addImport('trebor/tools', '_$updateTxt');
  const params = filterPlaceholders([...segmts.globals]);
  const textUpdateCall = callExpression('_$updateTxt', [varName, callExpression(setText, params)]);
  const code = <string>parseTextExpression(text, exp => filters(exp, segmts));
  segmts.init.push(setText);
  segmts.extras.add(`${setText} = (${params.join(', ')}) => ${ctx(code, segmts.globals, segmts.globalTools)};`);
  segmts.create.add(assignmentExpression(varName, getChildExp(parentVarName, index)));
  segmts.update.add(textUpdateCall);
  segmts.unmount.add(textUpdateCall);
}

function parseNode(node: Element, index: number, segmts: Segments, parentVarName = '_$tpl') {
  if (node.hasExpression()) {
    const type = node.nodeType;
    if (type === 1 || type === 3) {
      if (node.isUnknownElement || node.tagName === 'slot') {
        const func = node.tagName === 'slot' ? processSlot : parseComponent;
        func(node, segmts, parentVarName, createTpl, index);
      } else {
        const varName = node.varName = segmts.addVar(type === 1 ? node.tagName : 'txt');
        if (type === 3) {
          parseTextNode(node, parentVarName, node.textContent.trim(), index, segmts);
        } else {
          segmts.create.add(assignmentExpression(varName, getChildExp(parentVarName, index)));
          const walkChildren = !hasSpecialAttrs(node, nonWalkAttrs);
          parseDirective(node, segmts, parentVarName, createTpl);
          if (walkChildren) {
            parseAttrs(node, segmts);
            each(node.childNodes, (child, i) => parseNode(child, i, segmts, varName));
          }
        }
      }
    }
  }
}

let specialAttrs: string[] = [];
let nonWalkAttrs: string[] = [];

export function setSpecialAttrs(specials: string[]) {
  specialAttrs = specialAttrs.concat(specials);
}

export function setNonWalkAttrs(nonWalk: string[]) {
  nonWalkAttrs = nonWalkAttrs.concat(nonWalk);
}

export { Segments };

export default function createTpl(nodes: Element[], segmts: Segments, tplName?: string, varName?: string) {
  let realIndex = 0;
  let content = [''];
  const { length } = nodes;
  each(nodes, (node, index) => {
    const html = htmlWihtoutExp({ childNodes: [node] });
    if (html.length === 1) {
      content[content.length - 1] += html[0];
    } else {
      content[content.length - 1] += html.shift();
      content = content.concat(html);
    }
    segmts.addImport('trebor/tools', '_$child');
    realIndex = length !== nodes.length ? realIndex + 1 : index;
    parseNode(node, realIndex, segmts, varName);
  });
  return tplName ? componentTpl(tplName, segmts, content) : content.join(`','`);
}
