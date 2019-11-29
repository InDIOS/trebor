import { Segments } from './segments';
import {
  variableDeclarator, variableDeclaration, functionExpression, literal,
  unaryExpression, callExpression, thisExpression, assignmentExpression, returnStatement,
  objectExpression, property, memberExpression, functionDeclaration, expressionStatement,
  arrayPattern, restElement,
} from './nodes';
import {
  AssignmentExpression, Statement, ExpressionStatement, CallExpression, Identifier
} from './estree';

export default function tpl(tplName: string, segmts: Segments, htmlCode: string[]) {
  const { init, globals, create, mount, update, unmount, destroy, extras, body } = segmts;
  const _this = thisExpression();
  const params = [...globals];
  init.unshift('_$tpl', '_$elements');
  const _init = init.map(_var => variableDeclarator(_var));
  const _unmount = expressionStatement(callExpression(memberExpression(_this, '$unmount')));

  if (init.length) {
    const _vars = init.slice();
    let clear = assignmentExpression(_vars.shift(), null);
    destroyVars(_vars, clear);
    destroy.add(clear);
  }
  segmts.addImport('trebor/tools', '_$');
  segmts.addImport('trebor/tools', '_$append');
  segmts.addImport('trebor/tools', '_$fragTpl');
  segmts.addImport('trebor/tools', '_$context');
  segmts.addImport('trebor/tools', '_$prepareFragment');
  const initEls = arrayPattern(['_$tpl', restElement('_$elements')]);
  const initTpl = assignmentExpression(initEls, callExpression('_$fragTpl', htmlCode.map(literal)));
  const appendTpl = callExpression('_$append', [
    callExpression('_$', ['parent']), '_$tpl', callExpression('_$', ['sibling'])
  ]);
  unmount.insert(callExpression('_$prepareFragment', ['_$tpl', '_$elements']));
  extras.add(initTpl);
  mount.add(appendTpl);

  const method = (key: string, value: Statement[], params = []) => {
    if (value.length) {
      return property(key, functionExpression(null, params, value));
    } else {
      segmts.addImport('trebor/tools', '_$noop');
      return property(key, '_$noop');
    }
  };

  const mayBeDestroyComp = <ExpressionStatement>destroy.statements[0];
  if ((<Identifier>(<CallExpression>mayBeDestroyComp.expression).callee).name === '_$destroyComponent') {
    segmts.addImport('trebor/tools', '_$setElements');
    segmts.addImport('trebor/tools', '_$destroyComponent');
    mount.add(callExpression('_$setElements', [_this, 'parent', 'sibling']));
  }

  const updateArgs = params.filter(param => !['_$v', '_$i'].includes(param));
  const methods = [
    method('$create', create.statements),
    method('$mount', [_unmount, ...mount.statements], ['parent', 'sibling']),
    method('$update', update.statements, updateArgs),
    method('$unmount', unmount.statements),
    method('$destroy', destroy.statements)
  ];
  return [...body.statements, functionDeclaration(`_$${tplName}`, params, [
    variableDeclaration(_init, 'let'),
    ...extras.statements,
    returnStatement(objectExpression(methods))
  ])];
}


function destroyVars(variables: string[], assign: AssignmentExpression) {
  if (variables.length) {
    assign.right = assignmentExpression(variables.shift(), null);
    destroyVars(variables, assign.right);
  } else {
    assign.right = unaryExpression('void', literal(0));
  }
}
