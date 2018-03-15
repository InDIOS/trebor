import { replace } from 'estraverse';
import globals = require('acorn-globals');
import { generate, GenerateOptions } from 'escodegen';
import { Node, Identifier, ConditionalExpression } from 'estree';
const { builtin, browser, node: nodejs, amd } = require('globals');
import { Syntax as types, parseScript, parseModule } from 'esprima';

/**
 * Change an Identifier node to a MemberExpression node with the desire 'ctx'.
 */
function context(globs: string[], node: Node, prop: string, ctx: string) {
	const { name } = prop ? (<Identifier>node[prop]) : <Identifier>node;
	if (~globs.indexOf(name)) {
		let condition: ConditionalExpression = null;
		let object = ctx ? { type: types.Identifier, name: ctx } : { type: types.ThisExpression };
		const member = (property: Node) => ({ type: types.MemberExpression, object, property });
		if (name in builtin || name in browser || name in nodejs || name in amd) {
			const glob = { type: types.Identifier, name };
			condition = <ConditionalExpression>{
				type: types.ConditionalExpression,
				test: {
					type: types.BinaryExpression,
					operator: 'in', left: { type: types.Literal, value: name }, right: object
				},
				consequent: member(glob),
				alternate: glob
			};
			condition['context'] = true;
		}
		if (prop) {
			node[prop] = condition ? condition : member(node[prop]);
		} else {
			if (condition) {
				Object.assign(node, condition);
			} else {
				const id = { type: types.Identifier, name: (<Identifier>node).name };
				Object.assign(node, member(id));
				delete (<Identifier>node).name;
			}
		}
	}
}

/**
 * Set a parent object to all globals.
 */
export function ctx(src: string, ctx: string, globs: string[]) {
	if (src[0] === '{') src = `let _$o = ${src}`;
	const deps = globals(src).map(({ name }) => name)
		.filter(glob => glob !== 'this' && glob !== 'arguments' && !~globs.indexOf(glob));
	const ast: Node = replace(parseScript(src), {
		enter(node) {
			switch (node.type) {
				case types.Property: {
					if (~deps.indexOf((<Identifier>node.value).name)) node.shorthand = false;
					context(deps, node, 'value', ctx);
					break;
				}
				case types.CallExpression: {
					context(deps, node, 'callee', ctx);
					for (let i = 0; i < node.arguments.length; i++) {
						const argument = node.arguments[i];
						if ((<Identifier>argument).name) {
							context(deps, argument, null, ctx);
							node.arguments.splice(i, 1, argument);
						}
					}
					break;
				}
				case types.MemberExpression: {
					context(deps, node, 'object', ctx);
					break;
				}
				case types.ExpressionStatement: {
					context(deps, node, 'expression', ctx);
					break;
				}
				case types.TemplateLiteral: {
					for (let i = 0; i < node.expressions.length; i++) {
						const expression = node.expressions[i];
						if ((<Identifier>expression).name) {
							context(deps, expression, null, ctx);
							node.expressions.splice(i, 1, expression);
						}
					}
					break;
				}
				case types.SpreadElement:
				case types.UnaryExpression:
				case types.UpdateExpression: {
					context(deps, node, 'argument', ctx);
					break;
				}
				case types.ArrayExpression: {
					for (let i = 0; i < node.elements.length; i++) {
						const element = node.elements[i];
						if ((<Identifier>element).name) {
							context(deps, element, null, ctx);
							node.elements.splice(i, 1, element);
						}
					}
					break;
				}
				case types.BinaryExpression:
				case types.AssignmentExpression: {
					context(deps, node, 'left', ctx);
					context(deps, node, 'right', ctx);
					break;
				}
				case types.ConditionalExpression: {
					if (!node['context']) {
						context(deps, node, 'test', ctx);
						context(deps, node, 'alternate', ctx);
						context(deps, node, 'consequent', ctx);
					}
					break;
				}
				default:
					break;
			}
			return node;
		}
	});
	const code = generate(ast, { format: { semicolons: false } }).replace('let _$o = ', '');
	return code;
}

export function toOptions(src: string) {
	const opts = <GenerateOptions>{ format: { compact: true } };
	const imports: string[] = [];
	let options: string = '';
	const tree = parseModule(src);
	const ast: Node = replace(tree, {
		enter(node) {
			switch (node.type) {
				case types.ImportDeclaration: {
					imports.push(generate(node, opts));
					this.remove();
					break;
				}
				case types.ExportDefaultDeclaration: {
					options = generate(node.declaration, opts);
					this.remove();
					break;
				}
				default:
					return node;
			}
		}
	});
	const extras = generate(ast, opts);
	return { imports, extras, options };
}
