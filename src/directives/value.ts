import eventAttr from '../attributes/event';
import bindAttr from '../attributes/binding';
import { Element } from '../parsers/html/element';
import { Segments } from '../parsers/script/segments';

export default function valueDirective(node: Element, expression: string, segmts: Segments) {
  let exp = '';
  let event = '';
  let attr = 'value';
  const { varName } = node;
  const type = node.getAttribute('type');
  const isMultiSelect = /select/.test(node.tagName) && node.hasAttribute('multiple');
  if (/input|select|textarea/.test(node.tagName) && !/checkbox|radio/.test(type)) {
    event = /date|file/.test(type) || node.tagName === 'select' ? 'change' : 'input';
    exp = getExpresion.call(this, varName, expression, type, isMultiSelect, segmts);
  } else if (node.tagName === 'input' && /checkbox|radio/.test(type)) {
    attr = 'checked';
    event = 'change';
    exp = `${expression} = $el.checked`;
  } else {
    event = `update_${attr}`;
    exp = `${expression} = $event`;
  }
  eventAttr(node, event, exp, segmts);
  bindAttr(node, attr, expression, segmts);
}

const tools = `function _$updateMultiSelect(select, component, prop) {
  const items = [];
  const selection = component[prop];
  const selectedOptions = select.selectedOptions;
  _$each([...selectedOptions], option => items.push(_$attr(option)))
  component[prop] = new List(items, selection._root, selection._key);
  component.$update();
}`;

function getExpresion(varName: string, expression: string, type: string, isMultiSelect: boolean, segmts: Segments) {
  let exp = '';
  if (isMultiSelect) {
    this.tools = tools;
    exp = `_$updateMultiSelect(${varName}, _$ctx, '${expression}')`;
    segmts.globalTools.push('_$updateMultiSelect');
  } else {
    exp = `${expression} = ${/number|range/.test(type) ? '+' : ''}$el.value`;
  }
  return exp;
}
