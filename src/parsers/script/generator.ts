import {
  Node, Literal, RegExpLiteral, Identifier, MetaProperty, UpdateExpression, AssignmentExpression,
  AssignmentPattern, ConditionalExpression, NewExpression, CallExpression, MemberExpression,
  BinaryExpression, UnaryExpression, SequenceExpression, Property, ObjectExpression,
  ArrayExpression, TemplateLiteral, AwaitExpression, YieldExpression, RestElement,
  TaggedTemplateExpression, ForInStatement, FunctionDeclaration, BlockStatement,
  ForOfStatement, Program, ExpressionStatement, IfStatement, LabeledStatement, BreakStatement,
  ContinueStatement, WithStatement, SwitchStatement, ReturnStatement, ThrowStatement, TryStatement,
  WhileStatement, DoWhileStatement, ForStatement, VariableDeclaration, VariableDeclarator,
  ClassDeclaration, ImportDeclaration, ImportSpecifier, ExportDefaultDeclaration,
  ExportNamedDeclaration, ExportAllDeclaration, MethodDefinition, ClassExpression,
  ArrowFunctionExpression, ObjectPattern
} from './estree';
import { Writable } from 'stream';
// const { stringify } = JSON;

type _Node = { type: string };

if (!String.prototype.repeat) {
  throw new Error(`String.prototype.repeat is undefined`);
}

function precedence(node: Node) {
  switch (node.type) {
    case 'SequenceExpression':
      return 1;
    case 'ArrowFunctionExpression':
    case 'YieldExpression':
      return 2;
    case 'AssignmentExpression':
      return 3;
    case 'ConditionalExpression':
      return 4;
    case 'LogicalExpression':
      switch (node.operator) {
        case '||':
          return 5;
        case '&&':
          return 6;
      }
    case 'BinaryExpression':
      switch (node.operator) {
        case '|':
          return 7;
        case '^':
          return 8;
        case '&':
          return 9;
        case '==':
        case '!=':
        case '===':
        case '!==':
          return 10;
        case '<':
        case '<=':
        case '>':
        case '>=':
        case 'in':
        case 'instanceof':
          return 11;
        case '<<':
        case '>>':
        case '>>>':
          return 12;
        case '+':
        case '-':
          return 13;
        case '*':
        case '/':
        case '%':
          return 14;
        case '**':
          return 15;
      }
    case 'UnaryExpression':
    case 'AwaitExpression':
      return 16;
    case 'UpdateExpression':
      return node.prefix ? 16 : 17;
    case 'Literal':
    case 'ObjectExpression':
      return 17;
    case 'CallExpression':
    case 'MemberExpression':
      return 18;
    case 'NewExpression':
      return !node.arguments.length ? 18 : 19;
    default:
      return 20;
  }
}

function stringify(value: string | boolean | number | null, quote = `'`) {
  const quoteReplacer = new RegExp(`${quote}`, 'g');
  switch (typeof value) {
    case 'string':
      value = JSON.stringify(value);
      return `${quote}${value.slice(1, value.length - 1).replace(quoteReplacer, `\\${quote}`)}${quote}`;
    case 'number':
    case 'boolean':
    case 'object':
      return `${value}`;
    default:
      throw new Error(`Not supported type '${typeof value}' stringifycation.`);
  }
}

function formatSequence(state: State, nodes: _Node[]) {
  /*
  Writes into `state` a sequence of `nodes`.
  */
  const { generator } = state;
  state.write('(');
  if (nodes != null && nodes.length > 0) {
    generator[nodes[0].type](state, nodes[0]);
    const { length } = nodes;
    for (let i = 1; i < length; i++) {
      const param = nodes[i];
      state.write(', ');
      generator[param.type](state, param);
    }
  }
  state.write(')');
}

