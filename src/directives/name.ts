import eventAttr from '../attributes/event';
import bindAttr from '../attributes/binding';
import { Element } from '../parsers/html/element';
import { Segments } from '../parsers/script/segments';

export default function nameDirective(node: Element, group: string, segmts: Segments) {
  const type = node.getAttribute('type');
  if (/checkbox|radio/.test(type) && node.tagName === 'input') {
    const { varName } = node;
    let bindExp = '', eventExp = '';
    segmts.addImport('trebor/tools', '_$attr');
    if (type === 'checkbox') {
      this.tools = tools;
      segmts.globalTools.push('_$bindGroup', '_$attr', varName);
      eventExp = `_$bindGroup($el, ${group})`;
      bindExp = `!!~${group}.indexOf(_$attr(${varName}))`;
    } else {
      segmts.globalTools.push('_$attr', varName);
      eventExp = `${group} = $el.checked ? _$attr($el) : ${group}`;
      bindExp = `${group} === _$attr(${varName})`;
    }
    bindAttr(node, 'checked', bindExp, segmts);
    eventAttr(node, 'change', eventExp, segmts);
  } 
}

const tools = `function _$bindGroup(input, selection) {
  const _value = _$attr(input);
  const index = selection.indexOf(_value);
  if (input.checked && !~index) {
    selection.push(_value);
  } else {
    selection.splice(index, 1);
  }
}`;
