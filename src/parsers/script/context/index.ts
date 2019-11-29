import parse from '../parser';
import findGlobals, { Node as BaseNode } from './globals';
import { generate } from '../generator';
import { assignNode, expression } from './expression';
import {
  memberExpression, literal, binaryExpression, callExpression, isLiteral, isAssignmentExpression,
  isIdentifier, isUpdateExpression, isMemberExpression, ExpressionParameter, arrowFunctionExpression,
  expressionStatement, arrayPattern
} from '../nodes';
import {
  Node as AnyNode, ExpressionStatement, MemberExpression, UpdateExpression, AssignmentExpression,
  Identifier, Program
} from '../estree';

interface Node extends BaseNode {
  scoped?: boolean;
}

function visitors(nodeType: string) {
  const _visitors = {
    UpdateExpression(node: Node & UpdateExpression) {
      _visitors.AssignmentExpression(node);
    },
    AssignmentExpression(node: Node & (AssignmentExpression | UpdateExpression)) {
      assignify(node);
    }
  };
  return _visitors[nodeType];
}

function assignify(node: Node & (AssignmentExpression | UpdateExpression)) {
  if (isAssignable(node)) {
    let operator: string, left: ExpressionParameter, _right: ExpressionParameter;
    if (isAssignmentExpression(node)) {
      left = <ExpressionParameter>node.left;
      const { right } = node;
      operator = node.operator.replace('=', '').trim();
      _right = <ExpressionParameter>operator ? binaryExpression(left, right, operator) : right;
    } else {
      left = node.argument;
      _right = binaryExpression(left, literal(1), node.operator[0]);
    }
    const key = <ExpressionStatement>expression(`(\`${literalify(left)}\`)`);
    const caller = memberExpression('_$ctx', '$set');
    const _node = callExpression(caller, [key.expression, _right]);
    assignNode(node, _node);
  }
}

function literalify(node: any) {
  if (isIdentifier(node)) {
    return (<Identifier>node).name;
  } else {
    let path = isIdentifier(node.object) ? `${node.object.name}` : literalify(node.object);
    const _node = [node.property];
    let prop = isLiteral(_node[0]) ? _node[0].value : generate(_node[0]);
    prop = node.computed && !isLiteral(_node[0]) ? `.\${${prop}}` : `.${prop}`;
    return `${path}${prop}`;
  }
}

function findAssignParent(parent: Node) {
  let node = parent;
  let isAssig = false;
  while (node && !isAssig) {
    if (/(Assignment|Update)E/.test(node.type)) {
      isAssig = true;
    } else {
      node = node.parent;
    }
  }
  return isAssig ? node : void 0;
}

function isAssignable(node: Node) {
  switch (true) {
    case isAssignmentExpression(node):
      return isAssignable((<AssignmentExpression>node).left);
    case isUpdateExpression(node):
      return isAssignable((<UpdateExpression>node).argument);
    case isMemberExpression(node):
      return isAssignable((<MemberExpression>node).object);
    default:
      return isIdentifier(node);
  }
}

export default function context(source: string, params: Set<string> = new Set(), extras: string[] = []) {
  const ast = <Program>parse(`(${source})`);
  const parameters = new Set(['_$ctx', ...params, ...(extras || [])]);
  let globs = findGlobals(<Program>ast, parameters);
  const globals = globs.flatMap(glob => glob.nodes);
  globals.forEach(({ parent }) => {
    const assign = findAssignParent(parent);
    if (assign) {
      const visitor = visitors(assign.type);
      if (visitor) {
        visitor(assign);
      }
    }
  });

  globs = findGlobals(<Program>ast, parameters);
  const args = globs.map(glob => glob.name);
  if (args.length) {
    const exp = (<ExpressionStatement>ast.body[0]).expression;
    const callee = arrowFunctionExpression([arrayPattern(args)], exp);
    const expression = callExpression('_$context', [
      '_$ctx', callee, ...args.map(arg => literal(arg))
    ]);
    ast.body = [expressionStatement(expression)];
  }

  return (<string>generate(<AnyNode>ast)).trim();
}
