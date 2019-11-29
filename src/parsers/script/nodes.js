const { strictEqual } = require('assert');

const Syntax = {
  AssignmentExpression: 'AssignmentExpression',
  AssignmentPattern: 'AssignmentPattern',
  ArrayExpression: 'ArrayExpression',
  ArrayPattern: 'ArrayPattern',
  ArrowFunctionExpression: 'ArrowFunctionExpression',
  AwaitExpression: 'AwaitExpression',
  BlockStatement: 'BlockStatement',
  BinaryExpression: 'BinaryExpression',
  BreakStatement: 'BreakStatement',
  CallExpression: 'CallExpression',
  CatchClause: 'CatchClause',
  ClassBody: 'ClassBody',
  ClassDeclaration: 'ClassDeclaration',
  ClassExpression: 'ClassExpression',
  ConditionalExpression: 'ConditionalExpression',
  ContinueStatement: 'ContinueStatement',
  DoWhileStatement: 'DoWhileStatement',
  DebuggerStatement: 'DebuggerStatement',
  EmptyStatement: 'EmptyStatement',
  ExportAllDeclaration: 'ExportAllDeclaration',
  ExportDefaultDeclaration: 'ExportDefaultDeclaration',
  ExportNamedDeclaration: 'ExportNamedDeclaration',
  ExportSpecifier: 'ExportSpecifier',
  ExpressionStatement: 'ExpressionStatement',
  ForStatement: 'ForStatement',
  ForOfStatement: 'ForOfStatement',
  ForInStatement: 'ForInStatement',
  FunctionDeclaration: 'FunctionDeclaration',
  FunctionExpression: 'FunctionExpression',
  Identifier: 'Identifier',
  IfStatement: 'IfStatement',
  ImportExpression: 'ImportExpression',
  ImportDeclaration: 'ImportDeclaration',
  ImportDefaultSpecifier: 'ImportDefaultSpecifier',
  ImportNamespaceSpecifier: 'ImportNamespaceSpecifier',
  ImportSpecifier: 'ImportSpecifier',
  Literal: 'Literal',
  LabeledStatement: 'LabeledStatement',
  LogicalExpression: 'LogicalExpression',
  MemberExpression: 'MemberExpression',
  MetaProperty: 'MetaProperty',
  MethodDefinition: 'MethodDefinition',
  NewExpression: 'NewExpression',
  ObjectExpression: 'ObjectExpression',
  ObjectPattern: 'ObjectPattern',
  Program: 'Program',
  Property: 'Property',
  RestElement: 'RestElement',
  ReturnStatement: 'ReturnStatement',
  SequenceExpression: 'SequenceExpression',
  SpreadElement: 'SpreadElement',
  Super: 'Super',
  SwitchCase: 'SwitchCase',
  SwitchStatement: 'SwitchStatement',
  TaggedTemplateExpression: 'TaggedTemplateExpression',
  TemplateElement: 'TemplateElement',
  TemplateLiteral: 'TemplateLiteral',
  ThisExpression: 'ThisExpression',
  ThrowStatement: 'ThrowStatement',
  TryStatement: 'TryStatement',
  UnaryExpression: 'UnaryExpression',
  UpdateExpression: 'UpdateExpression',
  VariableDeclaration: 'VariableDeclaration',
  VariableDeclarator: 'VariableDeclarator',
  WhileStatement: 'WhileStatement',
  WithStatement: 'WithStatement',
  YieldExpression: 'YieldExpression'
};
exports.Syntax = Syntax;

function arrayExpression(elements) {
  return arrays(Syntax.ArrayExpression, elements);
};
exports.arrayExpression = arrayExpression;

function arrayPattern(elements) {
  return arrays(Syntax.ArrayPattern, elements);
};
exports.arrayPattern = arrayPattern;

function arrowFunctionExpression(params, body, isAsync) {
  const options = { expression: !array(body), async: isAsync };
  return functionTpl(Syntax.ArrowFunctionExpression, null, params, body, options);
};
exports.arrowFunctionExpression = arrowFunctionExpression;

function assignmentExpression(left, right, operator) {
  return binary(Syntax.AssignmentExpression, left, right, operator || '=');
};
exports.assignmentExpression = assignmentExpression;

function assignmentPattern(left, right) {
  return binary(Syntax.AssignmentPattern, left, right);
};
exports.assignmentPattern = assignmentPattern;

function awaitExpression(argument) {
  return unary(Syntax.AwaitExpression, argument);
};
exports.awaitExpression = awaitExpression;

function binaryExpression(left, right, operator) {
  return binary(Syntax.BinaryExpression, left, right, operator);
};
exports.binaryExpression = binaryExpression;

