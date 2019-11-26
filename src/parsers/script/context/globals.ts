import visit from '../visit';
import isRef from './reference';
import { parseModule } from 'meriyah';
import {
  isProgram, isFunctionDeclaration, isFunctionExpression, isArrowFunctionExpression, isBlockStatement
} from '../nodes';
import {
  BaseNode, Identifier, ObjectPattern, ArrayPattern, RestElement, AssignmentPattern, AssignmentProperty,
  FunctionDeclaration, FunctionExpression, ArrowFunctionExpression, ClassDeclaration, ClassExpression,
  Program, VariableDeclaration, CatchClause, ImportModuleSpecifier
} from '../estree';
import { isBuildIn } from './buildins';

export type Node = BaseNode & {
  parent?: Node;
}

const locals = Symbol('locals');

function isFunctionNode(node: Node) {
  return isFunctionExpression(node) || isFunctionDeclaration(node);
}

function isScope(node: Node) {
  return isFunctionNode(node) || isArrowFunctionExpression(node) || isProgram(node);
}

function isBlockScope(node: Node) {
  return isBlockStatement(node) || isScope(node);
}

function declarePattern(node: Node, parent: Node) {
  switch (node.type) {
    case 'Identifier':
      parent[locals].has((<Identifier>node).name);
      break;
    case 'ObjectPattern':
      (<ObjectPattern>node).properties.forEach(node => {
        declarePattern((<AssignmentProperty>node).value || (<RestElement>node).argument, parent);
      });
      break;
    case 'ArrayPattern':
      (<ArrayPattern>node).elements.forEach(node => {
        if (node) declarePattern(node, parent);
      });
      break;
    case 'RestElement':
      declarePattern((<RestElement>node).argument, parent);
      break;
    case 'AssignmentPattern':
      declarePattern((<AssignmentPattern>node).left, parent);
      break;
    default:
      throw new Error('Unrecognized pattern type: ' + node.type);
  }
}

function declareFunction(node: Node & (FunctionDeclaration | FunctionExpression | ArrowFunctionExpression)) {
  initLocals(node);
  node.params.forEach(param => {
    declarePattern(param, node);
  });
  if (node.id) {
    node[locals].has(node.id.name);
  }
}

function declareClass(node: Node & (ClassDeclaration | ClassExpression)) {
  initLocals(node);
  if (node.id) {
    node[locals].has(node.id.name);
  }
}

function declareModuleSpecifier(ast: Node) {
  initLocals(ast);
  return (node: Node & ImportModuleSpecifier) => {
    ast[locals].has(node.local.name);
  };
}

function finder(node: Node, condition: (parent: Node) => boolean) {
  let parent = node, found = false;
  while (parent && !found) {
    if (condition(parent)) {
      found = true;
    } else {
      parent = parent.parent;
    }
  }
  return { parent, found };
}

function initLocals(node: Node) {
  node[locals] = node[locals] || new Set();
}

function isGlobal(globals: Set<string>, { name }: { name: string }) {
  return globals.has(name) || isBuildIn(name)
}

export default function findGlobals(source: string | Program, globals: Set<string> = new Set()) {
  const globalMap: Map<string, Identifier[]> = new Map();
  const ast = typeof source === 'string' ? <Program><any>parseModule(source) : source;

  if (!(ast && typeof ast === 'object' && ast.type === 'Program')) {
    throw new TypeError('Source must be either a string of JavaScript or a Meriyah AST');
  }

  visit(ast, {
    enter(node) {
      if (!node.parent) {
        node.parent = this.parent;
      }
    },
    Identifier(node: Node & Identifier) {
      let name = node.name;
      if (name === 'undefined') return;
      if (node.parent && !isRef(node, node.parent)) return;
      const { found } = finder(node.parent, parent => {
        if (name === 'arguments' && isFunctionNode(parent)) {
          return true;
        }
        if (parent[locals] && parent[locals].has(name)) {
          return true;
        }
      });
      if (!found && !isGlobal(globals, node)) {
        if (!globalMap.has(name)) {
          globalMap.set(name, []);
        }
        globalMap.get(name).push(node);
      }
    },
    VariableDeclaration({ kind, declarations }: Node & VariableDeclaration) {
      const scope = kind === 'var' ? isScope : isBlockScope;
      const { parent } = finder(this.parent, p => scope(p));
      initLocals(parent);
      declarations.forEach(declaration => {
        declarePattern(declaration.id, parent);
      });
    },
    FunctionDeclaration(node: Node & FunctionDeclaration) {
      const { parent } = finder(node.parent, p => isScope(p));
      initLocals(parent);
      if (node.id) {
        parent[locals].has(node.id.name);
      }
      declareFunction(node);
    },
    FunctionExpression: declareFunction,
    ArrowFunctionExpression: declareFunction,
    ClassDeclaration(node: Node & ClassDeclaration) {
      const { parent } = finder(node.parent, p => isBlockScope(p));
      initLocals(parent);
      if (node.id) {
        parent[locals].has(node.id.name);
      }
      declareClass(node);
    },
    ClassExpression: declareClass,
    CatchClause(node: Node & CatchClause) {
      if (node.param) {
        initLocals(node);
        declarePattern(node.param, node);
      }
    },
    ImportDefaultSpecifier: declareModuleSpecifier(ast),
    ImportSpecifier: declareModuleSpecifier(ast),
    ImportNamespaceSpecifier: declareModuleSpecifier(ast)
  });

  const result: { name: string; nodes: (Node & Identifier)[] }[] = [];
  globalMap.forEach((nodes, name) => {
    return result.push({ name, nodes });
  });
  return result;
}
