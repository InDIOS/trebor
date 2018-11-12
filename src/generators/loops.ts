import { ctx } from '../utilities/context';
import { genBlockAreas, genBody } from './commons';
import { getVarName, filters } from '../utilities/tools';
import { NodeElement, BlockAreas } from '../utilities/classes';

export function genForItem(node: NodeElement, areas: BlockAreas, scope: string) {
  areas.loops = areas.loops + 1;
  let params = scope.split(', ');
  scope = params.shift();
  const value = node.getAttribute('$for');
  node.removeAttribute('$for');
  const parent = node.parentElement;
  let root = parent.dymTag ? parent.dymTag : parent.varName;
  const anchor = getVarName(areas.variables, `loopAnchor_${areas.loops}`);
  areas.unmount.push(`_$append(${root || '_$frag'}, ${anchor});`);
  const loopBlock = `loopBlock_${areas.loops}`;
  let [vars, variable] = value.split(' in ');
  const [key, val, index] = vars.split(',').map(v => v.replace(/[()]/g, '').trim());
  let [asNumber, ...rest] = variable.split('\|');
  let [start, end] = asNumber.split('..');
	let globs = `${params.length ? `, ${params.join(', ')}` : ''}`;
	let fglobs = `${params.length ? `, ${params.filter(p => (p !== '_$i' && p !== '_$v')).join(', ')}` : ''}`;
  if (!isNaN(+start)) {
    let length = (+end || 0) - (+start);
    let array = [...Array(length > 0 ? length : -length)].map((_, i) => end ? i + (+start) : i);
    variable = [`[${array.join(', ')}]`, ...rest].join('|');
  }
  variable = ctx(filters(scope, variable), scope, areas.globals.concat(params));
  areas.variables.push(loopBlock);
	areas.extras.push(`${loopBlock} = _$forLoop(${scope}, ${variable}, itemLoop_${areas.loops}${fglobs});
  ${anchor} = _$text();`);
  areas.outer.push(genLoopItem(`${scope}${globs}`, node, key, val, index, areas));
  areas.create.push(`${loopBlock}.$create();`);
  areas.unmount.push(`${loopBlock}.$mount(${root || '_$frag'}, ${anchor});`);
	areas.update.push(`${loopBlock}.$update(${scope}, ${variable}${fglobs});`);
  areas.destroy.push(`${loopBlock}.$destroy();`);
}

function genLoopItem(scope: string, node: NodeElement, variable: string, value: string, index: string, areas: BlockAreas) {
  const subareas: BlockAreas = new BlockAreas(areas.loops, areas.conditions);
  const loop = `itemLoop_${areas.loops}`;
  let params: string[] = [];
  [scope, ...params] = scope.split(', ');
	subareas.globals.push(variable);
	value && subareas.globals.push(value);
	index && subareas.globals.push(index);
  subareas.globals.push(...params);
	scope = [...new Set([scope, variable, value || '_$v', index || '_$i', ...params])].join(', ');
  const tag = node.tagName;
  if (tag === 'template') {
    node.appendChild(node.content);
  }
  subareas.variables.push('_$frag');
  subareas.extras.push('_$frag = _$docFragment();');
  node.isBlock = true;
	let item = genBlockAreas(node, subareas, scope.replace(', _$v', '').replace(', _$i', ''));
  delete node.isBlock;
  areas.loops = subareas.loops;
  areas.conditions = subareas.conditions;
  if (tag === 'template') {
		subareas.create.unshift(`${item} = _$docFragment();`);
  }
  item && subareas.unmount.push(`_$append(_$frag, ${item});`);
  subareas.mount.push('_$append(_$select(parent), _$frag, _$select(sibling));');
  return genBody(loop, scope, subareas);
}