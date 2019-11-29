import parse from './parser';
import { expression, compare } from './context/expression';
import { ImportDeclaration, Statement } from './estree';
import {
  importDefaultSpecifier, importSpecifier, importDeclaration, expressionStatement, callExpression,
  thisExpression,
  ExpressionParameter
} from './nodes';

export class Segments {
  loops: number;
  body: Segment;
  mount: Segment;
  extras: Segment;
  create: Segment;
  update: Segment;
  _init: string[];
  unmount: Segment;
  destroy: Segment;
  _imports: Map<string, ImportDeclaration>;
  conditions: number;
  tools: Set<string>;
  globals: Set<string>;
  globalTools?: string[];
  variables: Map<string, number>;

  constructor({ loops, conditions, _imports } = { loops: 0, conditions: 0, _imports: new Map() }) {
    this._init = [];
    this.loops = loops;
    this.tools = new Set();
    this.globalTools = null;
    this._imports = _imports;
    this.body = new Segment();
    this.mount = new Segment();
    this.extras = new Segment();
    this.create = new Segment();
    this.update = new Segment();
    this.unmount = new Segment();
    this.destroy = new Segment();
    this.variables = new Map();
    this.conditions = conditions;
    this.globals = new Set(['_$ctx']);
    this.destroy.add(callExpression('_$destroyComponent', [thisExpression()]));
  }

  addImport(mod: string, id: string, isDefault = false, alias = '') {
    if (!(this._imports.has(mod))) this._imports.set(mod, importDeclaration([], mod));
    const { specifiers } = this._imports.get(mod);
    const exist = specifiers.some(node => alias ? node.local.name === alias : node.local.name === id);
    if (!exist) {
      const imported = isDefault ? importDefaultSpecifier(id) : importSpecifier(alias || id, id);
      specifiers.push(imported);
    }
  }

  addVar(variable: string) {
    if (!this.variables.has(variable)) {
      this.variables.set(variable, 1);
    } else {
      const index = this.variables.get(variable);
      this.variables.set(variable, index + 1);
    }
    const length = this._init.push(`_$${variable}_${this.variables.get(variable)}`);
    return this._init[length - 1];
  }

  get init() {
    return this._init;
  }

  get imports() {
    return [...this._imports.values()];
  }

  getTools() {
    return [...this.tools].reduce((tools, tool) => {
      return tools.concat(parse(tool, { ranges: false }).body);
    }, []);
  }

  removeVar(varName: string) {
    const index = this._init.indexOf(varName);
    if (~index) {
      this._init.splice(index, 1);
    }
  }
}

export class Segment {
  _statements: Statement[];

  constructor() {
    this._statements = [];
  }
  get statements() {
    return this._statements;
  }
  get size() {
    return this._statements.length;
  }
  add(...stmts: ExpressionParameter[]) {
    return this._statements.push(...stmts.map(toStatement));
  }
  insert(stmt: ExpressionParameter, index = 0) {
    let node = toStatement(stmt);
    if (index === 0) this._statements.unshift(node);
    else if (~index) this._statements.splice(index, 0, node);
    return this;
  }
  index(cb: ExpressionParameter | ((value: Statement, index?: number, obj?: Statement[]) => boolean)) {
    if (typeof cb !== 'function') {
      const value = cb;
      cb = n => compare(n, toStatement(value));
    }
    return this._statements.findIndex(cb);
  }
  includes(stmt: ExpressionParameter) {
    return !!~this.index(n => compare(n, toStatement(stmt)));
  }
  find(cb: (value: Statement, index?: number, obj?: Statement[]) => boolean) {
    return this._statements.find(cb);
  }
  replace(stmt: ExpressionParameter, oldStmt?: ExpressionParameter) {
    const index = arguments.length === 1 ? 0 : this.index(oldStmt);
    if (~index) {
      this._statements.splice(index, 1, toStatement(stmt));
    }
  }
  remove(stmt: string) {
    const index = this.index(n => compare(n, expression(stmt)));
    return ~index ? this._statements.splice(index, 1) : null;
  }
  isEmpty() {
    return this.size === 0;
  }
}

function toStatement(stmt: ExpressionParameter) {
  return typeof stmt === 'string' ? expression(stmt) : expressionStatement(stmt);
}