function expressionNeedsParenthesis(node: _Node, parentNode: _Node, isRightHand: boolean) {
  const nodePrecedence = precedence(<Node>node);
  const parentNodePrecedence = precedence(<Node>parentNode);
  let needs = false;

  if (nodePrecedence === parentNodePrecedence && nodePrecedence === 15) {
    // Exponentiation operator has right-to-left associativity
    needs = !isRightHand;
  } else if (nodePrecedence !== parentNodePrecedence) {
    // Different node types
    needs = nodePrecedence < parentNodePrecedence;
  } else if (nodePrecedence !== 13 && nodePrecedence !== 14) {
    // Not a `LogicalExpression` or `BinaryExpression`
    needs = false;
  } else if (isRightHand) {
    // Parenthesis are used if both operators have the same precedence
    needs = nodePrecedence <= parentNodePrecedence;
  } else {
    needs = nodePrecedence < parentNodePrecedence;
  }

  return needs;
}

function formatBinaryExpressionPart(state: State, node: _Node, parentNode: _Node, isRightHand: boolean) {
  /*
  Writes into `state` a left-hand or right-hand expression `node`
  from a binary expression applying the provided `operator`.
  The `isRightHand` parameter should be `true` if the `node` is a right-hand argument.
  */
  const { generator } = state;
  if (expressionNeedsParenthesis(node, parentNode, isRightHand)) {
    state.write('(');
    generator[node.type](state, node);
    state.write(')');
  } else {
    generator[node.type](state, node);
  }
}

function reindent(state: State, text: string, indent: string, lineEnd: string) {
  /*
  Writes into `state` the `text` string reindented with the provided `indent`.
  */
  const lines = text.split('\n');
  const end = lines.length - 1;
  state.write(lines[0].trim());
  if (end > 0) {
    state.write(lineEnd);
    for (let i = 1; i < end; i++) {
      state.write(indent + lines[i].trim() + lineEnd);
    }
    state.write(indent + lines[end].trim());
  }
}

function formatComments(state: State, comments: any, indent: string, lineEnd: string) {
  /*
  Writes into `state` the provided list of `comments`, with the given `indent` and `lineEnd` strings.
  Line comments will end with `"\n"` regardless of the value of `lineEnd`.
  Expects to start on a new unindented line.
  */
  const { length } = comments;
  for (let i = 0; i < length; i++) {
    const comment = comments[i];
    state.write(indent);
    if (comment.type[0] === 'L') {
      // Line comment
      state.write('// ' + comment.value.trim() + '\n');
    } else {
      // Block comment
      state.write('/*');
      reindent(state, comment.value, indent, lineEnd);
      state.write('*/' + lineEnd);
    }
  }
}

function hasCallExpression(node: Node) {
  /*
  Returns `true` if the provided `node` contains a call expression and `false` otherwise.
  */
  let currentNode = node;
  while (currentNode != null) {
    const { type } = currentNode;
    if (type[0] === 'C' && type[1] === 'a') {
      // Is CallExpression
      return true;
    } else if (type[0] === 'M' && type[1] === 'e' && type[2] === 'm') {
      // Is MemberExpression
      currentNode = (<MemberExpression>currentNode).object;
    } else {
      return false;
    }
  }
}

function formatVariableDeclaration(state: State, node: VariableDeclaration) {
  /*
  Writes into `state` a variable declaration.
  */
  const { generator } = state;
  const { declarations } = node;
  const { length } = declarations;
  if (length > 0) {
    state.write(node.kind + ' ');
    generator.VariableDeclarator(state, declarations[0]);
    for (let i = 1; i < length; i++) {
      state.write(', ');
      generator.VariableDeclarator(state, declarations[i]);
    }
  }
}

let forInStatement: (state: State, node: ForInStatement | ForOfStatement) => void,
  functionDeclaration: (state: State, node: FunctionDeclaration) => void,
  restElement: (state: State, node: RestElement) => void,
  binaryExpression: (state: State, node: BinaryExpression) => void,
  arrayExpression: (state: State, node: ArrayExpression) => void,
  blockStatement: (state: State, node: BlockStatement) => void;