function blockStatement(body) {
  return block(Syntax.BlockStatement, body);
};
exports.blockStatement = blockStatement;

function breakStatement(label) {
  return labeled(Syntax.BreakStatement, label);
};
exports.breakStatement = breakStatement;

function callExpression(callee, args = []) {
  return call(Syntax.CallExpression, callee, args);
};
exports.callExpression = callExpression;

function catchClause(param, body = []) {
  return { type: Syntax.CatchClause, param: asId(param), body: blockStatement(body) };
};
exports.catchClause = catchClause;

function classBody(body = []) {
  return block(Syntax.ClassBody, body);
};
exports.classBody = classBody;

function classDeclaration(id, superClass, body) {
  return classes(Syntax.ClassDeclaration, id, superClass, body);
};
exports.classDeclaration = classDeclaration;

function classExpression(id, superClass, body) {
  return classes(Syntax.ClassDeclaration, id, superClass, body);
};
exports.classExpression = classExpression;

function conditionalExpression(test, consequent, alternate) {
  return condition(Syntax.ConditionalExpression, test, consequent, alternate);
};
exports.conditionalExpression = conditionalExpression;

function continueStatement(label) {
  return labeled(Syntax.ContinueStatement, label);
};
exports.continueStatement = continueStatement;

function debuggerStatement() {
  return { type: Syntax.DebuggerStatement };
};
exports.debuggerStatement = debuggerStatement;

function doWhileStatement(test, body) {
  return whileStmt(Syntax.DoWhileStatement, test, body);
};
exports.doWhileStatement = doWhileStatement;

function emptyStatement() {
  return { type: Syntax.EmptyStatement };
};
exports.emptyStatement = emptyStatement;

function exportAllDeclaration(source) {
  return { type: Syntax.ExportAllDeclaration, source: literal(source) };
};
exports.exportAllDeclaration = exportAllDeclaration;

function exportDefaultDeclaration(declaration) {
  return { type: Syntax.ExportDefaultDeclaration, declaration: asId(declaration) };
};
exports.exportDefaultDeclaration = exportDefaultDeclaration;

function exportNamedDeclaration(declaration) {
  return exportNames(declaration, []);
};
exports.exportNamedDeclaration = exportNamedDeclaration;

function exportNamedExpression(specifiers, source) {
  return exportNames(null, specifiers, source);
};
exports.exportNamedExpression = exportNamedExpression;

function exportSpecifier(local, exported) {
  return { type: Syntax.ExportSpecifier, local: asId(local), exported: asId(exported || local) };
};
exports.exportSpecifier = exportSpecifier;

function expressionStatement(expression) {
  return expression ? { type: Syntax.ExpressionStatement, expression: asId(expression) } : expression;
};
exports.expressionStatement = expressionStatement;

function forInStatement(left, right, body) {
  return forStmt(Syntax.ForInStatement, left, right, body, false);
};
exports.forInStatement = forInStatement;

function forOfStatement(left, right, body, isAsync) {
  return forStmt(Syntax.ForOfStatement, left, right, body, isAsync);
};
exports.forOfStatement = forOfStatement;

function forStatement(body, init, test, update) {
  return { type: Syntax.ForStatement, init: asId(init), test: asId(test), update, body: asBlock(body) };
};
exports.forStatement = forStatement;

function functionDeclaration(id, params = [], body = [], generator = false, isAsync = false) {
  return functionTpl(Syntax.FunctionDeclaration, id, params, body, { generator, async: isAsync });
};
exports.functionDeclaration = functionDeclaration;

function functionExpression(id, params = [], body = [], generator = false, isAsync = false) {
  return functionTpl(Syntax.FunctionDeclaration, id, params, body, { generator, async: isAsync });
};
exports.functionExpression = functionExpression;

function identifier(name) {
  espect(name, 'name').toBeType('string');
  return { type: Syntax.Identifier, name };
};
exports.identifier = identifier;

function ifStatement(test, consequent, alternate) {
  return condition(Syntax.IfStatement, test, consequent, alternate);
};
exports.ifStatement = ifStatement;

function importExpression(source) {
  return { type: Syntax.ImportExpression, source };
};
exports.importExpression = importExpression;

function importDeclaration(specifiers, source) {
  espect(specifiers, 'specifiers').toBeType('array');
  return { type: Syntax.ImportDeclaration, specifiers, source: literal(source) };
};
exports.importDeclaration = importDeclaration;

function importDefaultSpecifier(local) {
  return importSpec(Syntax.ImportDefaultSpecifier, local);
};
exports.importDefaultSpecifier = importDefaultSpecifier;

