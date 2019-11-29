import {
  BaseNode, Program, Expression, SpreadElement, AssignmentPattern, RestElement, ArrayPattern, ObjectPattern,
  Identifier, ClassDeclaration, FunctionDeclaration, VariableDeclaration, ExportAllDeclaration,
  ExportDefaultDeclaration, ExportNamedDeclaration, ImportDefaultSpecifier, ImportNamespaceSpecifier,
  ImportSpecifier, Property, Literal, FunctionExpression, Declaration, Statement, ArrayExpression,
  ArrowFunctionExpression, AssignmentExpression, BlockStatement, AwaitExpression, BinaryExpression,
  BreakStatement, CallExpression, CatchClause, MethodDefinition, ClassBody, ClassExpression,
  ConditionalExpression, ContinueStatement, DebuggerStatement, DoWhileStatement, EmptyStatement,
  ExportSpecifier, ExpressionStatement, ForInStatement, ForOfStatement, ForStatement, IfStatement,
  ImportDeclaration, LabeledStatement, LogicalExpression, MemberExpression, MetaProperty,
  NewExpression, ObjectExpression, ReturnStatement, SequenceExpression, Super, SwitchCase,
  SwitchStatement, TemplateLiteral, TaggedTemplateExpression, TemplateElement, ThisExpression,
  ThrowStatement, TryStatement, UnaryExpression, UpdateExpression, VariableDeclarator,
  WhileStatement, WithStatement, YieldExpression, RegExpLiteral, ImportExpression, Pattern,
  DefaultDeclaration, ImportModuleSpecifier, UnaryOperator, UpdateOperator, BinaryOperator,
  AssignmentOperator, LogicalOperator, NodeType
} from "./estree";

export type Parameter = string | Pattern;
export type ExpressionParameter = string | Expression;
export type ArrayPatternElement = string | Pattern | null;
export type ObjectPatternProperty = Property | RestElement;
export type ExportableNamedDeclaration = Declaration | null;
export type ObjectExpressionProperty = Property | SpreadElement;
export type ArrayExpressionElement = ArgumentListElement | null;
export type ArgumentListElement = string | Expression | SpreadElement;
export type ExportableDefaultDeclaration = string | DefaultDeclaration;
export type PropertyValueParam = string | Pattern | FunctionExpression;

interface BaseFunctionOptions {
  async?: boolean;
}
interface BasePropertyOptions {
  kind?: string;
  computed?: boolean;
}

export interface FunctionOptions extends BaseFunctionOptions {
  generator?: boolean;
}
export interface ArrowFunctionOptions extends BaseFunctionOptions{
  expression?: boolean;
}
export interface PropertyOptions extends BasePropertyOptions {
  method?: boolean;
  shorthand?: boolean;
}
export interface MethodOptions extends BasePropertyOptions {
  static?: boolean;
}

export const Syntax: NodeType;

