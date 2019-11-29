import { Segments } from '../parsers/script/segments';
import {
  callExpression, literal, assignmentExpression, memberExpression
} from '../parsers/script/nodes';

export default function referenceAttribute(varName: string, ref: string, segmts: Segments) {
  const refVar = '_$refs';
  const initRef = assignmentExpression(refVar, memberExpression('_$ctx', refVar.slice(1)));
  if (!segmts.extras.includes(initRef)) {
    segmts.init.push(refVar);
    segmts.extras.add(initRef);
  }
  const [setRef, removeRef] = ['setReference', 'removeReference'].map(func => {
    const funcName = `_$${func}`;
    segmts.addImport('trebor/tools', funcName);
    return callExpression(funcName, [refVar, literal(ref), varName]);
  });
  segmts.unmount.add(setRef);
  segmts.destroy.add(removeRef);
}