export const generator = {
  Program(state: State, node: Program) {
    const indent = state.indent.repeat(state.indentLevel);
    const { lineEnd, writeComments } = state;
    if (writeComments && node.comments != null) {
      formatComments(state, node.comments, indent, lineEnd);
    }
    const statements = node.body;
    const { length } = statements;
    for (let i = 0; i < length; i++) {
      const statement = statements[i];
      if (writeComments && statement.comments != null) {
        formatComments(state, statement.comments, indent, lineEnd);
      }
      state.write(indent);
      this[statement.type](state, statement);
      state.write(lineEnd);
    }
    if (writeComments && node.trailingComments != null) {
      formatComments(state, node.trailingComments, indent, lineEnd);
    }
  },
  BlockStatement: (blockStatement = (state, node) => {
    const indent = state.indent.repeat(state.indentLevel++);
    const { lineEnd, writeComments } = state;
    const statementIndent = indent + state.indent;
    state.write('{');
    const statements = node.body;
    if (statements != null && statements.length > 0) {
      state.write(lineEnd);
      if (writeComments && node.comments != null) {
        formatComments(state, node.comments, statementIndent, lineEnd);
      }
      const { length } = statements;
      for (let i = 0; i < length; i++) {
        const statement = statements[i];
        if (writeComments && statement.comments != null) {
          formatComments(state, statement.comments, statementIndent, lineEnd);
        }
        state.write(statementIndent);
        generator[statement.type](state, <any>statement);
        state.write(lineEnd);
      }
      state.write(indent);
    } else {
      if (writeComments && node.comments != null) {
        state.write(lineEnd);
        formatComments(state, node.comments, statementIndent, lineEnd);
        state.write(indent);
      } else {
        state.write(' ');
      }
    }
    if (writeComments && node.trailingComments != null) {
      formatComments(state, node.trailingComments, statementIndent, lineEnd);
    }
    state.write('}');
    state.indentLevel--;
  }),
  ClassBody: blockStatement,
  EmptyStatement(state: State) {
    state.end();
  },
  ExpressionStatement(state: State, node: ExpressionStatement) {
    if (node.expression.type[0] === 'O' && node.expression.type[6] === 'E') {
      state.write('(');
      this[node.expression.type](state, node.expression);
      state.write(')');
    } else {
      this[node.expression.type](state, node.expression);
    }
    state.end();
  },
  IfStatement(state: State, node: IfStatement) {
    state.write('if (');
    this[node.test.type](state, node.test);
    state.write(') ');
    this[node.consequent.type](state, node.consequent);
    if (node.alternate != null) {
      state.write(' else ');
      this[node.alternate.type](state, node.alternate);
    }
  },
  LabeledStatement(state: State, node: LabeledStatement) {
    this[node.label.type](state, node.label);
    state.write(': ');
    this[node.body.type](state, node.body);
  },
  BreakStatement(state: State, node: BreakStatement) {
    state.write('break');
    if (node.label != null) {
      state.write(' ');
      this[node.label.type](state, node.label);
    }
    state.end();
  },
  ContinueStatement(state: State, node: ContinueStatement) {
    state.write('continue');
    if (node.label != null) {
      state.write(' ');
      this[node.label.type](state, node.label);
    }
    state.end();
  },
  WithStatement(state: State, node: WithStatement) {
    state.write('with (');
    this[node.object.type](state, node.object);
    state.write(') ');
    this[node.body.type](state, node.body);
  },
  SwitchStatement(state: State, node: SwitchStatement) {
    const indent = state.indent.repeat(state.indentLevel++);
    const { lineEnd, writeComments } = state;
    state.indentLevel++;
    const caseIndent = indent + state.indent;
    const statementIndent = caseIndent + state.indent;
    state.write('switch (');
    this[node.discriminant.type](state, node.discriminant);
    state.write(') {' + lineEnd);
    const { cases: occurences } = node;
    const { length: occurencesCount } = occurences;
    for (let i = 0; i < occurencesCount; i++) {
      const occurence = occurences[i];
      if (writeComments && occurence.comments != null) {
        formatComments(state, occurence.comments, caseIndent, lineEnd);
      }
      if (occurence.test) {
        state.write(caseIndent + 'case ');
        this[occurence.test.type](state, occurence.test);
        state.write(':' + lineEnd);
      } else {
        state.write(caseIndent + 'default:' + lineEnd);
      }
      const { consequent } = occurence;
      const { length: consequentCount } = consequent;
      for (let i = 0; i < consequentCount; i++) {
        const statement = consequent[i];
        if (writeComments && statement.comments != null) {
          formatComments(state, statement.comments, statementIndent, lineEnd);
        }
        state.write(statementIndent);
        this[statement.type](state, statement);
        state.write(lineEnd);
      }
    }
    state.indentLevel -= 2;
    state.write(indent + '}');
  },
  ReturnStatement(state: State, node: ReturnStatement) {
    state.write('return');
    if (node.argument) {
      state.write(' ');
      this[node.argument.type](state, node.argument);
    }
    state.end();
  },
  ThrowStatement(state: State, node: ThrowStatement) {
    state.write('throw ');
    this[node.argument.type](state, node.argument);
    state.end();
  },
  TryStatement(state: State, node: TryStatement) {
    state.write('try ');
    this[node.block.type](state, node.block);
    if (node.handler) {
      const { handler } = node;
      if (handler.param == null) {
        state.write(' catch ');
      } else {
        state.write(' catch (');
        this[handler.param.type](state, handler.param);
        state.write(') ');
      }
      this[handler.body.type](state, handler.body);
    }
    if (node.finalizer) {
      state.write(' finally ');
      this[node.finalizer.type](state, node.finalizer);
    }
  },
  WhileStatement(state: State, node: WhileStatement) {
    state.write('while (');
    this[node.test.type](state, node.test);
    state.write(') ');
    this[node.body.type](state, node.body);
  },
  DoWhileStatement(state: State, node: DoWhileStatement) {
    state.write('do ');
    this[node.body.type](state, node.body);
    state.write(' while (');
    this[node.test.type](state, node.test);
    state.write(');');
  },
  ForStatement(state: State, node: ForStatement) {
    state.write('for (');
    if (node.init != null) {
      const { init } = node;
      if (init.type[0] === 'V') {
        formatVariableDeclaration(state, <VariableDeclaration>init);
      } else {
        this[init.type](state, init);
      }
    }
    state.write('; ');
    if (node.test) {
      this[node.test.type](state, node.test);
    }
    state.write('; ');
    if (node.update) {
      this[node.update.type](state, node.update);
    }
    state.write(') ');
    this[node.body.type](state, node.body);
  },
  ForInStatement: (forInStatement = (state, node) => {
    state.write(`for ${(<ForOfStatement>node).await ? 'await ' : ''}(`);
    const { left } = node;
    if (left.type[0] === 'V') {
      formatVariableDeclaration(state, <VariableDeclaration>left);
    } else {
      generator[left.type](state, <any>left);
    }
    // Identifying whether node.type is `ForInStatement` or `ForOfStatement`
    state.write(node.type[3] === 'I' ? ' in ' : ' of ');
    generator[node.right.type](state, node.right);
    state.write(') ');
    generator[node.body.type](state, <any>node.body);
  }),
  ForOfStatement: forInStatement,
  DebuggerStatement(state: State) {
    state.write('debugger;' + state.lineEnd);
  },
  FunctionDeclaration: (functionDeclaration = (state, node) => {
    node.async && state.write('async ');
    state.write('function');
    node.generator && state.write('*');
    state.write(` ${node.id ? node.id.name : ''}`);
    formatSequence(state, node.params);
    state.write(' ');
    generator[node.body.type](state, node.body);
  }),
  FunctionExpression: functionDeclaration,
  VariableDeclaration(state: State, node: VariableDeclaration) {
    formatVariableDeclaration(state, node);
    node.declarations.length && state.end();
  },
  VariableDeclarator(state: State, node: VariableDeclarator) {
    this[node.id.type](state, node.id);
    if (node.init != null) {
      state.write(' = ');
      this[node.init.type](state, node.init);
    }
  },
  ClassDeclaration(state: State, node: ClassDeclaration) {
    state.write(`class ${node.id ? `${node.id.name} ` : ''}`);
    if (node.superClass) {
      state.write('extends ');
      this[node.superClass.type](state, node.superClass);
      state.write(' ');
    }
    this.ClassBody(state, node.body);
  },
  ImportDeclaration(state: State, node: ImportDeclaration) {
    state.write('import ');
    const { specifiers } = node;
    const { length } = specifiers;
    // NOTE: Once babili is fixed, put this after condition
    // https://github.com/babel/babili/issues/430
    let i = 0;
    if (length > 0) {
      for (; i < length;) {
        if (i > 0) {
          state.write(', ');
        }
        const specifier = specifiers[i];
        const type = specifier.type[6];
        if (type === 'D') {
          // ImportDefaultSpecifier
          state.write(specifier.local.name);
          i++;
        } else if (type === 'N') {
          // ImportNamespaceSpecifier
          state.write('* as ' + specifier.local.name);
          i++;
        } else {
          // ImportSpecifier
          break;
        }
      }
      if (i < length) {
        state.write('{ ');
        for (; ;) {
          const specifier = specifiers[i];
          const { name } = (<ImportSpecifier>specifier).imported;
          state.write(name);
          if (name !== specifier.local.name) {
            state.write(' as ' + specifier.local.name);
          }
          if (++i < length) {
            state.write(', ');
          } else {
            break;
          }
        }
        state.write(' }');
      }
      state.write(' from ');
    }
    this.Literal(state, node.source);
    state.end();
  },
  ExportDefaultDeclaration(state: State, node: ExportDefaultDeclaration) {
    state.write('export default ');
    this[node.declaration.type](state, node.declaration);
    if (node.declaration.type[0] !== 'F') {
      // All expression nodes except `FunctionExpression`
      state.end();
    }
  },
  ExportNamedDeclaration(state: State, node: ExportNamedDeclaration) {
    state.write('export ');
    if (node.declaration) {
      this[node.declaration.type](state, node.declaration);
    } else {
      state.write('{');
      const { specifiers } = node,
        { length } = specifiers;
      if (length > 0) {
        for (let i = 0; ;) {
          const specifier = specifiers[i];
          const { name } = specifier.local;
          state.write(name);
          if (name !== specifier.exported.name) {
            state.write(' as ' + specifier.exported.name);
          }
          if (++i < length) {
            state.write(', ');
          } else {
            break;
          }
        }
      }
      state.write('}');
      if (node.source) {
        state.write(' from ');
        this.Literal(state, node.source);
      }
      state.end();
    }
  },
  ExportAllDeclaration(state: State, node: ExportAllDeclaration) {
    state.write('export * from ');
    this.Literal(state, node.source);
    state.end();
  },
  MethodDefinition(state: State, node: MethodDefinition) {
    if (node.static) {
      state.write('static ');
    }
    const kind = node.kind[0];
    if (kind === 'g' || kind === 's') {
      // Getter or setter
      state.write(node.kind + ' ');
    }
    if (node.value.async) {
      state.write('async ');
    }
    if (node.value.generator) {
      state.write('*');
    }
    if (node.computed) {
      state.write('[');
      this[node.key.type](state, node.key);
      state.write(']');
    } else {
      this[node.key.type](state, node.key);
    }
    formatSequence(state, node.value.params);
    state.write(' ');
    this[node.value.body.type](state, node.value.body);
  },
  ClassExpression(state: State, node: ClassExpression) {
    this.ClassDeclaration(node, state);
  },
  ArrowFunctionExpression(state: State, node: ArrowFunctionExpression) {
    state.write(node.async ? 'async ' : '');
    const { params } = node;
    if (params != null) {
      // Omit parenthesis if only one named parameter
      if (params.length === 1 && params[0].type[0] === 'I') {
        // If params[0].type[0] starts with 'I', it can't be `ImportDeclaration` nor `IfStatement` 
        // and thus is`Identifier`
        state.write((<Identifier>params[0]).name);
      } else {
        formatSequence(state, node.params);
      }
    }
    state.write(' => ');
    if (node.body.type[0] === 'O') {
      // Body is an object expression
      state.write('(');
      this.ObjectExpression(state, node.body);
      state.write(')');
    } else {
      this[node.body.type](state, node.body);
    }
  },
  ThisExpression(state: State) {
    state.write('this');
  },
  Super(state: State) {
    state.write('super');
  },
  RestElement: (restElement = (state: State, node: RestElement) => {
    state.write('...');
    generator[node.argument.type](state, <any>node.argument);
  }),
  SpreadElement: restElement,
  YieldExpression(state: State, node: YieldExpression) {
    state.write(node.delegate ? 'yield*' : 'yield');
    if (node.argument) {
      state.write(' ');
      this[node.argument.type](state, node.argument);
    }
  },
  AwaitExpression(state: State, node: AwaitExpression) {
    state.write('await ');
    if (node.argument) {
      this[node.argument.type](state, node.argument);
    }
  },
  TemplateLiteral(state: State, node: TemplateLiteral) {
    const { quasis, expressions } = node;
    state.write('`');
    const { length } = expressions;
    for (let i = 0; i < length; i++) {
      const expression = expressions[i];
      state.write(quasis[i].value.raw);
      state.write('${');
      this[expression.type](state, expression);
      state.write('}');
    }
    state.write(quasis[quasis.length - 1].value.raw);
    state.write('`');
  },
  TaggedTemplateExpression(state: State, node: TaggedTemplateExpression) {
    this[node.tag.type](state, node.tag);
    this[node.quasi.type](state, node.quasi);
  },
  ArrayExpression: (arrayExpression = (state: State, node: ArrayExpression) => {
    state.write('[');
    if (node.elements.length > 0) {
      const { elements } = node,
        { length } = elements;
      for (let i = 0; ;) {
        const element = elements[i];
        if (element != null) {
          generator[element.type](state, element);
        }
        if (++i < length) {
          state.write(', ');
        } else {
          if (element == null) {
            state.write(', ');
          }
          break;
        }
      }
    }
    state.write(']');
  }),
  ArrayPattern: arrayExpression,
  ObjectExpression(state: State, node: ObjectExpression) {
    const indent = state.indent.repeat(state.indentLevel++);
    const { lineEnd, writeComments } = state;
    const propertyIndent = indent + state.indent;
    state.write('{');
    if (node.properties.length > 0) {
      state.write(lineEnd);
      if (writeComments && node.comments != null) {
        formatComments(state, node.comments, propertyIndent, lineEnd);
      }
      const comma = ',' + lineEnd;
      const { properties } = node,
        { length } = properties;
      for (let i = 0; ;) {
        const property = properties[i];
        if (writeComments && property.comments != null) {
          formatComments(state, property.comments, propertyIndent, lineEnd);
        }
        state.write(propertyIndent);
        this[property.type](state, property);
        if (++i < length) {
          state.write(comma);
        } else {
          break;
        }
      }
      state.write(lineEnd);
      if (writeComments && node.trailingComments != null) {
        formatComments(state, node.trailingComments, propertyIndent, lineEnd);
      }
      state.write(indent + '}');
    } else if (writeComments) {
      if (node.comments != null) {
        state.write(lineEnd);
        formatComments(state, node.comments, propertyIndent, lineEnd);
        if (node.trailingComments != null) {
          formatComments(state, node.trailingComments, propertyIndent, lineEnd);
        }
        state.write(indent + '}');
      } else if (node.trailingComments != null) {
        state.write(lineEnd);
        formatComments(state, node.trailingComments, propertyIndent, lineEnd);
        state.write(indent + '}');
      } else {
        state.write('}');
      }
    } else {
      state.write('}');
    }
    state.indentLevel--;
  },
  Property(state: State, node: Property) {
    if (node.method || node.kind[0] !== 'i') {
      // Either a method or of kind `set` or `get` (not `init`)
      this.MethodDefinition(state, node);
    } else {
      if (!node.shorthand) {
        if (node.computed) {
          state.write('[');
          this[node.key.type](state, node.key);
          state.write(']');
        } else {
          this[node.key.type](state, node.key);
        }
        state.write(': ');
      }
      this[node.value.type](state, node.value);
    }
  },
  ObjectPattern(state: State, node: ObjectPattern) {
    state.write('{');
    if (node.properties.length > 0) {
      const { properties } = node,
        { length } = properties;
      for (let i = 0; ;) {
        this[properties[i].type](state, properties[i]);
        if (++i < length) {
          state.write(', ');
        } else {
          break;
        }
      }
    }
    state.write('}');
  },
  SequenceExpression(state: State, node: SequenceExpression) {
    formatSequence(state, node.expressions);
  },
  UnaryExpression(state: State, node: UnaryExpression) {
    state.write(node.operator);
    if (node.operator.length > 1) {
      state.write(' ');
    }
    if (precedence(node.argument) < precedence(node)) {
      state.write('(');
      this[node.argument.type](state, node.argument);
      state.write(')');
    } else {
      this[node.argument.type](state, node.argument);
    }
  },
  UpdateExpression(state: State, node: UpdateExpression) {
    // Always applied to identifiers or members, no parenthesis check needed
    if (node.prefix) {
      state.write(node.operator);
      this[node.argument.type](state, node.argument);
    } else {
      this[node.argument.type](state, node.argument);
      state.write(node.operator);
    }
  },
  AssignmentExpression(state: State, node: AssignmentExpression) {
    this[node.left.type](state, node.left);
    state.write(' ' + node.operator + ' ');
    this[node.right.type](state, node.right);
  },
  AssignmentPattern(state: State, node: AssignmentPattern) {
    this[node.left.type](state, node.left);
    state.write(' = ');
    this[node.right.type](state, node.right);
  },
  BinaryExpression: (binaryExpression = (state: State, node: BinaryExpression) => {
    formatBinaryExpressionPart(state, node.left, node, false);
    state.write(` ${node.operator} `);
    formatBinaryExpressionPart(state, node.right, node, true);
  }),
  LogicalExpression: binaryExpression,
  ConditionalExpression(state: State, node: ConditionalExpression) {
    if (precedence(node.test) > precedence(node)) {
      this[node.test.type](state, node.test);
    } else {
      state.write('(');
      this[node.test.type](state, node.test);
      state.write(')');
    }
    state.write(' ? ');
    this[node.consequent.type](state, node.consequent);
    state.write(' : ');
    this[node.alternate.type](state, node.alternate);
  },
  NewExpression(state: State, node: NewExpression) {
    state.write('new ');
    const callExp = <Node>{ type: 'CallExpression' };
    if (precedence(node.callee) < precedence(callExp) || hasCallExpression(node.callee)) {
      state.write('(');
      this[node.callee.type](state, node.callee);
      state.write(')');
    } else {
      this[node.callee.type](state, node.callee);
    }
    formatSequence(state, node['arguments']);
  },
  CallExpression(state: State, node: CallExpression) {
    if (precedence(node.callee) < precedence(node)) {
      state.write('(');
      this[node.callee.type](state, node.callee);
      state.write(')');
    } else {
      this[node.callee.type](state, node.callee);
    }
    formatSequence(state, node['arguments']);
  },
  MemberExpression(state: State, node: MemberExpression) {
    if (precedence(node.object) < precedence(node)) {
      state.write('(');
      this[node.object.type](state, node.object);
      state.write(')');
    } else {
      this[node.object.type](state, node.object);
    }
    if (node.computed) {
      state.write('[');
      this[node.property.type](state, node.property);
      state.write(']');
    } else {
      state.write('.');
      this[node.property.type](state, node.property);
    }
  },
  MetaProperty(state: State, node: MetaProperty) {
    state.write(node.meta.name + '.' + node.property.name);
  },
  Identifier(state: State, node: Identifier) {
    state.write(node.name);
  },
  Literal(state: State, node: Literal | RegExpLiteral) {
    if (node.raw != null) {
      state.write(node.raw);
    } else if ((<RegExpLiteral>node).regex != null) {
      const { regex } = <RegExpLiteral>node;
      state.write(`/${regex.pattern}/${regex.flags}`);
    } else {
      state.write(stringify((<Literal>node).value, state.quotemark));
    }
  },
  FieldDefinition(state: State, node: any) {
    if (node.static) {
      state.write('static ');
    }
    node.computed && state.write('[');
    this[node.key.type](state, node.key);
    node.computed && state.write(']');
    state.write(' = ');
    if (node.value != null) {
      this[node.value.type](state, node.value);
    }
    // TO-DO: Write Decorators on node.decorators[]
    state.end();
  }
};

