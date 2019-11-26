import ctx from '../parsers/script/context';
import { Element } from '../parsers/html/element';
import { Segments } from '../parsers/script/segments';
import { capitalize, filterPlaceholders } from '../utils';
import {
  callExpression, literal, arrowFunctionExpression, ifStatement, expressionStatement, assignmentExpression
} from '../parsers/script/nodes';
import { BlockStatement } from '../parsers/script/estree';

export default function eventAttribute(node: Element, eventArgs: string, expression: string, segmts: Segments) {
  const { varName } = node;
  const evenArgName = '$event';
  const isComp = node.isUnknownElement;
  const [eventName, ...args] = eventArgs.split('.');
  const hasStop = args.indexOf('stop');
  const hasPrevent = args.indexOf('prevent');
  const isKeyEvent = eventName.startsWith('key');
  const event = segmts.addVar(`${eventName}Event`);
  const listener = `_$listener${capitalize(event, 2)}`;
  let keys = null;
  if (isKeyEvent && args.length) {
    segmts.addImport('trebor/tools', '_$eventKeys');
    keys = callExpression('_$eventKeys', [evenArgName, ...args.reduce((params, key, i) => {
      if (i !== hasPrevent && i !== hasStop) {
        params.push(literal(key));
      }
      return params;
    }, [])]);
  }
  const params = filterPlaceholders([...segmts.globals]);
  segmts.init.push(listener);
  segmts.globalTools = (segmts.globalTools || []).concat([evenArgName, '$el']);
  segmts.extras.add(`${event} = (${params.join(', ')}, ${evenArgName}${isComp ? '' : ', $el'}) => {
    ${ctx(expression, segmts.globals, segmts.globalTools)};
  };`);
  const handler = arrowFunctionExpression([evenArgName], []);
  const { body } = <BlockStatement>handler.body;
  if (!!~hasStop) {
    segmts.addImport('trebor/tools', '_$eventStop');
    body.push(expressionStatement(callExpression('_$eventStop', [evenArgName])));
  }
  if (!!~hasPrevent) {
    segmts.addImport('trebor/tools', '_$eventPrevent');
    body.push(expressionStatement(callExpression('_$eventPrevent', [evenArgName])));
  }
  params.push(evenArgName);
  const eventExp = callExpression(event, isComp ? params : [...params, varName]);
  if (keys) {
    body.push(ifStatement(keys, [expressionStatement(eventExp)]));
  } else {
    body.push(expressionStatement(eventExp));
  }
  
  const setEvent = (eventFunc: string) => {
    segmts.addImport('trebor/tools', `_$${eventFunc}`);
    return callExpression(`_$${eventFunc}`, [
      varName, literal(eventName),
      eventFunc === 'addEvent' ? assignmentExpression(listener, handler) : listener
    ]);
  };
  segmts.create.add(setEvent('addEvent'));
  if (varName.startsWith('_$node')) {
    segmts.addImport('trebor/tools', '_$updateEvent');
    segmts.update.add(assignmentExpression(listener, callExpression('_$updateEvent', [
      varName, literal(eventName), listener, handler
    ])));
  }
  segmts.destroy.add(setEvent('removeEvent'));
}
