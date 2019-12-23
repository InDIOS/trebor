import { Element } from '../parsers/html/element';
import { snakeToCamel, capitalize } from '../utils';
import { Segments } from '../parsers/script/segments';
import {
  Identifier, CallExpression, ExpressionStatement, ArrayExpression
} from '../parsers/script/estree';
import {
  callExpression, literal, assignmentExpression, memberExpression, arrayExpression, isCallExpression,
  isExpressionStatement
} from '../parsers/script/nodes';
import Parser from '../parsers/script';
import ctx from '../parsers/script/context';
import { generate } from '../parsers/script/generator';
import { expression } from '../parsers/script/context/expression';

export function processSlot(node: Element, segmts: Segments, parentVarName: string, parser: Parser) {
  const slot = `_$slots`;
  const init = assignmentExpression(slot, memberExpression('_$ctx', '$slots'));
  const isDinamycName = node.hasAttribute(':name');
  let slotExp = node.getAttribute(`${isDinamycName ? ':' : ''}name`) || 'default';
  const slotAttr = <ExpressionStatement>expression(isDinamycName ? ctx(slotExp, segmts.globals, segmts.globalTools) : `'${slotExp}'`);
  const dec = '_$declareSlots';
  const slotName =  generate(slotAttr);
  const slotDec = memberExpression(slot, slotAttr.expression, true);
  if (!segmts.extras.includes(init)) {
    segmts.init.push(slot);
    segmts.extras.add(init);
  }
  let decl = <ExpressionStatement>segmts.extras.find(stmt => {
    if (isExpressionStatement(stmt) && isCallExpression(stmt.expression)) {
      return (<Identifier>stmt.expression.callee).name === dec;
    }
    return false;
  });
  if (decl) {
    (<ArrayExpression>(<CallExpression>decl.expression).arguments[1]).elements.push(slotAttr.expression);
  } else {
    segmts.addImport('trebor/tools', dec);
    segmts.extras.add(callExpression(dec, [slot, arrayExpression([slotAttr.expression])]));
  }
  node.parentElement.removeChild(node);
  const appendSlots = callExpression('_$appendSlots', [slot, parentVarName]);
  let appendSlotsIndex = segmts.unmount.index(appendSlots);
  if (!~appendSlotsIndex) {
    segmts.addImport('trebor/tools', '_$appendSlots');
    segmts.unmount.add(appendSlots);
    appendSlotsIndex = 0;
  }
  const html = parser.parse(node.childNodes, segmts, null, <string>generate(slotDec));
  segmts.addImport('trebor/tools', '_$initSlot');
  segmts.unmount.insert(`_$initSlot(${slot}, ${slotName}, ['${html}'])`, appendSlotsIndex);
}

export function processElementSlot(node: Element, segmts: Segments, component: string, parser: Parser) {
  const type = node.nodeType;
  if (type !== 8) {
    const slotName = node.getAttribute('slot') || 'default';
    node.removeAttribute('slot');
    const slotVar = `${snakeToCamel(slotName)}${capitalize(component.replace('_$', ''))}`;
    const init = assignmentExpression(slotVar, callExpression('_$emptySlot', [component, literal(slotName)]));
    if (!segmts.extras.includes(init)) {
      segmts.extras.add(init);
      segmts.init.push(slotVar);
      segmts.addImport('trebor/tools', '_$emptySlot');
    }
    const slot = segmts.addVar(type === 1 ? node.tagName : 'txt');
    const _node = node.tagName === 'template' ? node : { childNodes: [node] };
    const html = parser.parse(_node.childNodes, segmts, null, slot);
    segmts.addImport('trebor/tools', '_$setSlotContent');
    segmts.unmount.add(`_$setSlotContent(${slotVar}, ['${html}']);`);
  }
}

module.exports = { processSlot, processElementSlot };