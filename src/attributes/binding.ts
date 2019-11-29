import ctx from '../parsers/script/context';
import { Element } from '../parsers/html/element';
import { Segments } from '../parsers/script/segments';
import { callExpression, literal } from '../parsers/script/nodes';
import { capitalize, snakeToCamel, toValidate, filters, filterPlaceholders } from '../utils';

const isBooleanAttr = toValidate(`allowfullscreen,async,autofocus,autoplay,checked,compact,controls,
declare,default,defaultchecked,defaultmuted,defaultselected,defer,disabled,enabled,formnovalidate,
hidden,indeterminate,inert,ismap,itemscope,loop,multiple,muted,nohref,noresize,noshade,novalidate,
nowrap,open,pauseonexit,readonly,required,reversed,scoped,seamless,selected,sortable,translate,
truespeed,typemustmatch,visible`);

export default function bindAttribute(node: Element, attr: string, expression: string, segmts: Segments) {
  const { varName } = node;
  const type = node.hasAttribute('multiple') ? 'multiple' : node.getAttribute('type');
  const bindFuncName = `_$bind${capitalize(snakeToCamel(attr))}${capitalize(varName.replace('_$', ''))}`;
  const isMultiSelect = node.tagName === 'select' && node.hasAttribute('multiple');
  expression = expression || (attr === 'class' ? 'true' : snakeToCamel(attr));
  let bindExp = ctx(filters(expression, segmts), segmts.globals, segmts.globalTools || []);
  if (attr === 'class' || attr === 'style') {
    const tool = `_$bind${capitalize(attr)}`;
    segmts.addImport('trebor/tools', tool);
    bindExp = `${tool}('${node.getAttribute(attr) || ''}', ${bindExp})`;
  }
  const params = filterPlaceholders([...segmts.globals]);
  const bindFunc = callExpression(bindFuncName, params);
  segmts.init.push(bindFuncName);
  segmts.extras.add(`${bindFuncName} = (${params.join(', ')}) => (${bindExp});`);
  let toolName = '';
  let toolArgs = [varName, literal(attr), bindFunc];
  if (attr === 'value' && !/checkbox|radio/.test(type)) {
    toolName = `_$${isMultiSelect ? 'bindMultiSelect' : 'bindUpdate'}`;
    toolArgs = [varName, bindFunc];
  } else {
    toolName = `_$${isBooleanAttr(attr) ? 'bindBooleanAttr' : 'bindUpdate'}`;
    if (toolName === '_$bindUpdate' && attr === 'value') {
      toolArgs = [varName, bindFunc];
    }
  }
  const segmt = callExpression(toolName, toolArgs);
  segmts.addImport('trebor/tools',toolName);
  segmts.unmount.add(segmt);
  segmts.update.add(segmt);
}

module.exports = bindAttribute;