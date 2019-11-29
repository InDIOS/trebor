// Types
export type Declaration = VariableDeclaration | FunctionDeclaration | ClassDeclaration;
export type ImportModuleSpecifier = ImportSpecifier | ImportDefaultSpecifier | ImportNamespaceSpecifier;
export type DefaultDeclaration = AnonymousFunctionDeclaration | FunctionDeclaration | ClassExpression | ClassDeclaration | Expression;
export type FunctionNode = FunctionDeclaration | FunctionExpression | ArrowFunctionExpression;
export type Statement = BlockStatement | ExpressionStatement | EmptyStatement | DebuggerStatement |
  WithStatement | ReturnStatement | LabeledStatement | BreakStatement | ContinueStatement |
  IfStatement | SwitchStatement | ThrowStatement | TryStatement | WhileStatement | DoWhileStatement |
  ForStatement | ForInStatement | ForOfStatement | Declaration;
export type ModuleDeclaration = ImportDeclaration | ExportNamedDeclaration | ExportDefaultDeclaration | ExportAllDeclaration;
export type Pattern = Identifier | ObjectPattern | ArrayPattern | RestElement | AssignmentPattern;
export type Expression = Identifier | Literal | RegExpLiteral | ThisExpression | ArrayExpression | ObjectExpression |
  FunctionExpression | UnaryExpression | UpdateExpression | BinaryExpression |
  AssignmentExpression | LogicalExpression | MemberExpression | ConditionalExpression |
  CallExpression | NewExpression | SequenceExpression | Super | ArrowFunctionExpression |
  YieldExpression | TemplateLiteral | TaggedTemplateExpression | AwaitExpression | MetaProperty |
  ClassExpression | ImportExpression;
export type UnaryOperator = "-" | "+" | "!" | "~" | "typeof" | "void" | "delete";
export type UpdateOperator = "++" | "--";
export type LogicalOperator = "&&" | "||";
export type BinaryOperator = "==" | "!=" | "===" | "!==" | "<" | "<=" | ">" | ">=" | "<<" | ">>" |
  ">>>" | "+" | "-" | "*" | "**" | "/" | "%" | "|" | "^" | "&" | "in" | "instanceof";
export type AssignmentOperator = "=" | "+=" | "-=" | "*=" | "**=" | "/=" | "%=" | "<<=" | ">>=" |
  ">>>=" | "|=" | "^=" | "&=";
type InnerNode = MethodDefinition | Property | ExportSpecifier | VariableDeclarator | CatchClause;
export type Node = InnerNode | Declaration | ImportModuleSpecifier | Statement | ModuleDeclaration
  | Pattern |  Expression;

export interface NodeType {
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
}

// Interfaces
export interface BaseNode {
  type: string;
  start?: number;
  end?: number;
  loc?: SourceLocation | null;
  comments?: string;
  trailingComments?: string;
}

interface BaseFunction extends BaseNode {
  id: Identifier | null;
  params: Pattern[];
  body: BlockStatement | Expression;
  async: boolean;
}

interface BaseForLoop extends BaseNode {
  left: VariableDeclaration | Pattern;
  right: Expression;
  body: Statement;
}

interface BaseProperty extends BaseNode {
  type: "Property";
  key: Expression;
  value: Pattern | Expression;
  method: boolean;
  shorthand: boolean;
  computed: boolean;
  kind: "init" | "get" | "set";
}

interface BaseClass extends BaseNode {
  id: Identifier | null;
  superClass: Expression | null;
  body: ClassBody;
}

interface BaseModuleSpecifier extends BaseNode {
  local: Identifier;
}

interface AnonymousFunctionDeclaration extends BaseFunction {
  type: "FunctionDeclaration";
  id: null;
  body: BlockStatement
}

interface ClassExpression extends BaseClass {
  type: "ClassExpression";
  id: null;
}

interface AssignmentProperty extends BaseProperty {
  value: Pattern;
  kind: "init";
  method: false;
}

// Globas
export interface SourceLocation {
  source?: string | null;
  start: Position;
  end: Position;
}

export interface Position {
  line: number;
  column: number;
}

export interface Identifier extends BaseNode {
  type: "Identifier";
  name: string;
  pattern?: boolean;
}

export interface Literal extends BaseNode {
  type: "Literal";
  value: string | boolean | null | number;
  raw?: string;
}

