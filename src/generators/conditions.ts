import { ctx } from '../utilities/context';
import { genBlockAreas, genBody } from './commons';
import { getVarName, capitalize } from '../utilities/tools';
import { NodeElement, BlockAreas, Condition } from '../utilities/classes';

export function genIf(node: NodeElement, areas: BlockAreas, scope: string) {
  areas.conditions = areas.conditions + 1;
  const ifCond = ctx(node.getAttribute('$if'), scope.split(',')[0], areas.globals || []);
  const condition: Condition = { ifCond, index: areas.conditions };
  const anchor = getVarName(areas.variables, 'conditionAnchor');
  const block = getVarName(areas.variables, 'conditionBlock');
  const parent = node.parentElement;
	let root = parent.dymTag ? parent.dymTag : parent.varName;
  areas.unmount.push(`_$a(${root || '_$frag'}, ${anchor});`);
  node.removeAttribute('$if');
  areas.outer.push(genItemCondition(scope, node, areas, condition.index, 'if'));
  areas.extras.push(`${anchor} = _$ct();`);
  areas.create.push(`${block} = condition_${condition.index}(${scope});`);
  if (node.nextElementSibling) {
    if (node.nextElementSibling.hasAttribute('$else-if')) {
      genElseIf(scope, node.nextElementSibling, condition, areas);
    }
    if (node.nextElementSibling.hasAttribute('$else')) {
      const sibling = node.nextElementSibling;
      condition.elseCond = condition.elseCond || true;
      sibling.removeAttribute('$else');
      areas.outer.push(genItemCondition(scope, sibling, areas, condition.index, 'else'));
      parent.removeChild(sibling);
    }
  }
  parent.removeChild(node);
  areas.outer.push(genCondition(scope, condition, condition.index));
  areas.create.push(`${block}.$create();`);
	areas.unmount.push(`${block}.$mount(${root || '_$frag'}, ${anchor});`);
  areas.update.push(`${block} = _$cu(${block}, condition_${condition.index}, ${root}, ${anchor}, ${scope});`);
  areas.destroy.push(`${block}.$destroy();`);
}

function genElseIf(scope: string, node: NodeElement, condition: Condition, areas: BlockAreas) {
  const elseifCond = ctx(node.getAttribute('$else-if'), scope, []);
  condition.elseIfConds = condition.elseIfConds || [];
  condition.elseIfConds.push(elseifCond);
  node.removeAttribute('$else-if');
  areas.outer.push(genItemCondition(scope, node, areas, condition.index, `elseIf_${condition.elseIfConds.length}`));
  if (node.nextElementSibling.hasAttribute('$else-if')) {
    genElseIf(scope, node.nextElementSibling, condition, areas);
  }
  node.parentElement.removeChild(node);
}

function genItemCondition(scope: string, node: NodeElement, areas: BlockAreas, index: number, type?: string) {
  const subareas: BlockAreas = new BlockAreas(areas.loops, areas.conditions);
  subareas.globals = areas.globals;
  subareas.variables.push('_$frag');
  subareas.extras.push('_$frag = _$d();');
  node.isBlock = true;
  let condition = genBlockAreas(node, subareas, scope);
  delete node.isBlock;
  areas.loops = subareas.loops;
  areas.conditions = subareas.conditions;
  const tag = node.tagName;
  if (condition) {
		tag === 'template' && subareas.create.unshift(`${condition} = _$d();`);
    subareas.unmount.push(`_$a(_$frag, ${condition});`);
  }
  subareas.mount.push('_$a(_$(parent), _$frag, _$(sibling));');
  const condType = type ? type : 'else';
  const condName = type.includes('elseIf') ? '_condition' : capitalize('condition');
  return genBody(`${condType}${condName}_${index}`, scope, subareas, condType);
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
		condition += `else return _$emptyElse();`;
  }
  condition += '}';
  return condition;
}
