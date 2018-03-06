import { ctx } from '../utilities/context';
import { genBlockAreas, genBody } from './commons';
import { NodeElement, BlockAreas } from '../utilities/classes';
import { getParent, getVarName, filterParser } from '../utilities/tools';

export function genForItem(node: NodeElement, areas: BlockAreas, scope: string) {
	areas.loops = typeof areas.loops === 'number' ? areas.loops + 1 : 1;
	[scope] = scope.split(', ');
	const value = node.getAttribute('$for');
	node.removeAttribute('$for');
	let root = getParent(areas.variables, node.parentElement.tagName);
	const anchor = getVarName(areas.variables, `loopAnchor_${areas.loops}`);
	let frag = '';
	if (!root) {
		root = getVarName(areas.variables, 'loopRoot');
		if (areas.mount[0].includes('_$d()')) {
			frag = 'frag';
		}
		areas.mount.push(`${root} = _$(parent);`);
		areas.mount.push(`_$a(${frag || root}, ${anchor});`);
	} else {
		areas.create.push(`_$a(${root}, ${anchor});`);
	}
	const loopBlock = `loopBlock_${areas.loops}`;
	let [vars, variable] = value.split(' in ');
	const [key, val] = vars.split(',').map(v => v.replace(/[()]/g, '').trim());
	variable = ctx(filterParser(variable), scope, areas.globals);
	areas.variables.push(loopBlock);
	areas.outer.push(genLoopItem(scope, node, key, val, areas));
	areas.extras.push(`${loopBlock} = _$f(${scope}, ${variable}, itemLoop_${areas.loops});`);
	areas.extras.push(`${anchor} = _$ct();`);
	areas.create.push(`${loopBlock}.$create();`);
	areas.mount.push(`${loopBlock}.$mount(${frag || root}, ${anchor});`);
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
	const roots: string[] = [];
	const tag = node.tagName;
	if (tag === 'template') {
		node.appendChild(node.content);
	}
	subareas.mount.push('const frag = _$d();');
	item = genBlockAreas(node, subareas, scope);
	if (tag === 'template') {
		subareas.create.splice(0, 1, `${item} = _$d();`);
	}
	if (item) {
		roots.push(item);
		subareas.mount.push(`_$a(frag, ${item});`);
		subareas.destroy.push(`if (${roots.join(' && ')}) {
			${roots.map(root => `_$r(${root});`).join('\n')}
		}`);
	}
	subareas.mount.push('_$a(_$(parent), frag, _$(sibling));');
	return genBody(loop, scope, subareas);
}