function importNamespaceSpecifier(local) {
  return importSpec(Syntax.ImportNamespaceSpecifier, local);
};
exports.importNamespaceSpecifier = importNamespaceSpecifier;

function importSpecifier(local, imported) {
  return importSpec(Syntax.ImportSpecifier, local, imported);
};
exports.importSpecifier = importSpecifier;

function labeledStatement(label, body) {
  return { ...labeled(Syntax.LabeledStatement, label), body: asBlock(body) };
};
exports.labeledStatement = labeledStatement;

function literal(value) {
  return literals(value);
};
exports.literal = literal;

function logicalExpression(left, right, operator) {
  return binary(Syntax.LogicalExpression, left, right, operator);
};
exports.logicalExpression = logicalExpression;

function memberExpression(object, property, computed) {
  return { type: Syntax.MemberExpression, object: asId(object), property: asId(property), computed };
};
exports.memberExpression = memberExpression;

function metaProperty(meta, property) {
  return { type: Syntax.MetaProperty, meta: identifier(meta), property: identifier(property) };
};
exports.metaProperty = metaProperty;

function methodDefinition(key, value, options) {
  return properties(Syntax.MethodDefinition, key, value, options);
};
exports.methodDefinition = methodDefinition;

function newExpression(callee, args) {
  return call(Syntax.NewExpression, callee, args);
};
exports.newExpression = newExpression;

function objectExpression(properties) {
  return objects(Syntax.ObjectExpression, properties);
};
exports.objectExpression = objectExpression;

function objectPattern(properties) {
  return objects(Syntax.ObjectPattern, properties);
};
exports.objectPattern = objectPattern;

function program(body, sourceType) {
  espect(body, 'body').toBeType('array');
  return { type: Syntax.Program, body, sourceType };
};
exports.program = program;

function property(key, value, options) {
  return properties(Syntax.Property, key, value, options);
};
exports.property = property;

function regexLiteral(value) {
  return literals(value);
};
exports.regexLiteral = regexLiteral;

function restElement(argument) {
  return unary(Syntax.RestElement, argument);
};
exports.restElement = restElement;

function returnStatement(argument) {
  return unary(Syntax.ReturnStatement, argument);
};
exports.returnStatement = returnStatement;

function sequenceExpression(expressions) {
  return sequence(Syntax.SequenceExpression, expressions);
};
exports.sequenceExpression = sequenceExpression;

function spreadElement(argument) {
  return unary(Syntax.SpreadElement, argument);
};
exports.spreadElement = spreadElement;

function superExpression() {
  return { type: Syntax.Super };
};
exports.superExpression = superExpression;

function switchCase(test, consequent = []) {
  espect(consequent, 'consequent').toBeType('array');
  return { type: Syntax.SwitchCase, test: asId(test), consequent };
};
exports.switchCase = switchCase;

function switchStatement(discriminant, cases = []) {
  espect(cases, 'cases').toBeType('array');
  return { type: Syntax.SwitchStatement, discriminant: asId(discriminant), cases };
};
exports.switchStatement = switchStatement;

function taggedTemplateExpression(tag, quasi) {
  return { type: Syntax.TaggedTemplateExpression, tag: asId(tag), quasi };
};
exports.taggedTemplateExpression = taggedTemplateExpression;

function templateElement(value, tail) {
  return { type: Syntax.TemplateElement, value: { cooked: `${value}`, raw: `${value}` }, tail };
};
exports.templateElement = templateElement;

function templateLiteral(quasis, expressions) {
  espect(quasis, 'quasis').toBeType('array');
  return { ...sequence(Syntax.TemplateLiteral, expressions), quasis };
};
exports.templateLiteral = templateLiteral;

function thisExpression() {
  return { type: Syntax.ThisExpression };
};
exports.thisExpression = thisExpression;

function throwStatement(argument) {
  return unary(Syntax.ThrowStatement, argument);
};
exports.throwStatement = throwStatement;

function tryStatement(block, handler, finalizer) {
  handler && espect(handler.type, 'handler.type').toBe(Syntax.CatchClause);
  return {
    type: Syntax.TryStatement, handler,
    block: blockStatement(block), finalizer: blockStatement(finalizer)
  };
};
exports.tryStatement = tryStatement;

function unaryExpression(operator, argument) {
  return unary(Syntax.UnaryExpression, argument, { operator, prefix: true });
};
exports.unaryExpression = unaryExpression;

function updateExpression(operator, argument, prefix = true) {
  return unary(Syntax.UpdateExpression, argument, { operator, prefix });
};
exports.updateExpression = updateExpression;

