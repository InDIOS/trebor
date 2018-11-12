import recast from 'recast';
import { parse as parser } from 'espree';
import { Recast, Path, RecastAST } from '../types/recast';
import { builtin, browser, node as nodejs, amd } from 'globals';
import { analyze, Scope, Variable, Reference, ScopeManager } from 'eslint-scope';
import {
  Node, Expression, Identifier, AssignmentExpression, UpdateExpression,
  UnaryExpression, BinaryExpression, BinaryOperator, Literal, UnaryOperator,
  ExportDefaultDeclaration, BlockStatement, VariableDeclaration, ImportDeclaration, FunctionExpression
} from 'estree';

const { print, types, parse } = <Recast>recast;
const STATEMENT_TYPE = /(?:Statement|Declaration)$/;
const LOOP_STATEMENT = /^(?:DoWhile|For|ForIn|ForOf|While)Statement$/;
const { binaryExpression, literal, callExpression, memberExpression, identifier } = types.builders;
const { Identifier, BlockStatement, Literal, UnaryExpression, AssignmentExpression, IfStatement } = types.namedTypes;

export function ctx(src: string, context: string, globals: string[] = []) {
  if (src[0] === '{') src = `let _$o = ${src}`;
  let ast = toAst(src);
  visitExpressions(ast, context, globals.concat([context]));
  return toCode(ast).code.replace('let _$o = ', '');
}

export function toOptions(src: string) {
  let ast = toAst(src, 'module');
  return visitOptions(ast);
}

export function optimize(src: string) {
  let ast = toAst(src, 'module');
  visitOptimize(ast);
  return toCode(ast).code;
}

function assignify(node: Node, ctx: string, path: Path<Node>, globals: string[]) {
  if (isReplaceable(node, path, globals)) {
    if (AssignmentExpression.check(node)) {
      let { operator, left, right } = <AssignmentExpression>node;
      operator = <any>operator.replace('=', '').trim();
      return settify(ctx, left, operator ? binaryExpression(<any>operator, <Identifier>left, right) : right);
    } else {
      let { argument, operator } = <UpdateExpression>node;
      return settify(ctx, argument, binaryExpression(<any>operator[0], argument, literal(1)));
    }
  } else {
    return node;
  }
}

function settify(ctx: string, left: Node, right: Expression) {
  let callee = memberExpression(identifier(ctx), identifier('$set'), false);
  let args = [literal(print(left).code), Identifier.check(right) ? toMember(right, ctx) : right];
  return callExpression(callee, args);
}

function visitExpressions(ast: RecastAST, ctx: string, globals: string[]) {
  types.visit(ast, {
    visitProperty(path) {
      let { node } = path;
      node.shorthand = false;
      if (node.computed) {
        if (canBeReplaced(node.key, path, globals)) {
          replace('key', ctx, path);
        }
        this.traverse(path);
      }
      if (canBeReplaced(node.value, path, globals)) {
        replace('value', ctx, path);
        return false;
      }
      this.traverse(path);
    },
    visitCallExpression(path) {
      let { node } = path;
      canBeReplaced(node.callee, path, globals) && replace('callee', ctx, path);
      node.arguments.forEach((argument, i) => {
        canBeReplaced(argument, path, globals) && replace('arguments', ctx, path, i);
      });
      return this.traverse(path);
    },
    visitMemberExpression(path) {
      let { node } = path;
      if (canBeReplaced(node.object, path, globals)) {
        replace('object', ctx, path);
        if (node.computed && canBeReplaced(node.property, path, globals)) {
          replace('property', ctx, path);
          return false;
        }
      }
      this.traverse(path);
    },
    visitExpressionStatement(path) {
      let { node } = path;
      if (canBeReplaced(node.expression, path, globals)) {
        replace('expression', ctx, path);
      }
      this.traverse(path);
    },
    visitSequenceExpression(path) {
      this.visitTemplateLiteral(path);
    },
    visitTemplateLiteral(path) {
      let { node } = path;
      node.expressions.forEach((expression, i) => {
        canBeReplaced(expression, path, globals) && replace('expressions', ctx, path, i);
      });
      this.traverse(path);
    },
    visitArrayExpression(path) {
      let { node } = path;
      node.elements.forEach((element, i) => {
        canBeReplaced(element, path, globals) && replace('elements', ctx, path, i);
      });
      this.traverse(path);
    },
    visitConditionalExpression(path) {
      let { node } = path;
      canBeReplaced(node.test, path, globals) && replace('test', ctx, path);
      canBeReplaced(node.alternate, path, globals) && replace('alternate', ctx, path);
      canBeReplaced(node.consequent, path, globals) && replace('consequent', ctx, path);
      this.traverse(path);
    },
    visitSpreadElement(path) {
      this.visitUnaryExpression(path);
    },
    visitUnaryExpression(path) {
      let { node } = path;
      canBeReplaced(node.argument, path, globals) && replace('argument', ctx, path);
      this.traverse(path);
    },
    visitBinaryExpression(path) {
      this.visitLogicalExpression(path);
    },
    visitLogicalExpression(path) {
      let { node } = path;
      canBeReplaced(node.left, path, globals) && replace('left', ctx, path);
      canBeReplaced(node.right, path, globals) && replace('right', ctx, path);
      this.traverse(path);
    },
    visitUpdateExpression(path) {
      this.visitAssignmentExpression(path);
    },
    visitAssignmentExpression(path) {
      let { node, parent } = path;
      let newNode = assignify(node, ctx, path, globals);
      if ('expressions' in parent.node) {
        let i = parent.node.expressions.indexOf(node);
        node !== newNode && parent.get('expressions', i).replace(newNode);
      } else {
        node !== newNode && parent.get('expression').replace(newNode);
        if (node === newNode && AssignmentExpression.check(node)) {
          canBeReplaced(node.right, path, globals) && replace('right', ctx, path);
        }
      }
      this.traverse(path);
    }
  });
  return ast;
}