export interface RegExpLiteral extends BaseNode {
  type: "Literal";
  value: RegExp;
  regex: {
    pattern: string;
    flags: string;
  };
  raw?: string;
}

export interface Program extends BaseNode {
  sourceType: "script" | "module";
  body: (Statement | ModuleDeclaration)[];
}

// Statements
export interface ExpressionStatement extends BaseNode {
  type: "ExpressionStatement";
  expression: Expression;
}

export interface BlockStatement extends BaseNode {
  type: "BlockStatement";
  body: Statement[];
}

export interface EmptyStatement extends BaseNode {
  type: "EmptyStatement";
}

export interface DebuggerStatement extends BaseNode {
  type: "DebuggerStatement";
}

export interface WithStatement extends BaseNode {
  type: "WithStatement";
  object: Expression;
  body: Statement;
}

export interface ReturnStatement extends BaseNode {
  type: "ReturnStatement";
  argument: Expression | null;
}

export interface LabeledStatement extends BaseNode {
  type: "LabeledStatement";
  label: Identifier;
  body: Statement;
}

export interface BreakStatement extends BaseNode {
  type: "BreakStatement";
  label: Identifier | null;
}

export interface ContinueStatement extends BaseNode {
  type: "ContinueStatement";
  label: Identifier | null;
}

export interface IfStatement extends BaseNode {
  type: "IfStatement";
  test: Expression;
  consequent: Statement;
  alternate: Statement | null;
}

export interface SwitchStatement extends BaseNode {
  type: "SwitchStatement";
  discriminant: Expression;
  cases: SwitchCase[];
}

export interface SwitchCase extends BaseNode {
  type: "SwitchCase";
  test: Expression | null;
  consequent: Statement[];
}

export interface ThrowStatement extends BaseNode {
  type: "ThrowStatement";
  argument: Expression;
}

export interface TryStatement extends BaseNode {
  type: "TryStatement";
  block: BlockStatement;
  handler: CatchClause | null;
  finalizer: BlockStatement | null;
}

export interface CatchClause extends BaseNode {
  type: "CatchClause";
  param: Pattern | null;
  body: BlockStatement;
}

export interface WhileStatement extends BaseNode {
  type: "WhileStatement";
  test: Expression;
  body: Statement;
}

export interface DoWhileStatement extends BaseNode {
  type: "DoWhileStatement";
  body: Statement;
  test: Expression;
}

export interface ForStatement extends BaseNode {
  type: "ForStatement";
  init: VariableDeclaration | Expression | null;
  test: Expression | null;
  update: Expression | null;
  body: Statement;
}

export interface ForInStatement extends BaseForLoop {
  type: "ForInStatement";
}

export interface ForOfStatement extends BaseForLoop {
  type: "ForOfStatement";
  await: boolean;
}

export interface FunctionDeclaration extends BaseFunction {
  type: "FunctionDeclaration";
  id: Identifier;
  body: BlockStatement;
  generator: boolean;
}

export interface VariableDeclaration extends BaseNode {
  type: "VariableDeclaration";
  declarations: VariableDeclarator[];
  kind: "var" | "let" | "const";
}

export interface VariableDeclarator extends BaseNode {
  type: "VariableDeclarator";
  id: Pattern;
  init: Expression | null;
}

export interface ClassDeclaration extends BaseClass {
  type: "ClassDeclaration";
  id: Identifier;
}

export interface ClassBody extends BaseNode {
  type: "ClassBody";
  body: MethodDefinition[];
}

export interface MethodDefinition extends BaseNode {
  type: "MethodDefinition";
  key: Expression;
  value: FunctionExpression;
  kind: "constructor" | "method" | "get" | "set";
  computed: boolean;
  static: boolean;
}

// Expressions
export interface ThisExpression extends BaseNode {
  type: "ThisExpression";
}

export interface Super extends BaseNode {
  type: "Super";
}

export interface ArrayExpression extends BaseNode {
  type: "ArrayExpression";
  elements: (Expression | SpreadElement | null)[];
}

export interface ObjectExpression extends BaseNode {
  type: "ObjectExpression";
  properties: (Property | SpreadElement)[];
}

export interface Property extends BaseProperty {
  value: Expression;
}

export interface FunctionExpression extends BaseFunction {
  type: "FunctionExpression";
  body: BlockStatement;
  generator: boolean;
}

export interface ArrowFunctionExpression extends BaseFunction {
  type: "ArrowFunctionExpression";
  body: BlockStatement | Expression;
  expression: boolean;
}