function variableDeclaration(declarations, kind) {
  espect(declarations, 'declarations').toBeType('array');
  return { type: Syntax.VariableDeclaration, kind, declarations };
};
exports.variableDeclaration = variableDeclaration;

function variableDeclarator(id, init) {
  return { type: Syntax.VariableDeclarator, id: asId(id), init: asId(init) };
};
exports.variableDeclarator = variableDeclarator;

function whileStatement(test, body) {
  return whileStmt(Syntax.WhileStatement, test, body);
};
exports.whileStatement = whileStatement;

function withStatement(object, body) {
  return { type: Syntax.WithStatement, object: asId(object), body: asBlock(body) };
};
exports.withStatement = withStatement;

function yieldExpression(argument, delegate = false) {
  return unary(Syntax.YieldExpression, argument, { delegate });
};
exports.yieldExpression = yieldExpression;

(function () {
  const _loop = (_type) => ({ type }) => type === _type;
  for (const key in Syntax) {
    exports[`is${key}`] = _loop(key);
  }
})();

// Tools
function espect(assert, propName = 'assert') {
  const proto = Object.prototype;
  return {
    toBe(value) {
      strictEqual(assert, value, `'${propName}' must be equal to ${JSON.stringify(value)}`);
    },
    toBeType(type) {
      const _type = proto.toString.call(assert).slice(8, -1).toLowerCase();
      strictEqual(_type, type, `'${propName}' must be type '${type}' but got '${_type}'`);
    }
  };
}

function asId(value = null) {
  return typeof value === 'object' ? value : identifier(value);
}

function asBlock(body) {
  return array(body) ? blockStatement(body) : body;
}

function array(value) {
  return Array.isArray(value);
}

function arrays(type, elements) {
  espect(elements, 'elements').toBeType('array');
  return { type, elements: elements.map(asId) };
}

function binary(type, left, right, operator) {
  const node = { left: asId(left), right: asId(right) };
  return !operator ? { type, ...node } : { type, operator, ...node };
}

function block(type, body) {
  espect(body, 'body').toBeType('array');
  return { type, body };
}

function call(type, callee, args) {
  espect(args, 'arguments').toBeType('array');
  return { type, callee: asId(callee), arguments: args.map(asId) };
}

function classes(type, id, superClass, body) {
  return { type, id: asId(id), superClass: asId(superClass), body: classBody(body) };
}

function condition(type, test, consequent, alternate) {
  if (Syntax.IfStatement === type) {
    alternate = array(alternate) ? blockStatement(alternate) : expressionStatement(alternate);
    consequent = array(consequent) ? blockStatement(consequent) : expressionStatement(consequent);
  }
  return { type, test: asId(test), consequent: asId(consequent), alternate: asId(alternate) };
}

function exportNames(declaration, specifiers = [], source = null) {
  espect(specifiers, 'specifiers').toBeType('array');
  if (declaration) {
    specifiers = [];
    source = null;
  }
  return {
    type: Syntax.ExportNamedDeclaration,
    declaration, specifiers, source: source !== null ? literal(source) : source
  };
}

function forStmt(type, left, right, body, isAsync) {
  return { type, left: asId(left), right: asId(right), body: asBlock(body), await: isAsync };
}

function functionTpl(type, id, params, body, options) {
  espect(params, 'params').toBeType('array');
  return { params: params.map(asId), body: asBlock(body), type, id: asId(id), ...options };
}

function importSpec(type, local, imported) {
  const regexp = /Import(Namespace|Default)/;
  const node = { type, local: asId(local) };
  return regexp.test(type) ? node : { ...node, imported: asId(imported || local) };
}

function labeled(type, label) {
  return { type, label: asId(label) };
}

function literals(value) {
  const isRegExp = value instanceof RegExp;
  let node = { type: Syntax.Literal, value };
  return isRegExp ? { ...node, ...{ pattern: value.source, flags: value.flags } } : node;
}

function objects(type, properties) {
  espect(properties, 'properties').toBeType('array');
  return { type, properties };
}

function properties(type, key, value, options = { kind: 'init'}) {
  options.kind = options.kind || 'init';
  return { type, key: asId(key), value: asId(value || key), ...options };
}

function sequence(type, expressions) {
  espect(expressions, 'expressions').toBeType('array');
  return { type, expressions: expressions.map(asId) };
}

function unary(type, argument, args) {
  const node = { type, argument: asId(argument) };
  return args ? { ...node, ...args } : node;
}

function whileStmt(type, test, body) {
  return { type, test: asId(test), body: asBlock(body) };
}
