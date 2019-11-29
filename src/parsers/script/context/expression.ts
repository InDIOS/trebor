import parse from '../parser';
import { Statement, BaseNode } from '../estree';

export function expression(source = '', options?: Object) {
  const ast = parse(source, options);
  return <Statement><any>ast.body[0];
}

export function compare(node1: BaseNode, node2: BaseNode) {
  return node1.type === node2.type && JSON.stringify(node1) === JSON.stringify(node2);
}

export function assignNode(nodeTo: BaseNode, nodeFrom: BaseNode) {
  Object.keys(nodeTo).forEach(k => k !== 'parent' && delete nodeTo[k]);
  return Object.assign(nodeTo, nodeFrom);
}