function visitOptions(ast) {
  let options = '';
  const imports: string[] = [];
  types.visit(ast, {
    visitImportDeclaration(path) {
      return this.extract(path, node => { imports.push(print(node).code); });
    },
    visitExportDefaultDeclaration(path) {
      return this.extract(path, ({ declaration }: ExportDefaultDeclaration) => {
        options = print(declaration).code;
      });
    },
    extract(path, extractor: (node: Node) => boolean) {
      extractor(path.node);
      path.prune();
      return false;
    }
  });
  let extras = print(ast).code;
  return { imports, extras, options };
}

function visitOptimize(ast: RecastAST) {
  let iterations = 0;
  let unused = findUnused(ast);
  let isUnused = (node: Identifier) => !!unused.find(id => isSameIdentifier(id, node));
  while (iterations < 5) {
    types.visit(ast, {
      // Remove unused declarations
      visitImportDeclaration(path) {
        this.declarations(path, 'specifiers', 'local');
      },
      visitVariableDeclaration(path) {
        this.declarations(path, 'declarations', 'id');
      },
      visitFunctionExpression(path) {
        let { params } = path.node;
        for (let i = params.length - 1; i >= 0; i--) {
          isUnused(<Identifier>params[i]) ? path.get('params', i).prune() : (i = -1);
        }
        this.traverse(path);
      },
      visitFunctionDeclaration(path) {
        let { id } = path.node;
        if (isUnused(id)) {
          path.prune();
          return false;
        }
        this.visitFunctionExpression(path);
      },
      // Remove empty block statements
      visitSwitchStatement(path) {
        let { node } = path;
        return this.emptyStatement(path, !node.cases.length);
      },
      visitWhileStatement(path) {
        let { body } = path.node;
        return this.emptyStatement(path, BlockStatement.check(body) && !(<BlockStatement>body).body.length);
      },
      visitIfStatement(path) {
        let { node } = path;
        if (BlockStatement.check(node.alternate)) {
          !(<BlockStatement>node.alternate).body.length && path.get('alternate').prune();
        } else if (IfStatement.check(node.alternate)) {
          this.traverse(path);
        }
        let condition = BlockStatement.check(node.consequent)
          && !(<BlockStatement>node.consequent).body.length && !node.alternate;
        return this.emptyStatement(path, condition);
      },
      visitTryStatement(path) {
        let { node } = path;
        if (BlockStatement.check(node.finalizer) && !node.finalizer.body.length) {
          path.get('finalizer').prune();
        }
        let condition = BlockStatement.check(node.block) && !node.block.body.length
          && BlockStatement.check(node.handler.body) && !node.handler.body.body.length;
        return this.emptyStatement(path, condition);
      },
      // reduce expressions
      visitUnaryExpression(path) {
        let { node } = path;
        if (Literal.check(node.argument) && node.operator !== 'void') {
          path.replace(toLiteral(node));
        }
        this.traverse(path);
      },
      visitLogicalExpression(path) {
        this.visitBinaryExpression(path);
      },
      visitBinaryExpression(path) {
        this.traverse(path);
        let { node } = path;
        if (Literal.check(node.left) && Literal.check(node.right)) {
          path.replace(toLiteral(node));
        }
      },
      // utils
      declarations(path, list: string, prop: string) {
        let node = <ImportDeclaration | VariableDeclaration>path.node;
        let items = node[list];
        for (let i = items.length - 1; i >= 0; i--) {
          isUnused(items[i][prop]) && path.get(list, i).prune();
        }
        !items.length && prop === 'local' && path.prune();
        this.traverse(path);
      },
      emptyStatement(path, condition: boolean) {
        if (condition) {
          path.prune();
          return false;
        }
        this.traverse(path);
      }
    });
    unused = findUnused(ast);
    iterations++;
    if (!unused.length) {
      iterations = 5;
    }
  }
}

