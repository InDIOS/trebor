type Node = Record<string, any>;

export default function isReferenced(node: Node, parent: Node, grandparent?: Node) {
  switch (parent.type) {
    // yes: { [NODE]: '' }
    // yes: { NODE }
    // no: { NODE: '' }
    case 'Property':
      return parent.value === node || parent.computed;
    // no: break NODE;
    // no: continue NODE;
    case 'BreakStatement':
    case 'ContinueStatement':
      return false;
    // yes: left = NODE;
    // yes: NODE = right;
    case 'AssignmentExpression':
      return true;
    // yes: PARENT[NODE]
    // yes: NODE.child
    // no: parent.NODE
    case "MemberExpression":
      if (parent.property === node) {
        return !!parent.computed;
      }
      return parent.object === node;
    // no: let NODE = init;
    // yes: let id = NODE;
    case "VariableDeclarator":
      return parent.init === node;
    // yes: () => NODE
    // no: (NODE) => {}
    case "ArrowFunctionExpression":
      return parent.body === node;
    // no: export { foo as NODE };
    // yes: export { NODE as foo };
    // no: export { NODE as foo } from "foo";
    case "ExportSpecifier":
      if (!grandparent || grandparent.source) {
        return false;
      }
      return parent.local === node;
    // yes: class { [NODE] = value; }
    // yes: class { key = NODE; }
    // yes: class { [NODE]() {} }
    // no: class { NODE() {} }
    // no: class { NODE = value; }
    case "MethodDefinition":
      if (parent.key === node) {
        return !!parent.computed;
      }
      if (parent.value === node) {
        return !grandparent || grandparent.type !== "ObjectPattern";
      }
      return true;
    // no: class NODE {}
    // yes: class Foo extends NODE {}
    case "ClassDeclaration":
    case "ClassExpression":
      return parent.superClass === node;
    // no: [NODE = foo] = [];
    // yes: [foo = NODE] = [];
    case "AssignmentPattern":
      return parent.right === node;
    // no: NODE: for (;;) {}
    case "LabeledStatement":
      return false;
    // no: try {} catch (NODE) {}
    case "CatchClause":
      return false;
    // no: function foo(...NODE) {}
    case "RestElement":
      return false;
    // no: function NODE() {}
    // no: function foo(NODE) {}
    case "FunctionDeclaration":
    case "FunctionExpression":
      return false;
    // no: export NODE from "foo";
    // no: export * as NODE from "foo";
    case "ExportNamespaceSpecifier":
      return false;
    // no: import NODE from "foo";
    // no: import * as NODE from "foo";
    // no: import { NODE as foo } from "foo";
    // no: import { foo as NODE } from "foo";
    // no: import NODE from "bar";
    case "ImportDefaultSpecifier":
    case "ImportNamespaceSpecifier":
    case "ImportSpecifier":
      return false;
    // no: [NODE] = [];
    // no: ({ NODE }) = [];
    case "ObjectPattern":
    case "ArrayPattern":
      return false;
    // no: new.NODE
    // no: NODE.target
    case "MetaProperty":
      return false;
  }
  return true;
}