export interface UnaryExpression extends BaseNode {
  type: "UnaryExpression";
  operator: UnaryOperator;
  prefix: boolean;
  argument: Expression;
}

export interface UpdateExpression extends BaseNode {
  type: "UpdateExpression";
  operator: UpdateOperator;
  argument: Expression;
  prefix: boolean;
}

export interface SpreadElement extends BaseNode {
  type: "SpreadElement";
  argument: Expression;
}

export interface BinaryExpression extends BaseNode {
  type: "BinaryExpression";
  operator: BinaryOperator;
  left: Expression;
  right: Expression;
}

export interface AssignmentExpression extends BaseNode {
  type: "AssignmentExpression";
  operator: AssignmentOperator;
  left: Pattern | MemberExpression;
  right: Expression;
}

export interface LogicalExpression extends BaseNode {
  type: "LogicalExpression";
  operator: LogicalOperator;
  left: Expression;
  right: Expression;
}

export interface MemberExpression extends BaseNode {
  type: "MemberExpression";
  object: Expression | Super;
  property: Expression;
  computed: boolean;
}

export interface ConditionalExpression extends BaseNode {
  type: "ConditionalExpression";
  test: Expression;
  alternate: Expression;
  consequent: Expression;
}

export interface CallExpression extends BaseNode {
  type: "CallExpression";
  callee: Expression | Super;
  arguments: (Expression | SpreadElement)[];
}

export interface NewExpression extends BaseNode {
  type: "NewExpression";
  callee: Expression;
  arguments: (Expression | SpreadElement)[];
}

export interface SequenceExpression extends BaseNode {
  type: "SequenceExpression";
  expressions: Expression[];
}

export interface YieldExpression extends BaseNode {
  type: "YieldExpression";
  argument: Expression | null;
  delegate: boolean;
}

export interface TemplateLiteral extends BaseNode {
  type: "TemplateLiteral";
  quasis: TemplateElement[];
  expressions: Expression[];
}

export interface TaggedTemplateExpression extends BaseNode {
  type: "TaggedTemplateExpression";
  tag: Expression;
  quasi: TemplateLiteral;
}

export interface TemplateElement extends BaseNode {
  type: "TemplateElement";
  tail: boolean;
  value: {
    cooked: string | null;
    raw: string;
  };
}

export interface ClassExpression extends BaseClass {
  type: "ClassExpression";
}

export interface MetaProperty extends BaseNode {
  type: "MetaProperty";
  meta: Identifier;
  property: Identifier;
}

export interface AwaitExpression extends BaseNode {
  type: "AwaitExpression";
  argument: Expression;
}

export interface ImportExpression extends BaseNode {
  type: "ImportExpression";
  source: Expression
}

// Patterns
export interface ObjectPattern extends BaseNode {
  type: "ObjectPattern";
  properties: (AssignmentProperty | RestElement)[];
}

export interface ArrayPattern extends BaseNode {
  type: "ArrayPattern";
  elements: (Pattern | null)[];
}

export interface RestElement extends BaseNode {
  type: "RestElement";
  argument: Pattern;
}

export interface AssignmentPattern extends BaseNode {
  type: "AssignmentPattern";
  left: Pattern;
  right: Expression;
}

// Modules
export interface ImportDeclaration extends BaseNode {
  type: "ImportDeclaration";
  specifiers: ImportModuleSpecifier[];
  source: Literal;
}

export interface ImportSpecifier extends BaseModuleSpecifier {
  type: "ImportSpecifier";
  imported: Identifier;
}

export interface ImportDefaultSpecifier extends BaseModuleSpecifier {
  type: "ImportDefaultSpecifier";
}

export interface ImportNamespaceSpecifier extends BaseModuleSpecifier {
  type: "ImportNamespaceSpecifier";
}

export interface ExportNamedDeclaration extends BaseNode {
  type: "ExportNamedDeclaration";
  declaration: Declaration | null;
  specifiers: ExportSpecifier[];
  source: Literal | null;
}

export interface ExportSpecifier extends BaseModuleSpecifier {
  type: "ExportSpecifier";
  exported: Identifier;
}

export interface ExportDefaultDeclaration extends BaseNode {
  type: "ExportDefaultDeclaration";
  declaration: DefaultDeclaration;
}

export interface ExportAllDeclaration extends BaseNode {
  type: "ExportAllDeclaration";
  source: Literal;
}
