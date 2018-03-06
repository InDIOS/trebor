import { ctx } from '../utilities/context';
import { capitalize } from '../utilities/tools';
import { BlockAreas } from '../utilities/classes';

export function genBind(variable: string, attr: string, expression: string, areas: BlockAreas, scope: string, type: string, classes: string) {
	const bindFuncName = `bind${capitalize(attr)}${capitalize(variable)}`;
	const updateVar = `update${capitalize(attr)}${capitalize(variable)}`;
	[scope] = scope.split(', ');
	let params = areas.globals && areas.globals.length > 0 ? `, ${areas.globals.join(', ')}` : '';
	let bindExp = expression === null ? 'true' : `${ctx(expression, scope, areas.globals)}`;
	if (attr === 'class' || attr === 'style') {
		if (attr === 'class') {
			bindExp = `(${classes ? `'${classes} ' + ` : ''}_$bc(${ctx(expression, scope, areas.globals)})).trim()`;
		} else {
			bindExp = `_$bs(${ctx(expression, scope, areas.globals)})`;
		}
	}
	areas.variables.push(bindFuncName);
	areas.extras.push(`${bindFuncName} = (${scope}${params}) => ${bindExp};`);
	if (attr === 'value' && /input|select|textarea/.test(variable) && !/checkbox|radio/.test(type)) {
		areas.hydrate.push(`${variable}.value = _$toStr(${bindFuncName}(${scope}${params}));`);
		areas.update.push(`let ${updateVar} = _$toStr(${bindFuncName}(${scope}${params}));
		if (${variable}.value !== ${updateVar}) {
			${variable}.value = ${updateVar};
		}
		${updateVar} = void 0;`);
	} else if (attr === 'checked' && /input/.test(variable) && /checkbox|radio/.test(type)) {
		areas.hydrate.push(`${variable}.checked = !!${bindFuncName}(${scope}${params});`);
		areas.update.push(`let ${updateVar} = !!${bindFuncName}(${scope}${params});
		if (${variable}.checked !== ${updateVar}) {
			${variable}.checked = ${updateVar};
		}
		${updateVar} = void 0;`);
	} else {
		areas.hydrate.push(`_$sa(${variable}, '${attr}', _$toStr(${bindFuncName}(${scope}${params})));`);
		areas.update.push(`let ${updateVar} = _$toStr(${bindFuncName}(${scope}${params}));
		if (_$ga(${variable}, '${attr}') !== ${updateVar}) {
			_$sa(${variable}, '${attr}', ${updateVar});
		}
		${updateVar} = void 0;`);
	}
}