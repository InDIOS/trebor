import { genEvent } from './events';
import { genBind } from './bindings';
import { Attribute } from '../types.d';
import { BlockAreas, NodeElement } from '../utilities/classes';
import { genShow, genDirective, genModel, genRefs } from './directives';

export function genSetAttrs(target: string, node: NodeElement, scope: string, areas: BlockAreas) {
	let res = '';
	sortAttrs(node.attributes).forEach(({ key, value }) => {
		if (key === '$show') {
			genShow(target, node, areas, scope);
		} else if (key.split('.')[0] === '$model') {
			genModel(target, node, areas, scope);
		} else if (key[0] === '$') {
			genDirective(target, key.slice(1), value, areas, scope);
		} else if (key[0] === '@') {
			genEvent(target, key.slice(1), value, areas, scope);
		} else if (key[0] === ':') {
			const type = node.getAttribute('type');
			const classes = node.getAttribute('class');
			if (node.hasAttribute('class') && key.slice(1) === 'class') node.removeAttribute('class');
			genBind(target, key.slice(1), value, areas, scope, type || null, classes || null);
		} else if (key === 'refs') {
			genRefs(scope, areas, value, target);
		} else {
			res += `_$sa(${target}, '${key}', ${value ? `'${value}'` : `''`});`;
		}
	});
	return res;
}

function sortAttrs(attrs: Attribute[]) {
	return attrs.sort((a, b) => {
		if (/^[$@:]|refs/.test(a.key) && !/^[$@:]|refs/.test(b.key)) {
			return -1;
		}
		if (!/^[$@:]|refs/.test(a.key) && /^[$@:]|refs/.test(b.key)) {
			return 1;
		}
		return 0;
	});
}