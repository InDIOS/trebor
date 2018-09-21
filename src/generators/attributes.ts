import { Attribute } from 'parse5';
import { genEvent } from './events';
import { genBind } from './bindings';
import { kebabToCamelCases } from '../utilities/tools';
import { BlockAreas, NodeElement } from '../utilities/classes';
import { genShow, genDirective, genValue, genName, genRefs } from './directives';

export function genSetAttrs(target: string, node: NodeElement, scope: string, areas: BlockAreas) {
	let res = '';
  sortAttrs(node.attributes).forEach(({ name, value }) => {
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
			res += `_$sa(${target}, '${attr}', ${value ? `'${value}'` : `''`});`;
		}
	});
	return res;
}

function sortAttrs(attrs: Attribute[]) {
  let attrRegExp = /^[$@:#]/;
	return attrs.sort((a, b) => {
		if (attrRegExp.test(a.name) && !attrRegExp.test(b.name)) {
			return -1;
		}
		if (!attrRegExp.test(a.name) && attrRegExp.test(b.name)) {
			return 1;
		}
		return 0;
	});
}