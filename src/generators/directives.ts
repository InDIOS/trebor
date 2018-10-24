import { genEvent } from './events';
import { genBind } from './bindings';
import { ctx } from '../utilities/context';
import { genSetAttrs } from './attributes';
import { BlockAreas, NodeElement } from '../utilities/classes';
import { capitalize, getVarName, createElement, camelToKebabCase, kebabToCamelCases } from '../utilities/tools';

export function genValue(target: string, node: NodeElement, areas: BlockAreas, scope: string) {
	const type = node.getAttribute('type');
	const value = node.getAttribute('$value');
	const isMultiSelect = /select/.test(node.tagName) && node.hasAttribute('multiple');
	if (/input|select|textarea/.test(node.tagName) && !/checkbox|radio/.test(type)) {
		const event = /date|file/.test(type) || node.tagName === 'select' ? 'change' : 'input';
    const expression = isMultiSelect ? `_$updateMultiSelect(${target}, ${scope}, '${value}')` :
      `${value} = ${/number|range/.test(type) ? '+' : ''}$el.value`;
		genEvent(target, event, expression, areas, scope);
		genBind(target, 'value', value, areas, scope, isMultiSelect ? 'multiple' : type, null);
	} else if (node.tagName === 'input' && /checkbox|radio/.test(type)) {
		genEvent(target, 'change', `${value} = $el.checked`, areas, scope);
		genBind(target, 'checked', value, areas, scope, type, null);
	} else {
		genEvent(target, `update-${camelToKebabCase(value)}`, `$val => { ${value} = $val }`, areas, scope);
		genBind(target, 'value', value, areas, scope, null, null);
	}
}

export function genName(target: string, node: NodeElement, areas: BlockAreas, scope: string) {
	const type = node.getAttribute('type');
	if (node.tagName === 'input' && /checkbox|radio/.test(type)) {
		const group = node.getAttribute('$name');
		if (type === 'checkbox') {
			genEvent(target, 'change', `_$bindGroup($el, ${group})`, areas, scope);
			genBind(target, 'checked', `!!~${group}.indexOf(_$ga(${target}, 'value'))`, areas, scope, type, null);
		} else if (type === 'radio') {
			genEvent(target, 'change', `${group} = $el.checked ? _$gv($el) : ${group}`, areas, scope);
			genBind(target, 'checked', `${group} === _$ga(${target}, 'value')`, areas, scope, type, null);
		}
	}
}

export function genShow(target: string, node: NodeElement, areas: BlockAreas, scope: string) {
	const funcName = `show${capitalize(target)}`;
	const varDisplay = `display${capitalize(target)}`;
	areas.variables.push(varDisplay);
	areas.update.push(`${funcName}(${scope}, ${target}, ${varDisplay});`);
	areas.outer = areas.outer || [];
	[scope] = scope.split(', ');
	let params = areas.globals && areas.globals.length > 0 ? `, ${areas.globals.join(', ')}` : '';
	const expression = ctx(node.getAttribute('$show'), scope, areas.globals);
	areas.extras.push(`const ${funcName} = (${scope}${params}, el, display) => {
		el.style.display = ${expression} ? display : 'none';
	};`);
	areas.hydrate.push(`${varDisplay} = ${target}.style.display;
	${funcName}(${scope}${params}, ${target}, ${varDisplay});`);
}

export function genHtml(node: NodeElement, areas: BlockAreas, scope?: string) {
	const tag = node.tagName;
	const html = node.getAttribute('$html');
	node.removeAttribute('$html');
	const variable = getVarName(areas.variables, tag);
	areas.create.push(createElement(variable, tag, node.isSVGElement));
	let content = '';
	if (html) {
		const setContent = getVarName(areas.variables, `content${capitalize(variable)}`);
		content = `${setContent}(${scope})`;
		areas.extras.push(`${setContent} = (${scope}) => ${ctx(html, scope.split(', ')[0], areas.globals)};`);
		areas.update.push(`_$hu(${variable}, ${content});`);
	} else {
		content = `'${node.innerHTML}'`;
	}
	genSetAttrs(variable, node, scope, areas);
	areas.create.push(`${variable}.innerHTML = ${content};`);
	return variable;
}

export function genRefs(scope: string, areas: BlockAreas, value: string, target: string) {
	[scope] = scope.split(', ');
	const init = `_refs = ${scope}.$refs;`;
	if (!areas.extras.includes(init)) {
		areas.variables.push('_refs');
		areas.extras.push(`_refs = ${scope}.$refs;`);
	}
	areas.create.push(`_$setRef(_refs, '${value}', ${target});`);
	areas.destroy.push(`_$rr(_refs, '${value}', ${target});`);
}

export function genDirective(target: string, attr: string, value: string, areas: BlockAreas, scope: string) {
	[scope] = scope.split(', ');
	const [directive, ...mods] = attr.split('.');
	const modifs = JSON.stringify(mods.reduce((acc, cur) => (acc[cur] = true, acc), {}));
	const dirtVarName = `${kebabToCamelCases(directive)}Directive`;
	const values = `{
		value: ${ctx(value, scope, areas.globals)},
		expression: '${value.replace(/'/g, `\\'`)}',
		modifiers: ${modifs},
	}`;
	const params = `${scope}, ${values}, ${target}`;
	if (!areas.variables.includes(dirtVarName)) {
		areas.variables.push(dirtVarName);
		areas.extras.push(`${dirtVarName} = ${scope}.$directives['${directive}'];`);
	}
	areas.hydrate.push(`${dirtVarName}.$init(${params});`);
	areas.mountDirt.push(`${dirtVarName}.$inserted(${params});`);
	areas.update.push(`${dirtVarName}.$update(${params});`);
	areas.destroy.push(`${dirtVarName}.$destroy(${params});`);
}