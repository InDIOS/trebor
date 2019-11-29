import ctx from '../parsers/script/context';
import { Element } from '../parsers/html/element';
import { Segments } from '../parsers/script/segments';
import { CallExpression, Literal } from '../parsers/script/estree';
import { replaceItem, replaceVar, capitalize, filters, filterPlaceholders } from '../utils';
import { callExpression, assignmentExpression, literal } from '../parsers/script/nodes';

export default function tagDirective(node: Element, expression: string, segmts: Segments) {
  if (expression) {
    const varName = segmts.addVar('node');
    replaceItem(segmts.init, node.varName);
    replaceVar(segmts.create, node.varName, varName);
    segmts.variables.set(node.tagName, segmts.variables.get(node.tagName) - 1);
    node.varName = varName;
    this.tools = tools;
    const setElement = `_$setTag${capitalize(varName, 2)}`;
    segmts.init.push(setElement);
    const code = ctx(filters(expression, segmts), segmts.globals);
    const params = filterPlaceholders([...segmts.globals]);
    const setTag = callExpression(setElement, params);
    const setTagNode = (tag: CallExpression | Literal) => assignmentExpression(
      varName, callExpression('_$tagUpdate', [varName, tag])
    );
    segmts.extras.add(`${setElement} = (${params.join(', ')}) => ${code};`);
    segmts.update.add(setTagNode(setTag));
    segmts.unmount.add(setTagNode(literal(node.tagName)));
  }
}

const tools = `function _$tagUpdate(node, tag) {
  if (tag.toUpperCase() !== node.tagName) {
    const _node = document.createElement(tag);
    const childNodes = node.childNodes, attributes = node.attributes;
    _$each(childNodes, node => _$append(_node, node));
    _$each(attributes, ({ name, value }) => _node.setAttributeNS(node.namespaceURI, name, value));
    node.parentElement.replaceChild(_node, node);
    return _node;
  } else {
    return node;
  }
}`;
