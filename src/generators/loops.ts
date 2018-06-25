import { ctx } from '../utilities/context';
import { genBlockAreas, genBody } from './commons';
import { NodeElement, BlockAreas } from '../utilities/classes';
import { getParent, getVarName, filterParser } from '../utilities/tools';

export function genForItem(node: NodeElement, areas: BlockAreas, scope: string) {
	areas.loops = typeof areas.loops === 'number' ? areas.loops + 1 : 1;
	[scope] = scope.split(', ');
	const value = node.getAttribute('$for');
	node.removeAttribute('$for');
  const parent = node.parentElement;
  let root = parent['dymTag'] ? parent['dymTag'] : getParent(areas.variables, parent.tagName);
	const anchor = getVarName(areas.variables, `loopAnchor_${areas.loops}`);
  areas.unmount.push(`_$a(${root || '_$frag'}, ${anchor});`);
	const loopBlock = `loopBlock_${areas.loops}`;
	let [vars, variable] = value.split(' in ');
  const [key, val] = vars.split(',').map(v => v.replace(/[()]/g, '').trim());
  let [asNumber, ...rest] = variable.split('\|');
  let [start, end] = asNumber.split('..');
  if (!isNaN(+start)) {
    let length = (+end || 0) - (+start);
    let array = [...Array(length > 0 ? length : -length)].map((_, i) => end ? i + (+start) : i);
    variable = [`[${array.join(', ')}]`, ...rest].join('|');
  }
	variable = ctx(filterParser(variable), scope, areas.globals);
	areas.variables.push(loopBlock);
	areas.outer.push(genLoopItem(scope, node, key, val, areas));
  areas.extras.push(`${loopBlock} = _$f(${scope}, ${variable}, itemLoop_${areas.loops});
  ${anchor} = _$ct();`);
	areas.create.push(`${loopBlock}.$create();`);
	areas.unmount.push(`${loopBlock}.$mount(${root || '_$frag'}, ${anchor});`);
	areas.update.push(`${loopBlock}.$update(${scope}, ${variable});`);
	areas.destroy.push(`${loopBlock}.$destroy();`);
}

function genLoopItem(scope: string, node: NodeElement, variable: string, index: string, areas: BlockAreas) {
	const subareas: BlockAreas = new BlockAreas();
	const loop = `itemLoop_${areas.loops}`;
	subareas.loops = areas.loops;
	subareas.conditions = areas.conditions;
	subareas.globals.push(variable);
	if (index) {
		subareas.globals.push(index);
		index = `, ${index}`;
	} else {
		index = '';
	}
	scope = `${scope}, ${variable}${index}`;
	let item;
	const tag = node.tagName;
	if (tag === 'template') {
		node.appendChild(node.content);
	}
	subareas.variables.push('_$frag');
	subareas.extras.push('_$frag = _$d();');
	item = genBlockAreas(node, subareas, scope);
	if (tag === 'template') {
		subareas.create.splice(0, 1, `${item} = _$d();`);
	}
	if (item) {
		subareas.unmount.push(`_$a(_$frag, ${item});`);
	}
	subareas.mount.push('_$a(_$(parent), _$frag, _$(sibling));');
	return genBody(loop, scope, subareas);
}