function toLiteral(node: Node) {
  if (UnaryExpression.check(node)) {
    let { operator, argument } = <UnaryExpression>node;
    return literal(evalUnary(operator, (<Literal>argument).value));
  } else {
    let { operator, left, right } = <BinaryExpression>node;
    return literal(evalBinary(operator, (<Literal>left).value, (<Literal>right).value));
  }
}

function evalUnary(operator: UnaryOperator, argument: any) {
  let evaluate = `${/typeof|delete/.test(operator) ? `${operator} ` : operator}${toValue(argument)}`;
  return eval(evaluate);
}

function evalBinary(operator: BinaryOperator, left: any, right: any) {
  let evaluate = `${toValue(left)}${operator}${toValue(right)}`;
  return eval(evaluate);
}

function toValue(value: any) {
  return typeof value === 'string' ? `'${value}'` : value;
}

function findUnused({ program }: RecastAST) {
  types.visit(program, {
    visitNode(path) {
      if (path.node.type !== 'Program') path.node['parent'] = path.parent.node;
      this.traverse(path);
    }
  });
  let scopeManager = analyze(program, { sourceType: 'module', ecmaVersion: 10 });
  let scope = scopeManager.acquire(program);
  scope['context'] = scopeManager;
  return collectUnuseds(scope, []).reduce<Identifier[]>((result, variable) => {
    if (variable.references.length) {
      result.push(...variable.references.map(({ identifier: id, resolved }) => {
        return id['parent'].type === 'CallExpression' ? resolved.defs[0].name : id;
      }));
    } else {
      result.push(...variable.defs.map(d => d.name));
    }
    return result;
  }, []);
}

function isInLoop(node: Node) {
  while (node && !types.namedTypes.Function.check(node)) {
    if (LOOP_STATEMENT.test(node.type)) return true;
    node = node['parent'];
  }
  return false;
}

function getUpperFunction(node: Node) {
  while (node) {
    if (types.namedTypes.Function.check(node)) return node;
    node = node['parent'];
  }
  return null;
}

function getRhsNode(ref: Reference, prevRhsNode: Node) {
  const id = ref.identifier;
  const parent = id['parent'];
  const granpa = parent.parent;
  const refScope = ref.from.variableScope;
  const varScope = ref.resolved['scope'].variableScope;
  const canBeUsedLater = refScope !== varScope || isInLoop(id);

  if (prevRhsNode && isInside(id, prevRhsNode)) {
    return prevRhsNode;
  }
  if (parent.type === 'AssignmentExpression' && granpa.type === 'ExpressionStatement' &&
    id === parent.left && !canBeUsedLater
  ) {
    return parent.right;
  }
  return null;
}

function isStorableFunction(funcNode: Identifier, rhsNode: Node) {
  let node = funcNode;
  let parent: Node = funcNode['parent'];

  while (parent && isInside(<Identifier>parent, rhsNode)) {
    switch (parent.type) {
      case 'SequenceExpression':
        if (parent.expressions[parent.expressions.length - 1] !== node) {
          return false;
        }
        break;
      case 'CallExpression':
      case 'NewExpression':
        return parent.callee !== node;
      case 'AssignmentExpression':
      case 'TaggedTemplateExpression':
      case 'YieldExpression':
        return true;
      default:
        if (STATEMENT_TYPE.test(parent.type)) {
          return true;
        }
    }
    node = <Identifier>parent;
    parent = parent['parent'];
  }
  return false;
}

function isExported(variable: Variable) {
  const definition = variable.defs[0];
  if (definition) {
    let node: Node = definition.node;
    if (node.type === 'VariableDeclarator') {
      node = node['parent'];
    } else if (definition.type === 'Parameter') {
      return false;
    }
    return node['parent'].type.indexOf('Export') === 0;
  }
  return false;
}

function isReadRef(ref: Reference) {
  return ref.isRead();
}

function isSelfReference(ref: Reference, nodes: Node[]) {
  let scope = ref.from;
  while (scope) {
    if (nodes.indexOf(scope.block) >= 0) {
      return true;
    }
    scope = scope.upper;
  }
  return false;
}

function isInside(inner: Identifier, outer: Node) {
  return (inner.range[0] >= outer.range[0] && inner.range[1] <= outer.range[1]);
}

function isInsideOfStorableFunction(id, rhsNode) {
  const funcNode = <Identifier>getUpperFunction(id);
  return (funcNode && isInside(funcNode, rhsNode) && isStorableFunction(funcNode, rhsNode));
}

