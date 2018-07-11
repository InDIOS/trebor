import { parse } from 'espree';
import { replace } from 'estraverse';
import globals = require('acorn-globals');
import { Syntax as types } from 'esprima';
import { generate, GenerateOptions } from 'escodegen';
const { builtin, browser, node: nodejs, amd } = require('globals');
import { Node, Identifier, UpdateExpression, ExpressionStatement, MemberExpression, AssignmentOperator } from 'estree';

const exp = (src: string) => (<ExpressionStatement>parseScript(src).body[0]).expression;

const options = {
  range: false,
  loc: false,
  comment: false,
  token: false,
  attachComment: false,
  ecmaVersion: 9
};

function parseScript(src: string) {
  return parse(src, {
    ...options,
    sourceType: 'script'
  });
}

function parseModule(src: string) {
  return parse(src, {
    ...options,
    sourceType: 'module'
  });
}

function getMemberName(node: Node): string {
  return node.type === types.Identifier ?
    node.name :
    node.type === types.AssignmentExpression ?
      getMemberName(node.left) :
      node.type === types.UpdateExpression ?
        getMemberName(node.argument) :
        getMemberName((<MemberExpression>node).object);
}

function generator(node: Node, format: { [key: string]: any } = {}) {
  return generate(node, { format: {...{ semicolons: false }, ...format} });
}

/**
 * Change a node to a CallExpression node with the desire 'ctx'.
 * @param {{[key: string]: any}} node
 * @param {string} scope
 * @param {string[]} globs
 * @param {any} ctrl
 */
function assignContext(node: Node, scope: string, deps: string[], globs: string[], ctrl: any) {
  let name = getMemberName(node);
  if (~deps.indexOf(name)) {
    if (node.type === types.AssignmentExpression) {
      let cond = '';
      let rest = '';
      let member = '';
      let { operator, left, right } = node;
      operator = <AssignmentOperator>operator.replace('=', '').trim();
      let path = generator(left);
      let lvalue = ctx(generator(right), scope, globs);
      let isValueGlob = !!~lvalue.indexOf(`('${name}' in ${scope} ? `);
      if (isValueGlob) {
        lvalue = ctx(generator(right), scope, globs, true);
      }
      if (operator) {
        left['name'] = name;
        let src = ctx(generator(left), scope, []);
        if (~src.indexOf(path)) {
          member = `${src} ${operator} `;
        } else {
          let rvalue = isValueGlob ? ctx(generator(right), scope, [name]) : lvalue;
          [cond, rest] = src.split('?');
          rest = rest.split(':')[0].trim();
          member = `${path.replace(name, rest)} ${operator} `;
          cond = `${cond.trim().slice(1)} ? `;
          rest = `: ${path} ${operator}= ${rvalue}`;
        }
      }
      ctrl.skip();
      return exp(`${cond}${scope}.$set('${path}', ${member}${lvalue})${rest}`);
    } else {
      let { argument, operator } = <UpdateExpression>node;
      let path = generator(argument);
      let value = ctx(generator(argument), scope, []);
      ctrl.skip();
      return exp(`${scope}.$set('${path}', ${value} ${operator[0]} 1)`);
    }
  } else {
    return node;
  }
}

/**
 * Change an Identifier node to a MemberExpression node with the desire 'ctx'.
 * @param {{[key: string]: any}} node
 * @param {string} scope
 * @param {string[]} globs
 * @param {any} ctrl
 */
function context<N extends Node>(node: N, scope: string, globs: string[]) {
  let src = '';
  const name = node['name'];
  if (~globs.indexOf(name)) {
    const member = (prop: string) => `${scope}.${prop}`;
    if (!context['glob'] && (name in builtin || name in browser || name in nodejs || name in amd)) {
      src = `'${name}' in ${scope} ? ${member(name)} : ${name}`;
    }
    let path = generator(node);
    if (!src) {
      src = member(path);
    }
  }
  return src ? exp(src) : node;
}

/**
 * Set a parent object to all globals.
 */
