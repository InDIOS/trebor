import { ctx } from '../utilities/context';
import { genBlockAreas, genBody } from './commons';
import { NodeElement, BlockAreas, Condition } from '../utilities/classes';
import { getVarName, getParent, createElement, capitalize } from '../utilities/tools';

export function genIf(node: NodeElement, areas: BlockAreas, scope: string) {
  const ifCond = ctx(node.getAttribute('$if'), scope.split(',')[0], areas.globals || []);
  const condition: Condition = { ifCond };
  const anchor = getVarName(areas.variables, 'conditionAnchor');
  const block = getVarName(areas.variables, 'conditionBlock');
  const parent = node.parentElement;
  let root = parent['dymTag'] ? parent['dymTag'] : getParent(areas.variables, parent.tagName);
  areas.unmount.push(`_$a(${root || '_$frag'}, ${anchor});`);
  node.removeAttribute('$if');
  areas.conditions.push(condition);
  areas.outer.push(genItemCondition(scope, node, areas, 'if'));
  areas.extras.push(`${anchor} = _$ct();`);
  areas.create.push(`${block} = condition_${areas.conditions.length}(${scope});`);
  if (node.nextElementSibling.hasAttribute('$else-if')) {
    genElseIf(scope, node.nextElementSibling, condition, areas);
  }
  if (node.nextElementSibling.hasAttribute('$else')) {
    const sibling = node.nextElementSibling;
    condition.elseCond = condition.elseCond || true;
    sibling.removeAttribute('$else');
    areas.outer.push(genItemCondition(scope, sibling, areas, 'else'));
    parent.removeChild(sibling);
  }
  parent.removeChild(node);
  areas.outer.push(genCondition(scope, condition, areas.conditions.length));
  areas.create.push(`${block}.$create();`);
  areas.unmount.push(`${block}.$mount(${root || '_$frag'}, ${anchor});`);
  areas.update.push(genConditionUpdate(scope, root || '_$frag', block, anchor, areas.conditions.length));
  areas.destroy.push(`${block}.$destroy();`);
}

function genElseIf(scope: string, node: NodeElement, condition: Condition, areas: BlockAreas) {
  const elseifCond = ctx(node.getAttribute('$else-if'), scope, []);
  condition.elseIfConds = condition.elseIfConds || [];
  condition.elseIfConds.push(elseifCond);
  node.removeAttribute('$else-if');
  areas.outer.push(genItemCondition(scope, node, areas, `elseIf_${condition.elseIfConds.length}`));
  if (node.nextElementSibling.hasAttribute('$else-if')) {
    genElseIf(scope, node.nextElementSibling, condition, areas);
  }
  node.parentElement.removeChild(node);
}

function genItemCondition(scope: string, node: NodeElement, areas: BlockAreas, type?: string) {
  const subareas: BlockAreas = new BlockAreas();
  subareas.globals = areas.globals;
  subareas.conditions = areas.conditions;
  subareas.variables.push('_$frag');
  subareas.extras.push('_$frag = _$d();');
  node['isCondition'] = true;
  let condition = <string>genBlockAreas(node, subareas, scope);
  delete node['isCondition'];
  const tag = node.tagName;
  if (condition) {
    if (tag === 'template') {
      subareas.create.unshift(`${condition} = _$d();`);
    } else {
      subareas.create.unshift(createElement(condition, tag));
    }
    subareas.unmount.push(`_$a(_$frag, ${condition});`);
  }
  subareas.mount.push('_$a(_$(parent), _$frag, _$(sibling));');
  const condType = type ? type : 'else';
  const condName = type.includes('elseIf') ? '_condition' : capitalize('condition');
  return genBody(`${condType}${condName}_${subareas.conditions.length}`, scope, subareas, condType);
}

function genCondition(scope: string, { ifCond, elseIfConds, elseCond }: Condition, count: number) {
  const funcName = `condition_${count}`;
  let condition = `function ${funcName}(${scope}) {`;
  if (ifCond) {
    condition += `if (${ifCond}) return if${capitalize(funcName)}(${scope});`;
  }
  if (elseIfConds) {
    for (let i = 0; i < elseIfConds.length; i++) {
      const elseIfCond = elseIfConds[i];
      condition += `else if (${elseIfCond}) return elseIf_${i + 1}_${funcName}(${scope});`;
    }
  }
  if (elseCond) {
    condition += `else return else${capitalize(funcName)}(${scope});`;
  } else {
    condition += `else return {
			type: 'empty-else', $create: _$noop, $mount: _$noop, $update: _$noop, $destroy: _$noop
		};`;
  }
  condition += '}';
  return condition;
}

function genConditionUpdate(scope: string, root: string, block: string, anchor: string, cond: number) {
  return `if (${block} && ${block}.type === condition_${cond}(${scope}).type) {
		${block}.$update(${scope});
	} else {
		${block} && ${block}.$destroy();
		${block} = condition_${cond}(${scope});
		${block}.$create();
		${block}.$mount(${root}, ${anchor});
	}`;
}