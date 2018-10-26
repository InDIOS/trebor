import { Attribute } from 'parse5';
import { genEvent } from './events';
import { genBind } from './bindings';
import { kebabToCamelCases } from '../utilities/tools';
import { BlockAreas, NodeElement } from '../utilities/classes';
import { genShow, genDirective, genValue, genName, genRefs } from './directives';

export function genSetAttrs(target: string, node: NodeElement, scope: string, areas: BlockAreas) {
	const attrs = sortAttrs(node.attributes);
	let { length } = attrs;
	for (let i = 0; i < length; i++) {
		const { name, value } = attrs[i];
		let [attr] = name.split('.');
		if (attr === '$show') {
			genShow(target, node, areas, scope);
		} else if (attr === '$value' || attr === '$name') {
			if (attr === '$value') {
				node.removeAttribute('$name');
				genValue(target, node, areas, scope);
			} else if (!node.hasAttribute('$value') && attr === '$name') {
				genName(target, node, areas, scope);
			}
		} else if (attr[0] === '$') {
			genDirective(target, name.slice(1), value, areas, scope);
		} else if (attr[0] === '@') {
			genEvent(target, name.slice(1), value, areas, scope);
		} else if (attr[0] === ':') {
			const type = node.getAttribute('type');
			const classes = node.getAttribute('class');
			if (node.hasAttribute('class') && attr.slice(1) === 'class') node.removeAttribute('class');
			genBind(target, attr.slice(1), value, areas, scope, type || null, classes || null);
		} else if (attr[0] === '#') {
			genRefs(scope, areas, kebabToCamelCases(name.slice(1)), target);
		} else {
			areas.hydrate.push(`_$sa(${target}, ['${attr}', ${value ? `'${value}'` : `''`}]);`);
		}
		if (length !== attrs.length) {
			i--;
			length = attrs.length;
		}
	}
}

function sortAttrs(attrs: Attribute[]) {
	let attrRegExp = /^[$@:#]/;
	return attrs.sort((a, b) => attrRegExp.test(a.name) && !attrRegExp.test(b.name) ? 1 :
		!attrRegExp.test(a.name) && attrRegExp.test(b.name) ? -1 : 0);
}