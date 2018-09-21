import { ctx } from '../utilities/context';
import { genBlockAreas, genBody } from './commons';
import { NodeElement, BlockAreas } from '../utilities/classes';
import { getVarName, filterParser } from '../utilities/tools';

export function genForItem(node: NodeElement, areas: BlockAreas, scope: string) {
  areas.loops = areas.loops + 1;
  let params = scope.split(', ');
  scope = params.shift();
  const value = node.getAttribute('$for');
  node.removeAttribute('$for');
  const parent = node.parentElement;
	let root = parent.dymTag ? parent.dymTag : parent.varName;
  const anchor = getVarName(areas.variables, `loopAnchor_${areas.loops}`);
  areas.unmount.push(`_$a(${root || '_$frag'}, ${anchor});`);
  const loopBlock = `loopBlock_${areas.loops}`;
  let [vars, variable] = value.split(' in ');
  const [key, val] = vars.split(',').map(v => v.replace(/[()]/g, '').trim());
  let [asNumber, ...rest] = variable.split('\|');
  let [start, end] = asNumber.split('..');
  let globs = `${params.length ? `, ${params.join(', ')}` : ''}`;
  let fglobs = `${params.length ? `, ${params.filter(p => p !== '_$index').join(', ')}` : ''}`;
  if (!isNaN(+start)) {
    let length = (+end || 0) - (+start);
    let array = [...Array(length > 0 ? length : -length)].map((_, i) => end ? i + (+start) : i);
    variable = [`[${array.join(', ')}]`, ...rest].join('|');
  }
  variable = ctx(filterParser(variable), scope, areas.globals.concat(params));
  areas.variables.push(loopBlock);
  areas.extras.push(`${loopBlock} = _$f(${scope}, ${variable}, itemLoop_${areas.loops}${fglobs});
  ${anchor} = _$ct();`);
  areas.outer.push(genLoopItem(`${scope}${globs}`, node, key, val, areas));
  areas.create.push(`${loopBlock}.$create();`);
  areas.unmount.push(`${loopBlock}.$mount(${root || '_$frag'}, ${anchor});`);
  areas.update.push(`${loopBlock}.$update(${scope}, ${variable}${fglobs});`);
  areas.destroy.push(`${loopBlock}.$destroy();`);
}

function genLoopItem(scope: string, node: NodeElement, variable: string, index: string, areas: BlockAreas) {
  const subareas: BlockAreas = new BlockAreas(areas.loops, areas.conditions);
  const loop = `itemLoop_${areas.loops}`;
  let params: string[] = [];
  [scope, ...params] = scope.split(', ');
  subareas.globals.push(variable);
  index && subareas.globals.push(index);
  subareas.globals.push(...params);
  scope = [...new Set([scope, variable, index || '_$index', ...params])].join(', ');
  const tag = node.tagName;
  if (tag === 'template') {
    node.appendChild(node.content);
  }
  subareas.variables.push('_$frag');
  subareas.extras.push('_$frag = _$d();');
  node.isBlock = true;
  let item = genBlockAreas(node, subareas, scope);
  delete node.isBlock;
  areas.loops = subareas.loops;
  areas.conditions = subareas.conditions;
  if (tag === 'template') {
    subareas.create.unshift(`${item} = _$d();`);
  }
  item && subareas.unmount.push(`_$a(_$frag, ${item});`);
  subareas.mount.push('_$a(_$(parent), _$frag, _$(sibling));');
  return genBody(loop, scope, subareas);
}