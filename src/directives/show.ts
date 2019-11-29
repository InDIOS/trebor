import ctx from '../parsers/script/context';
import { Element } from '../parsers/html/element';
import { Segments } from '../parsers/script/segments';
import { capitalize, filterPlaceholders } from '../utils';
import { callExpression } from '../parsers/script/nodes';

export default function showDirective(node: Element, expression: string, segmts: Segments) {
  this.tools = tools;
  const { varName } = node;
  const funcName = `_$show${capitalize(varName, 2)}`;
  const varDisplay = `_$display${capitalize(varName, 2)}`;
  const [scope, ...params] = filterPlaceholders([...segmts.globals]);
  segmts.init.push(varDisplay);
  segmts.addImport('trebor/tools', '_$toString');
  segmts.update.add(callExpression(funcName, [scope, varName, varDisplay, ...params]));
  segmts.extras.add(`const ${funcName} = (${scope}, $el, $display${toParams(params)}) => {
    _$showValue($el, ${ctx(expression, segmts.globals)} ? $display : 'none');
  };`);
  segmts.unmount.add(`${varDisplay} = _$showValue(${varName});`);
  segmts.unmount.add(`${funcName}(${scope}, ${varName}, ${varDisplay}${toParams(params)});`);
}

function toParams(params: string[]) {
  return params.length ? `, ${params.join(', ')}` : '';
}

const tools = `function _$showValue(node, value) {
  const style = node.style;
  if (style.display !== value) {
    style.display = _$toString(value);
  }
  return style.display;
}`;
