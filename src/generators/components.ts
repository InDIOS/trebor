import { genBlockAreas } from './commons';
import { ctx } from '../utilities/context';
import { genDirective } from './directives';
import { NodeElement, BlockAreas } from '../utilities/classes';
import { kebabToCamelCases, getVarName, getParent, capitalize, createElement } from '../utilities/tools';

export function genSlot(node: NodeElement, areas: BlockAreas, scope: string) {
	const slotName = node.getAttribute('name') || 'default';
	const slot = `${scope.split(', ')[0]}.$slots['${slotName}']`;
	areas.extras.push(`${slot} = _$d();`);
	const roots: string[] = [];
	node.childNodes.forEach(n => {
		const el = genBlockAreas(n, areas, scope);
		if (el) {
			roots.push(el);
			areas.create.push(`_$a(${slot}, ${el});`);
		}
	});
	let root = getParent(areas.variables, node.parentElement.tagName);
	if (!root) root = 'frag';
	areas.mount.push(`_$a(${root}, ${slot});`);
}

export function genComponent(node: NodeElement, areas: BlockAreas, scope: string) {
	const tag = node.tagName;
	[scope] = scope.split(', ');
	const varName = kebabToCamelCases(tag);
	const anchor = getVarName(areas.variables, `${varName}Anchor`);
	const variable = getVarName(areas.variables, varName);
	let frag = '';
	let root = getParent(areas.variables, node.parentElement.tagName);
	let attrs = '{';
	const extras: string[] = [];
	node.attributes.forEach(({ key, value }) => {
		if (key[0] === '@') {
			const eventVar = `event${capitalize(kebabToCamelCases(key.slice(1)))}${capitalize(variable)}`;
			areas.variables.push(eventVar);
			extras.push(`${eventVar} = ${variable}.$on('${key.slice(1)}', ${ctx(value, scope, [])});`);
			areas.destroy.push(`${eventVar}.off();`);
		} else if (key[0] === ':') {
			attrs += `${key.slice(1)}() { return ${ctx(value, scope, [])}; },`;
		} else if (key[0] === '$' && !/model|show/.test(key.slice(1))) {
			genDirective(variable, key.slice(1), value, areas, scope);
		} else {
			attrs += `${key}: '${value}'`;
		}
	});
	attrs += '}';
	const init = `const ${capitalize(varName)} = children['${tag}'];`;
	if (!areas.extras.includes(init)) {
		areas.extras.push(init);
	}
	areas.extras.push(`${anchor} = _$ct();`);
	areas.extras.push(`${variable} = new ${capitalize(varName)}(${attrs});`);
	areas.extras = areas.extras.concat(extras);
	if (!root) {
		if (areas.mount[0].includes('_$d()')) {
			frag = 'frag';
		} else {
			root = getVarName(areas.variables, `${varName}Root`);
			areas.mount.push(`${root} = _$(parent);`);
		}
		areas.mount.push(`_$a(${frag || root}, ${anchor});`);
	} else {
		areas.create.push(`_$a(${root}, ${anchor});`);
	}
	node.childNodes.forEach(n => {
		const tag = n.tagName;
		let slot = getVarName(areas.variables, tag);
		if (tag !== 'template') {
			areas.create.push(createElement(slot, tag));
		} else {
			areas.create.push(`${slot} = _$d();`);
			n.appendChild(n.content);
		}
		let slotName = 'default';
		if (n.hasAttribute('slot')) {
			slotName = n.getAttribute('slot') || slotName;
		}
		const slotDec = `${variable}.$slots['${slotName}']`;
		const init = `${slotDec} = _$d();`;
		if (!areas.extras.includes(init)) {
			areas.extras.push(`if (${slotDec} && ${slotDec}.childNodes.length !== 0) {`);
			areas.extras.push(init);
			areas.extras.push('}');
		}
		n.childNodes.forEach(child => {
			const el = genBlockAreas(child, areas, scope);
			if (el) {
				areas.create.push(`_$a(${slot}, ${el});`);
			}
		});
		areas.create.push(`if (${slotDec}) {`);
		areas.create.push(`_$a(${slotDec}, ${slot});`);
		areas.create.push('}');
	});
	areas.mount.push(`${variable}.$mount(${frag || root}, ${anchor});`);
	areas.update.push(`${variable}.$update(${variable});`);
	areas.destroy.push(`${variable}.$destroy();`);
}