export function ctx(src: string, scope: string, globs: string[], noGlobs: boolean = false) {
  if (src[0] === '{') src = `let _$o = ${src}`;
  if (noGlobs) context['glob'] = true;
  const deps = globals(src).map(({ name }) => name)
    .filter(glob => glob !== 'this' && glob !== 'arguments' && !~globs.indexOf(glob));
  const ast: Node = replace(parseScript(src), {
    enter(node) {
      switch (node.type) {
        case types.Property: {
          if (node.value.type === types.Identifier) {
            if (~deps.indexOf((<Identifier>node.value).name)) node.shorthand = false;
            node.value = context(node.value, scope, deps);
            this.skip();
          }
          break;
        }
        case types.CallExpression: {
          if (node.callee.type === types.Identifier) {
            node.callee = context(node.callee, scope, deps);
          }
          for (let i = 0; i < node.arguments.length; i++) {
            const argument = node.arguments[i];
            if (argument.type === types.Identifier) {
              node.arguments.splice(i, 1, context(argument, scope, deps));
            }
          }
          break;
        }
        case types.MemberExpression: {
          if (node.object.type === types.Identifier) {
            node.object = context(node.object, scope, deps);
            if (node.computed && node.property.type === types.Identifier) {
              node.property = context(node.property, scope, deps);
            }
            this.skip();
          }
          break;
        }
        case types.ExpressionStatement: {
          if (node.expression.type === types.Identifier) {
            node.expression = context(node.expression, scope, deps);
            this.skip();
          }
          break;
        }
        case types.TemplateLiteral: {
          for (let i = 0; i < node.expressions.length; i++) {
            const expression = node.expressions[i];
            if (expression.type === types.Identifier) {
              node.expressions.splice(i, 1, context(expression, scope, deps));
            }
          }
          break;
        }
        case types.SpreadElement:
        case types.UnaryExpression:
        case types.UpdateExpression: {
          if (node.type === types.UpdateExpression) {
            node = assignContext(node, scope, deps, globs, this);
          } else if (node.argument.type === types.Identifier) {
            node.argument = context(node.argument, scope, deps);
          }
          break;
        }
        case types.ArrayExpression: {
          for (let i = 0; i < node.elements.length; i++) {
            const element = node.elements[i];
            if (element.type === types.Identifier) {
              node.elements.splice(i, 1, context(element, scope, deps));
            }
          }
          break;
        }
        case types.BinaryExpression:
        case types.LogicalExpression:
        case types.AssignmentExpression: {
          if (node.type === types.AssignmentExpression) {
            node = assignContext(node, scope, deps, globs, this);
          } else {
            if (node.left.type === types.Identifier) {
              node.left = context(node.left, scope, deps);
            }
            if (node.right.type === types.Identifier) {
              node.right = context(node.right, scope, deps);
            }
          }
          break;
        }
        case types.ConditionalExpression: {
          if (node.test.type === types.Identifier) {
            node.test = context(node.test, scope, deps);
          }
          if (node.alternate.type === types.Identifier) {
            node.alternate = context(node.alternate, scope, deps);
          }
          if (node.consequent.type === types.Identifier) {
            node.consequent = context(node.consequent, scope, deps);
          }
          break;
        }
        default:
          break;
      }
      return node;
    }
  });
  delete context['glob'];
  const code = generator(ast).replace('let _$o = ', '');
  return code;
}

export function toOptions(src: string) {
  const opts = <GenerateOptions>{ compact: true };
  const imports: string[] = [];
  let options: string = '';
  const tree = parseModule(src);
  const ast: Node = replace(tree, {
    enter(node) {
      switch (node.type) {
        case types.ImportDeclaration: {
          imports.push(generator(node, opts));
          this.remove();
          break;
        }
        case types.ExportDefaultDeclaration: {
          options = generator(node.declaration, opts);
          this.remove();
          break;
        }
        default:
          return node;
      }
    }
  });
  const extras = generator(ast, opts);
  return { imports, extras, options };
}

// console.log(ctx('a || b === c.d', 'this', []));
