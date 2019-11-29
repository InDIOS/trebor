import ctx from '../parsers/script/context';
import { Element } from '../parsers/html/element';
import { Segments } from '../parsers/script/segments';
import { capitalize, filterPlaceholders } from '../utils';
import { callExpression, literal } from '../parsers/script/nodes';

export default function htmlDirective(node: Element, expression: string, segmts: Segments) {
  const { varName } = node;
  if (expression) {
    const setContent = `_$content${capitalize(varName, 2)}`;
    const params = filterPlaceholders([...segmts.globals]);
    const content = callExpression(setContent, params);
    segmts.init.push(setContent);
    segmts.extras.add(`${setContent} = (${params.join(', ')}) => ${ctx(expression, segmts.globals)};`);
    segmts.update.add(callExpression('_$htmlUpdate', [varName, content]));
    segmts.unmount.add(callExpression('_$htmlUpdate', [varName, content]));
    segmts.addImport('trebor/tools', '_$toString');
    this.tools = `function _$htmlUpdate(node, value) {
      if (node.innerHTML !== (value = _$toString(value))) {
        node.innerHTML = value;
      }
    }`;
  } else {
    this.tools = `function _$htmlValue(node, value) {
      node.innerHTML = value;
    }`;
    segmts.unmount.add(callExpression('_$htmlValue', [varName, literal(node.innerHTML)]));
  }
}
