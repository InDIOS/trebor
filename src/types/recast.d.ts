import {
  Node, BinaryExpression, Literal, CallExpression,
  MemberExpression, Identifier, Expression, BinaryOperator, Program, Property, ExpressionStatement, TemplateLiteral, ArrayExpression, ConditionalExpression, SpreadElement, UnaryExpression, LogicalExpression, UpdateExpression, AssignmentExpression, ImportDeclaration, ExportDefaultDeclaration, VariableDeclaration, FunctionDeclaration, FunctionExpression, SwitchStatement, WhileStatement, IfStatement, TryStatement, SequenceExpression
} from 'estree';

interface NamedType {
  check(node: Node): boolean;
  assert(value: Node, deep: boolean): void;
}

interface LiteralType extends NamedType {
  name: 'Literal'
}
interface FunctionType extends NamedType {
  name: 'Function'
}
interface IdentifierType extends NamedType {
  name: 'Identifier'
}
interface IfStatementType extends NamedType {
  name: 'IfStatement'
}
interface BlockStatementType extends NamedType {
  name: 'BlockStatement'
}
interface UnaryExpressionType extends NamedType {
  name: 'UnaryExpression'
}
interface UpdateExpressionType extends NamedType {
  name: 'UpdateExpression'
}
interface AssignmentExpressionType extends NamedType { 
  name: 'AssignmentExpression'
}

interface NamedTypes {
  Literal: LiteralType;
  Function: FunctionType;
  Identifier: IdentifierType;
  IfStatement: IfStatementType;
  BlockStatement: BlockStatementType;
  UnaryExpression: UnaryExpressionType;
  UpdateExpression: UpdateExpressionType;
  AssignmentExpression: AssignmentExpressionType;
}

interface Builders {
  identifier(name: string): Identifier;
  literal(value: string | number | boolean | null | RegExp): Literal;
  callExpression(callee: Expression, arguments: Expression[]): CallExpression;
  memberExpression(object: Expression, property: Expression, computed: boolean): MemberExpression;
  binaryExpression(operator: BinaryOperator, left: Expression, right: Expression): BinaryExpression;
}

interface Scope {
  declares(name: string): boolean;
}

interface Path<T> {
  node: T;
  value: T;
  scope: Scope;
  parent: Path<Node>;
  prune(): void;
  replace(node: Node)
  get<N>(key: string, position?: number): Path<N>;
}

interface Visitor {
  abort(): void;
  traverse<N>(path: Path<N>): void;
  [key: string]: (this: Visitor, path: Path<Node>, ...args: any[]) => boolean | void;
}

interface Types {
  builders: Builders;
  namedTypes: NamedTypes;
  visit(node: RecastAST | Node, visitors: {
    visitProperty?(this: Visitor, path: Path<Property>, ...args: any[]): boolean | void;
    visitIfStatement?(this: Visitor, path: Path<IfStatement>, ...args: any[]): boolean | void;
    visitTryStatement?(this: Visitor, path: Path<TryStatement>, ...args: any[]): boolean | void;
    visitSpreadElement?(this: Visitor, path: Path<SpreadElement>, ...args: any[]): boolean | void;
    visitWhileStatement?(this: Visitor, path: Path<WhileStatement>, ...args: any[]): boolean | void;
    visitCallExpression?(this: Visitor, path: Path<CallExpression>, ...args: any[]): boolean | void;
    visitTemplateLiteral?(this: Visitor, path: Path<TemplateLiteral>, ...args: any[]): boolean | void;
    visitSwitchStatement?(this: Visitor, path: Path<SwitchStatement>, ...args: any[]): boolean | void;
    visitArrayExpression?(this: Visitor, path: Path<ArrayExpression>, ...args: any[]): boolean | void;
    visitUnaryExpression?(this: Visitor, path: Path<UnaryExpression>, ...args: any[]): boolean | void;
    visitBinaryExpression?(this: Visitor, path: Path<BinaryExpression>, ...args: any[]): boolean | void;
    visitMemberExpression?(this: Visitor, path: Path<MemberExpression>, ...args: any[]): boolean | void;
    visitUpdateExpression?(this: Visitor, path: Path<UpdateExpression>, ...args: any[]): boolean | void;
    visitLogicalExpression?(this: Visitor, path: Path<LogicalExpression>, ...args: any[]): boolean | void;
    visitImportDeclaration?(this: Visitor, path: Path<ImportDeclaration>, ...args: any[]): boolean | void;
    visitSequenceExpression?(this: Visitor, path: Path<SequenceExpression>, ...args: any[]): boolean | void;
    visitFunctionExpression?(this: Visitor, path: Path<FunctionExpression>, ...args: any[]): boolean | void;
    visitFunctionDeclaration?(this: Visitor, path: Path<FunctionDeclaration>, ...args: any[]): boolean | void;
    visitExpressionStatement?(this: Visitor, path: Path<ExpressionStatement>, ...args: any[]): boolean | void;
    visitVariableDeclaration?(this: Visitor, path: Path<VariableDeclaration>, ...args: any[]): boolean | void;
    visitAssignmentExpression?(this: Visitor, path: Path<AssignmentExpression>, ...args: any[]): boolean | void;
    visitConditionalExpression?(this: Visitor, path: Path<ConditionalExpression>, ...args: any[]): boolean | void;
    visitExportDefaultDeclaration?(this: Visitor, path: Path<ExportDefaultDeclaration>, ...args: any[]): boolean | void;
    [key: string]: (this: Visitor, path: Path<Node>, ...args: any[]) => boolean | void
  }): void;
}

interface RecastAST {
  type: 'File';
  program: Program;
  original: Program;
}

interface Recast {
  types: Types;
  print(node: RecastAST | Node, options?: { [key: string]: any }): { code: string };
  parse(code: string, options?: { [key: string]: any }): RecastAST;
}
