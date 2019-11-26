import { Directive } from './index';
import { Element } from '../parsers/html';
import ctx from '../parsers/script/context';
import { Segments } from '../parsers/script';
import {
  assignmentExpression, callExpression, memberExpression, thisExpression
} from '../parsers/script/nodes';
import { each, replaceItem, replaceVar, capitalize, filterPlaceholders } from '../utils';

interface ConditionExpressions {
  ifExp: string;
  elseExp: boolean;
  elseIfExps: string[];
}

export default function conditionDirective(node: Element, expression: string, segmts: Segments, parentVarName: string) {
  const index = ++segmts.conditions;
  const anchor = `_$conditionAnchor_${index}`;
  const condition = `_$conditionBlock_${index}`;
  replaceItem(segmts.init, node.varName, anchor);
  replaceVar(segmts.create, node.varName, anchor);
  segmts.variables.set(node.tagName, segmts.variables.get(node.tagName) - 1);
  const params = filterPlaceholders([...segmts.globals]);
  segmts.body.add(...createCondition(node, 'if', index, segmts, this));

  const parent = node.parentElement;
  segmts.addImport('trebor/tools', '_$apply');
  segmts.addImport('trebor/tools', '_$slice');
  let sibling = node.nextElementSibling;
  const conditionExp: ConditionExpressions = { ifExp: expression, elseIfExps: [], elseExp: false };
  if (sibling) {
    if (sibling.hasAttribute('$else-if')) {
      alternativeCondition(sibling, segmts, conditionExp, index, this);
    }
    if (node.nextElementSibling.hasAttribute('$else')) {
      const sibling = node.nextElementSibling;
      conditionExp.elseExp = true;
      sibling.removeAttribute('$else');
      segmts.body.add(...createCondition(sibling, 'else', index, segmts, this));
      parent.removeChild(sibling);
    } else {
      segmts.addImport('trebor/tools', '_$noop');
    }
  }

  parent.removeChild(node);
  segmts.init.push(condition);
  segmts.body.add(conditionTpl(conditionExp, index, segmts.globals));
  segmts.extras.add(assignmentExpression(condition, callExpression(`_$condition_${index}`, params)));
  segmts.create.add(callExpression(memberExpression(condition, '$create')));
  segmts.unmount.add(callExpression(memberExpression(condition, '$mount'), [parentVarName, anchor]));
  segmts.update.add(assignmentExpression(condition, callExpression('_$conditionalUpdate', [
    condition, `_$condition_${index}`, anchor, ...params
  ])));
  segmts.destroy.add(callExpression(memberExpression(condition, '$destroy')));
  this.tools = tools;
}

function alternativeCondition(node: Element, segmts: Segments, conditionExp: ConditionExpressions, index: number, directive: Directive) {
  conditionExp.elseIfExps.push(node.getAttribute('$else-if'));
  node.removeAttribute('$else-if');
  let sibling = node.nextElementSibling;
  const condition = `elseIf_${conditionExp.elseIfExps.length}`;
  segmts.body.add(...createCondition(node, condition, index, segmts, directive));
  if (sibling && sibling.hasAttribute('$else-if')) {
    alternativeCondition(sibling, segmts, conditionExp, index, directive);
  }
  node.parentElement.removeChild(node);
}

function createCondition(node: Element, type: string, index: number, segmts: Segments, directive: Directive) {
  const subSegmts = new Segments(segmts);
  const condType = type ? type : 'else';
  const _node = node.tagName === 'template' ? node : { childNodes: [node] };
  const condName = type.includes('elseIf') ? 'Condition' : capitalize('condition');
  subSegmts.globals = new Set(filterPlaceholders([...segmts.globals]));
  subSegmts.destroy.replace(callExpression(memberExpression(thisExpression(), '$unmount')));
  const conditionName = `${condType}${condName}_${index}`;
  const conditionFunc = (<Function>directive.createTpl)(_node.childNodes, subSegmts, conditionName);

  segmts.loops = subSegmts.loops;
  segmts._imports = subSegmts._imports;
  segmts.conditions = subSegmts.conditions;

  return conditionFunc;
}

function conditionTpl({ ifExp, elseIfExps, elseExp }, index: number, parameters: Set<string>) {
  const funcName = `Condition_${index}`;
  const params = filterPlaceholders([...parameters]).join(', ');
  let condition = `function _$${funcName.toLowerCase()}(${params}) {
    let condition = null;
    if (${ctx(ifExp, parameters)}) {
    condition = _$if${funcName}(${params});
    condition.type = 'if';
  }\n`;
  each(elseIfExps, (elseIfCond, i) => {
    condition += `else if (${ctx(elseIfCond, parameters)}) {
      condition = _$elseIf_${i + 1}${funcName}(${params});
      condition.type = 'elseIf_${i + 1}';
    }\n`;
  });
  condition += `else {
    condition = ${elseExp ? `_$else${funcName}(${params})` : '_$emptyElse()'};
    condition.type = 'else';
  }\n`;
  condition += `return condition;\n}`;
  return condition;
}

let tools = `function _$conditionalUpdate(block, condition, anchor) {
  const params = _$slice(arguments, 3);
  if (block && block.type === _$apply(condition, params).type) {
    block.$update(...params);
  } else {
    block && block.$destroy();
    block = _$apply(condition, params);
    block.$create();
    block.$mount(anchor.parentElement || params[0].$parentEl, anchor);
  }
  return block;
}
function _$emptyElse() {
  return { $create: _$noop, $mount: _$noop, $update: _$noop, $destroy: _$noop };
}`;
