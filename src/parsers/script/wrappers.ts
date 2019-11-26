import {
  logicalExpression, expressionStatement, callExpression,
  assignmentExpression, memberExpression, thisExpression,
  conditionalExpression, binaryExpression, sequenceExpression,
  functionExpression, unaryExpression, returnStatement, literal,
  ArgumentListElement, ExpressionParameter
} from './nodes';
import { BinaryOperator } from './estree';

function iif(component: string, moduleClass: ArgumentListElement, statements = []) {
  const glob = 'root';
  const ctor = callExpression('_$createComponent', [moduleClass, `_$tpl${component}`]);
  const assign = assignmentExpression(memberExpression(glob, component), ctor);
  statements.push(expressionStatement(assign));
  const call = callExpression(functionExpression(null, [glob], statements), [thisExpression()]);
  return expressionStatement(unaryExpression('!', call));
}

function umd(component: string, moduleClass: ArgumentListElement, statements = []) {
  const glo = 'root', mod = 'module', exp = 'exports', def = 'define', fac = 'factory', and = '&&';
  const factoryCall = callExpression(fac);
  const setGlob = assignmentExpression(glo, logicalExpression(glo, 'self', '||'));
  const setGlobVal = assignmentExpression(memberExpression(glo, component), factoryCall);
  const alternate = sequenceExpression([setGlob, setGlobVal]);
  const testCommon = logicalExpression(isType(exp, 'object'), isType(mod, 'undefined', false), and);
  const consequentCommon = assignmentExpression(memberExpression(mod, exp), factoryCall);
  const testAmd = logicalExpression(isType(def, 'function'), memberExpression(def, 'amd'), and);
  const consequentAmd = callExpression(def, [fac]);
  const conditionAmd = conditionalExpression(testAmd, consequentAmd, alternate);
  statements.push(returnStatement(callExpression('_$createComponent', [moduleClass, `_$tpl${component}`])));
  const call = callExpression(functionExpression(null, [glo, fac], [
    expressionStatement(conditionalExpression(testCommon, consequentCommon, conditionAmd))
  ]), [thisExpression(), functionExpression(null, [], statements)]);
  return expressionStatement(unaryExpression('!', call));
}

function isType(value: ExpressionParameter, type: string, isEqual = true) {
  const right = literal(type);
  const left = unaryExpression('typeof', value);
  return binaryExpression(left, right, <BinaryOperator>`${isEqual ? '=' : '!'}==`);
}

export { iif, umd };