const EMPTY_OBJECT = {};

class State {

  indent: string;
  lineEnd: string;
  quotemark: string;
  indentLevel: number;
  writeComments: boolean;
  output: Writable | string;
  generator: { [key: string]: (state: State, node?: _Node) => void };


  constructor(options?: GeneratorOptions) {
    const setup: GeneratorOptions = options == null ? EMPTY_OBJECT : options;
    // Functional options
    if (setup.output != null) {
      this.output = setup.output;
      this.write = this.writeToStream;
    } else {
      this.output = '';
    }
    this.end = setup.semicolon ? this.end : (() => { });
    this.generator = setup.generator != null ? setup.generator : generator;
    // Formating setup
    this.indent = setup.indent != null ? setup.indent : '  ';
    this.lineEnd = setup.lineEnd != null ? setup.lineEnd : '\n';
    this.quotemark = setup.quotemark != null ? setup.quotemark : '"';
    this.indentLevel =
      setup.startingIndentLevel != null ? setup.startingIndentLevel : 0;
    this.writeComments = setup.comments ? setup.comments : false;
  }
  write(code: string) {
    this.output += code;
  }
  writeToStream(code: string) {
    (<Writable>this.output).write(code);
  }
  end() {
    this.write(';');
  }
  toString() {
    return this.output;
  }
}

interface GeneratorOptions {
  // - `indent`: string to use for indentation(defaults to`␣␣`)
  indent?: string;
  // - `lineEnd`: string to use for line endings(defaults to`\n`)
  lineEnd?: string;
  // - `quotemark`: string to use for quotetion(defaults to`"`)
  quotemark?: string;
  // - `startingIndentLevel`: indent level to start from(defaults to`0`)
  startingIndentLevel?: number;
  // - `comments`: generate comments if `true`(defaults to`false`)
  comments?: boolean;
  // - `output`: output stream to write the rendered code to(defaults to`null`)
  output?: Writable | null;
  // - `semicolon`: control of semicolon at the end of some statements(defaults to`false`)
  semicolon?: boolean;
  // - `generator`: custom code generator(defaults to`baseGenerator`)
  generator?: { [key: string]: (state: State, node?: _Node) => void };
}

export function generate(node: Node | Program, options?: GeneratorOptions) {
  const state = new State(options);
  state.generator[node.type](state, node);
  return state.output;
}