// Node Builders
export function arrayExpression(elements?: ArrayExpressionElement[]): ArrayExpression;
export function arrayPattern(elements?: ArrayPatternElement[]): ArrayPattern;
export function arrowFunctionExpression(params: Parameter[], body: Expression | Statement[], options?: ArrowFunctionOptions): ArrowFunctionExpression;
export function assignmentExpression(left: string | Pattern | MemberExpression, right: ExpressionParameter, operator?: AssignmentOperator): AssignmentExpression;
export function assignmentPattern(left: Parameter, right: ExpressionParameter): ArrayPattern;
export function awaitExpression(argument: ExpressionParameter): AwaitExpression;
export function binaryExpression(left: ExpressionParameter, right: ExpressionParameter, operator: string | BinaryOperator): BinaryExpression;
export function blockStatement(body: Statement[]): BlockStatement;
export function breakStatement(label: string | null): BreakStatement;
export function callExpression(callee: ExpressionParameter | ImportExpression, args?: ArgumentListElement[]): CallExpression;
export function catchClause(param: Parameter, body: Statement[]): CatchClause;
export function classBody(body?: MethodDefinition[]): ClassBody;
export function classDeclaration(id: string, superClass?: string | null, body?: MethodDefinition[]): ClassDeclaration;
export function classExpression(id?: string | null, superClass?: string | null, body?: MethodDefinition[]): ClassExpression;
export function conditionalExpression(test: ExpressionParameter, consequent: ExpressionParameter, alternate: ExpressionParameter): ConditionalExpression;
export function continueStatement(label: string | null): ContinueStatement;
export function debuggerStatement(): DebuggerStatement;
export function doWhileStatement(test: ExpressionParameter, body: Statement | Statement[]): DoWhileStatement;
export function emptyStatement(): EmptyStatement;
export function exportAllDeclaration(source: string): ExportAllDeclaration;
export function exportDefaultDeclaration(declaration: ExportableDefaultDeclaration): ExportDefaultDeclaration;
export function exportNamedDeclaration(declaration: ExportableNamedDeclaration): ExportNamedDeclaration;
export function exportNamedExpression(specifiers: ExportSpecifier[], source: string): ExportNamedDeclaration;
export function exportSpecifier(local: string, exported: string): ExportSpecifier;
export function expressionStatement(expression: ExpressionParameter): ExpressionStatement;
export function forInStatement(left: ExpressionParameter, right: ExpressionParameter, body: Statement | Statement[]): ForInStatement;
export function forOfStatement(left: ExpressionParameter, right: ExpressionParameter, body: Statement | Statement[]): ForOfStatement;
export function forStatement(body?: Statement | Statement[], init?: ExpressionParameter, test?: ExpressionParameter, update?: ExpressionParameter): ForStatement;
export function functionDeclaration(id: string, params?: Parameter[], body?: Statement[], options?: FunctionOptions): FunctionDeclaration;
export function functionExpression(id?: string, params?: Parameter[], body?: Statement[], options?: FunctionOptions): FunctionExpression;
export function identifier(name: string): Identifier;
export function ifStatement(test: ExpressionParameter, consequent: Statement | Statement[], alternate?: Statement | Statement[]): IfStatement;
export function importExpression(source: ExpressionParameter): ImportExpression;
export function importDeclaration(specifiers: ImportModuleSpecifier[], source: string): ImportDeclaration;
export function importDefaultSpecifier(local: string): ImportDefaultSpecifier;
export function importNamespaceSpecifier(local: string): ImportNamespaceSpecifier;
export function importSpecifier(local: string, exported?: string): ImportSpecifier;
export function labeledStatement(label: string, body: Statement | Statement[]): LabeledStatement;
export function literal(value: boolean | string | number | null): Literal;
export function logicalExpression(left: ExpressionParameter, right: ExpressionParameter, operator: LogicalOperator): LogicalExpression;
export function memberExpression(object: ExpressionParameter, property: ExpressionParameter, computed?: boolean): MemberExpression;
export function metaProperty(meta: string, property: string): MetaProperty;
export function methodDefinition(key: ExpressionParameter, value: FunctionExpression, options?: MethodOptions): MethodDefinition;
export function newExpression(callee: ExpressionParameter, args?: ArgumentListElement[]): NewExpression;
export function objectExpression(properties: ObjectExpressionProperty[]): ObjectExpression;
export function objectPattern(properties: ObjectPatternProperty[]): ObjectPattern;
export function program(body: Statement[], sourceType: 'script' | 'module'): Program;
export function property(key: ExpressionParameter, value: ExpressionParameter, options?: PropertyOptions): Property;
export function regexLiteral(value: RegExp): RegExpLiteral;
export function restElement(argument: Parameter): RestElement;
export function returnStatement(argument?: ExpressionParameter): ReturnStatement;
export function sequenceExpression(expressions: ExpressionParameter[]): SequenceExpression;
export function spreadElement(argument: ExpressionParameter): SpreadElement;
export function superExpression(): Super;
export function switchCase(test?: ExpressionParameter, consequent?: Statement[]): SwitchCase;
export function switchStatement(discriminant: ExpressionParameter, cases?: SwitchCase[]): SwitchStatement;
export function taggedTemplateExpression(tag: ExpressionParameter, quasi: TemplateLiteral): TaggedTemplateExpression;
export function templateElement(value: string, tail: boolean): TemplateElement;
export function templateLiteral(quasis: TemplateElement[], expressions: ExpressionParameter[]): TemplateLiteral;
export function thisExpression(): ThisExpression;
export function throwStatement(argument: ExpressionParameter): ThrowStatement;
export function tryStatement(block: Statement[], handler?: CatchClause, finalizer?: Statement[]): TryStatement;
export function unaryExpression(operator: UnaryOperator, argument: ExpressionParameter): UnaryExpression;
export function updateExpression(operator: UpdateOperator, argument: ExpressionParameter, prefix?: boolean): UpdateExpression;
export function variableDeclaration(declarations: VariableDeclarator[], kind?: string): VariableDeclaration;
export function variableDeclarator(id: Parameter, init?: ExpressionParameter): VariableDeclarator;
export function whileStatement(test: ExpressionParameter, body?: Statement | Statement[]): WhileStatement;
export function withStatement(object: Expression, body?: Statement | Statement[]): WithStatement;
export function yieldExpression(argument?: ExpressionParameter, delegate?: boolean): YieldExpression;
// Types verificators
export function isArrayExpression(node: BaseNode): node is ArrayExpression;
export function isArrayPattern(node: BaseNode): node is ArrayPattern;
export function isArrowFunctionExpression(node: BaseNode): node is ArrowFunctionExpression;
export function isAssignmentExpression(node: BaseNode): node is AssignmentExpression;
export function isAssignmentPattern(node: BaseNode): node is ArrayPattern;
export function isAwaitExpression(node: BaseNode): node is AwaitExpression;
export function isBinaryExpression(node: BaseNode): node is BinaryExpression;
export function isBlockStatement(node: BaseNode): node is BlockStatement;
export function isBreakStatement(node: BaseNode): node is BreakStatement;
export function isCallExpression(node: BaseNode): node is CallExpression;
export function isCatchClause(node: BaseNode): node is CatchClause;
export function isClassBody(node: BaseNode): node is ClassBody;
export function isClassDeclaration(node: BaseNode): node is ClassDeclaration;
export function isClassExpression(node: BaseNode): node is ClassExpression;
export function isConditionalExpression(node: BaseNode): node is ConditionalExpression;
export function isContinueStatement(node: BaseNode): node is ContinueStatement;
export function isDebuggerStatement(node: BaseNode): node is DebuggerStatement;
export function isDoWhileStatement(node: BaseNode): node is DoWhileStatement;
export function isEmptyStatement(node: BaseNode): node is EmptyStatement;
export function isExportAllDeclaration(node: BaseNode): node is ExportAllDeclaration;
export function isExportDefaultDeclaration(node: BaseNode): node is ExportDefaultDeclaration;
export function isExportNamedDeclaration(node: BaseNode): node is ExportNamedDeclaration;
export function isExportSpecifier(node: BaseNode): node is ExportSpecifier;
export function isExpressionStatement(node: BaseNode): node is ExpressionStatement;
export function isForInStatement(node: BaseNode): node is ForInStatement;
export function isForOfStatement(node: BaseNode): node is ForOfStatement;
export function isForStatement(node: BaseNode): node is ForStatement;
export function isFunctionDeclaration(node: BaseNode): node is FunctionDeclaration;
export function isFunctionExpression(node: BaseNode): node is FunctionExpression;
export function isIdentifier(node: BaseNode): node is Identifier;
export function isIfStatement(node: BaseNode): node is IfStatement;
export function isImportExpression(node: BaseNode): node is ImportExpression;
export function isImportDeclaration(node: BaseNode): node is ImportDeclaration;
export function isImportDefaultSpecifier(node: BaseNode): node is ImportDefaultSpecifier;
export function isImportNamespaceSpecifier(node: BaseNode): node is ImportNamespaceSpecifier;
export function isImportSpecifier(node: BaseNode): node is ImportSpecifier;
export function isLabeledStatement(node: BaseNode): node is LabeledStatement;
export function isLiteral(node: BaseNode): node is Literal;
export function isLogicalExpression(node: BaseNode): node is LogicalExpression;
export function isMemberExpression(node: BaseNode): node is MemberExpression;
export function isMetaProperty(node: BaseNode): node is MetaProperty;
export function isMethodDefinition(node: BaseNode): node is MethodDefinition;
export function isNewExpression(node: BaseNode): node is NewExpression;
export function isObjectExpression(node: BaseNode): node is ObjectExpression;
export function isObjectPattern(node: BaseNode): node is ObjectPattern;
export function isProgram(node: BaseNode): node is Program;
export function isProperty(node: BaseNode): node is Property;
export function isRegexLiteral(node: BaseNode): node is RegExpLiteral;
export function isRestElement(node: BaseNode): node is RestElement;
export function isReturnStatement(node: BaseNode): node is ReturnStatement;
export function isSequenceExpression(node: BaseNode): node is SequenceExpression;
export function isSpreadElement(node: BaseNode): node is SpreadElement;
export function isSuper(node: BaseNode): node is Super;
export function isSwitchCase(node: BaseNode): node is SwitchCase;
export function isSwitchStatement(node: BaseNode): node is SwitchStatement;
export function isTaggedTemplateExpression(node: BaseNode): node is TaggedTemplateExpression;
export function isTemplateElement(node: BaseNode): node is TemplateElement;
export function isTemplateLiteral(node: BaseNode): node is TemplateLiteral;
export function isThisExpression(node: BaseNode): node is ThisExpression;
export function isThrowStatement(node: BaseNode): node is ThrowStatement;
export function isTryStatement(node: BaseNode): node is TryStatement;
export function isUnaryExpression(node: BaseNode): node is UnaryExpression;
export function isUpdateExpression(node: BaseNode): node is UpdateExpression;
export function isVariableDeclaration(node: BaseNode): node is VariableDeclaration;
export function isVariableDeclarator(node: BaseNode): node is VariableDeclarator;
export function isWhileStatement(node: BaseNode): node is WhileStatement;
export function isWithStatement(node: BaseNode): node is WithStatement;
export function isYieldExpression(node: BaseNode): node is YieldExpression;