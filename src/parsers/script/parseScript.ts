import visit from './visit';
import { generate } from './generator';
import { assignNode, expression } from './context/expression';
import {
  isExportDefaultDeclaration, isImportDeclaration,
  binaryExpression, literal, callExpression, memberExpression,
  isExpressionStatement, isMemberExpression, isAssignmentExpression,
  isIdentifier, isLiteral, isBlockStatement, expressionStatement, isThisExpression
} from './nodes';
import {
  BaseNode as Node, Program, LabeledStatement, MemberExpression,
  Identifier, ExpressionStatement, AssignmentExpression,
  UpdateExpression, BinaryOperator, Expression, BlockStatement, Statement
} from './estree';

export default function (content: Program) {
  const state = { imports: [], extras: [], options: null };

  for (let i = 0; i < content.body.length; i++) {
    const statement = content.body[i];
    if (isImportDeclaration(statement)) {
      state.imports.push(statement);
    } else {
      visit(statement, {
        LabeledStatement(node: LabeledStatement & { parent: any }) {
          if (isValidLabeled(node)) {
            if (isValidExpression(node.body)) {
              assignNode(node, expressionParser(node.body.expression));
            } else {
              const body: Statement[] = (<BlockStatement>node.body).body.map(stmt => {
                return isValidExpression(stmt) ? expressionParser(stmt.expression) : stmt;
              });
              const index = this.parent[this.property].indexOf(node);
              this.parent[this.property].splice(index, 1, ...body);
            }
            node.parent = this.parent;
          }
        }
      });
      if (isExportDefaultDeclaration(statement)) {
        state.options = statement;
      } else {
        state.extras.push(statement);
      }
    }
  }

  return state;
}

function isValidExpression(node: Node): node is ExpressionStatement {
  return isExpressionStatement(node) && /(Assignment|Update)E/.test(node.expression.type);
}

function isValidLabeled(node: LabeledStatement) {
  if (node.label.name === '$') {
    if (isBlockStatement(node.body)) {
      return node.body.body.some(stmt => isValidExpression(stmt));
    }
    return isValidExpression(node.body);
  }
  return false;
}

function expressionParser(node: Expression) {
  let left = (<AssignmentExpression>node).left || (<UpdateExpression>node).argument;
  if (isMemberExpression(left)) {
    const prop = getMemberObject(<MemberExpression>left);
    let operator: BinaryOperator, right: Expression;
    if (isAssignmentExpression(node)) {
      [{ right }] = [node];
      operator = <BinaryOperator>node.operator.replace('=', '').trim();
      right = operator ? binaryExpression(left, right, operator) : right;
    } else {
      right = binaryExpression(left, literal(1), <BinaryOperator>(<UpdateExpression>node).operator[0]);
    }
    let path = `(\`${literalify(left)}\`)`;
    const key = <ExpressionStatement>expression(path);
    const caller = memberExpression(prop, '$set');
    return expressionStatement(callExpression(caller, [key.expression, right]));
  } else {
    return expressionStatement(node);
  }
}

function getMemberObject(node: MemberExpression): Identifier {
  return <Identifier>(isMemberExpression(node.object) ? getMemberObject(node.object) : node.object);
}

function literalify(node: MemberExpression | Identifier) {
  if (isIdentifier(node)) {
    return (<Identifier>node).name;
  } else {
    const property = node.property;
    let prop = isLiteral(property) ? property.value : generate(property);
    prop = node.computed && !isLiteral(property) ? `\${${prop}}` : `${prop}`;
    if (isMemberExpression(node) && (isIdentifier(node.object) || isThisExpression(node.object))) {
      return prop;
    } else {
      return `${literalify(<MemberExpression>node.object)}.${prop}`;
    }
  }
}
