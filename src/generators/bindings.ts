import { ctx } from '../utilities/context';
import { BlockAreas } from '../utilities/classes';
import { capitalize, filterParser } from '../utilities/tools';

export function genBind(variable: string, attr: string, expression: string, areas: BlockAreas, scope: string, type: string, classes: string) {
	[scope] = scope.split(', ');
	const globals = [variable, '_$ga'];
	const bindFuncName = `bind${capitalize(attr)}${capitalize(variable)}`;
	const isSelMulti = /select/.test(variable) && type === 'multiple';
	let params = areas.globals.length > 0 ? `, ${areas.globals.join(', ')}` : '';
	let bindExp = expression === null ? 'true' : `${ctx(filterParser(expression), scope, areas.globals.concat(globals))}`;
	if (attr === 'class' || attr === 'style') {
		bindExp = attr === 'style' ?
			`_$bs(${bindExp})` : `(${classes ? `'${classes} ' + ` : ''}_$bc(${bindExp})).trim()`;
	}
	areas.variables.push(bindFuncName);
	areas.extras.push(`${bindFuncName} = (${scope}${params}) => ${bindExp};`);
	if (attr === 'value' && /input|select|textarea/.test(variable) && !/checkbox|radio/.test(type)) {
		if (isSelMulti) {
			areas.update.push(`_$bindMultiSelect(${variable}, ${bindFuncName}(${scope}${params}));`);
			areas.unmount.push(`_$bindMultiSelect(${variable}, ${bindFuncName}(${scope}${params}));`);
		} else {
			areas.hydrate.push(`${variable}.value = _$toStr(${bindFuncName}(${scope}${params}));`);
		}
	} else if (attr === 'checked' && /input/.test(variable) && /checkbox|radio/.test(type)) {
		areas.hydrate.push(`${variable}.checked = !!${bindFuncName}(${scope}${params});`);
	} else {
		areas.hydrate.push(`_$sa(${variable}, '${attr}', ${bindFuncName}(${scope}${params}));`);
	}
	!isSelMulti && areas.update.push(`_$iu(${variable}, '${attr}', ${bindFuncName}(${scope}${params}));`);
}