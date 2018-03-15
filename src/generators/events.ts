import { ctx } from '../utilities/context';
import { BlockAreas } from '../utilities/classes';
import { getVarName, capitalize } from '../utilities/tools';

export function genEvent(variable: string, eventArgs: string, expression: string, areas: BlockAreas, scope: string) {
	const [event, ...args] = eventArgs.split('.');
	const eventFuncName = getVarName(areas.variables, `${event}Event`);
	const handlerFuncName = `handler${capitalize(eventFuncName)}`;
	areas.variables.push(handlerFuncName);
	[scope] = scope.split(', ');
	let params = areas.globals && areas.globals.length > 0 ? `, ${areas.globals.join(', ')}` : '';
	areas.extras.push(`${eventFuncName} = (${scope}${params}, $event, $el) => {
		${ctx(expression, scope, ['$event', '$el'].concat(areas.globals))};
	};`);
	const handler = `event => {
		${args.includes('prevent') ? `
		event.preventDefault();` : ''}${args.includes('stop') ? `
		event.stopPropagation();` : ''}${eventFuncName}(${scope}${params}, event, ${variable});
	}`;
	areas.hydrate.push(`_$al(${variable}, '${event}', ${handlerFuncName} = ${handler});`);
	if (!!areas.globals.length || variable.startsWith('_$node')) {
		areas.update.push(`${handlerFuncName} = _$ul(${variable}, '${event}', ${handlerFuncName}, ${handler});`);
	}
	areas.destroy.push(`_$rl(${variable}, '${event}', ${handlerFuncName});`);
}