function isReadForItself(ref: Reference, rhsNode: Node) {
  const id = ref.identifier;
  const parent = id['parent'];
  const isExpStmt = parent.parent.type === 'ExpressionStatement';
  return ref.isRead() && (
    (parent.type === 'AssignmentExpression' && isExpStmt && parent.left === id) ||
    (parent.type === 'UpdateExpression' && isExpStmt) ||
    (rhsNode && isInside(id, rhsNode) && !isInsideOfStorableFunction(id, rhsNode))
  );
}

function isForInRef(ref: Reference) {
  let target: Node = ref.identifier['parent'];
  if (target.type === 'VariableDeclarator') target = target['parent'].parent;
  if (target.type !== 'ForInStatement') return false;
  target = target.body.type === 'BlockStatement' ? target.body.body[0] : target.body;
  if (!target) return false;
  return target.type === 'ReturnStatement';
}

function isUsedVar({ defs, references }: Variable) {
  const fNodes = defs.filter(def => def.type === 'FunctionName')
    .map<Node>(def => def.node), isFuncDef = fNodes.length > 0;
  let rhsNode: Node = null;

  return references.some(ref => {
    if (isForInRef(ref)) return true;
    const forItself = isReadForItself(ref, rhsNode);
    rhsNode = getRhsNode(ref, rhsNode);
    return (isReadRef(ref) && !forItself &&
      !(isFuncDef && isSelfReference(ref, fNodes)));
  });
}

function isAfterLastUsedArg(variable: Variable, context: ScopeManager) {
  const def = variable.defs[0];
  const params = context.getDeclaredVariables(def.node);
  const posteriorParams = params.slice(params.indexOf(variable) + 1);
  return !posteriorParams.some(v => v.references.length > 0);
}

function collectUnuseds(scope: Scope, unusedVars: Variable[]) {
  let i, l;
  const { variables, childScopes } = scope;
  for (i = 0, l = variables.length; i < l; ++i) {
    const variable = variables[i];
    if (scope.type === 'class' && (<FunctionExpression>scope.block).id === variable.identifiers[0]) {
      continue;
    }
    if (scope.functionExpressionScope) {
      continue;
    }
    if (scope.type === 'function' && variable.name === 'arguments' && variable.identifiers.length === 0) {
      continue;
    }
    const def = variable.defs[0];
    if (def && def.type === 'Parameter') {
      const { type, kind } = def.node['parent'];
      if ((type === 'Property' || type === 'MethodDefinition') && kind === 'set') {
        continue;
      }
      if (types.namedTypes.Function.check(def.name['parent']) && !isAfterLastUsedArg(variable, scope['context'])) {
        continue;
      }
    }
    !isUsedVar(variable) && !isExported(variable) && unusedVars.push(variable);
  }
  for (i = 0, l = childScopes.length; i < l; ++i) {
    let childScope = childScopes[i];
    childScope['context'] = scope['context'];
    collectUnuseds(childScope, unusedVars);
  }
  return unusedVars;
}

function toAst(src: string, sourceType: string = 'script') {
  return parse(src, {
    parser: {
      parse(source: string, options) {
        return parser(source, { ...options, ...{ ecmaVersion: 10, sourceType, range: true, loc: true } });
      }
    }
  });
}

function toMember(node: Expression, ctx: string) {
  return memberExpression(identifier(ctx), node, false);
}

function toCode(ast: RecastAST) {
  return print(ast, { tabWidth: 2, quote: 'single' });
}

function canBeReplaced(node: Node, path, globals) {
  return Identifier.check(node) && !isDeclared(<Identifier>node, path) && !isGlobal(<Identifier>node, globals);
}

function replace(name: string, ctx: string, path, position?: number) {
  if (typeof position === 'number') {
    let node = path.get(name, position).value;
    path.get(name, position).replace(toMember(node, ctx));
  } else {
    let node = path.get(name).value;
    path.get(name).replace(toMember(node, ctx));
  }
}

function isDeclared(node: Identifier, { scope }: Path<Node>) {
  return scope.declares(node.name);
}

function isGlobal(node: Identifier, globals = []) {
  let { name } = node;
  let isGlob = name in builtin || name in browser || name in nodejs || name in amd;
  return name === 'name' ? false : name.startsWith('_$') || isGlob || !!~globals.indexOf(name);
}

function isReplaceable(node: Node, path: Path<Node>, globals: string[]) {
  let checks = types.namedTypes;
  return checks.AssignmentExpression.check(node) ?
    isReplaceable((<any>node).left, path, globals) :
    checks.UpdateExpression.check(node) ?
      isReplaceable((<any>node).argument, path, globals) :
      checks.MemberExpression.check(node) ?
        isReplaceable((<any>node).object, path, globals) :
        canBeReplaced(node, path, globals);
}

function isSameIdentifier(a: Identifier, b: Identifier) {
  return a.name === b.name && JSON.stringify(a.loc) === JSON.stringify(b.loc);
}
