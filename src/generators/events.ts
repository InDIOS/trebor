import { ctx } from '../utilities/context';
import { BlockAreas } from '../utilities/classes';
import { getVarName, capitalize } from '../utilities/tools';

export function genEvent(variable: string, eventArgs: string, expression: string, areas: BlockAreas, scope: string) {
  const [event, ...args] = eventArgs.split('.');
  const hasStop = args.indexOf('stop');
  const hasPrevent = args.indexOf('prevent');
  const isKeyEvent = event.startsWith('key');
  let keys = '';
  if (isKeyEvent && args.length) {
    keys = args.reduce((nargs, arg, i) => {
      if (i !== hasPrevent && i !== hasStop) {
				nargs += `_$isKey(event, '${arg}')${i < args.length - 1 ? ' &&' : ''}`;
      }
      return nargs;
    }, '');
  }
	const eventFuncName = getVarName(areas.variables, `${event}Event`);
	const handlerFuncName = `handler${capitalize(eventFuncName)}`;
	areas.variables.push(handlerFuncName);
	[scope] = scope.split(', ');
  let params = areas.globals && areas.globals.length > 0 ? `, ${areas.globals.join(', ')}` : '';
	areas.extras.push(`${eventFuncName} = (${scope}${params}, $event, $el) => {
    ${ctx(expression, scope, ['$event', '$el'].concat(areas.variables, areas.globals))};
  };`);
	const handler = `event => {
    ${!!~hasPrevent ? `event.preventDefault();` : ''}
    ${!!~hasStop ? `event.stopPropagation();` : ''}
    ${keys ? `if (${keys}) {` : ''}
    ${eventFuncName}(${scope}${params}, event, ${variable});
    ${keys ? '}' : ''}
	}`;
	areas.hydrate.push(`_$addListener(${variable}, '${event}', ${handlerFuncName} = ${handler});`);
	if (!!areas.globals.length || variable.startsWith('_$node')) {
		areas.update.push(`${handlerFuncName} = _$updateListener(${variable}, '${event}', ${handlerFuncName}, ${handler});`);
	}
	areas.destroy.push(`_$removeListener(${variable}, '${event}', ${handlerFuncName});`);
}