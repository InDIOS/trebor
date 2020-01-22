import Parser from '../parsers/script';
import ctx from '../parsers/script/context';
import { processElementSlot } from './slot';
import { Element } from '../parsers/html/element';
import { Segments } from '../parsers/script/segments';
import parseDirectives from '../parsers/script/parseDirective';
import { capitalize, snakeToCamel, each } from '../utils';
import {
  literal, callExpression, assignmentExpression, memberExpression, arrayPattern
} from '../parsers/script/nodes';

const COMP_NAME = 'component';

export default function parseComponent(node: Element, segmts: Segments, parentVarName: string, parser: Parser, index: number) {
  const tag = node.tagName;
  const isComp = tag === COMP_NAME;
  const component = snakeToCamel(tag);
  const varName = segmts.addVar(component);
  const anchor = segmts.addVar(`${component}Anchor`);
  node.varName = varName;

  let isValue: string = '';
  const isIsAttrExp = node.hasAttribute(':is');
  if (isComp) {
    const isAttr = `${isIsAttrExp ? ':' : ''}is`;
    isValue = <string>node.getAttribute(isAttr);
    node.removeAttribute(isAttr);
  }

  let attrs = '{';
  parseDirectives(node, segmts, parentVarName, parser);
  const extras: string[] = [];
  node.attributes.forEach(({ name, value }) => {
    const [type, attr] = [name[0], name.slice(1)];
    switch (type) {
      case '$':
        throw new Error(`Directive '${attr}' is not registered.`);
      case ':':
        attrs += `${snakeToCamel(attr)}() { return ${ctx(value, segmts.globals)}; },`;
        break;
      case '@': {
        const eventVar = `event${capitalize(snakeToCamel(attr))}${capitalize(varName)}`;
        segmts.init.push(eventVar);
        const code = ctx(value, segmts.globals, [' $data']);
        extras.push(`${eventVar} = ${varName}.$on('${attr}', $data => { ${code}; });`);
        segmts.destroy.add(callExpression(memberExpression(eventVar, '$off')));
        break;
      }
      default:
        attrs += `${snakeToCamel(name)}: '${value}'`;
        break;
    }
  });
  attrs += '}';

  const globName = capitalize(component);
  const params = [...segmts.globals];
  const componentName = varName.replace('_$', '');
  const setComponent = `_$set${capitalize(componentName)}`;
  const setAttrsComp = `_$setAttrs${capitalize(componentName)}`;
  const setComponentCall = callExpression(setComponent, isIsAttrExp ? params : []);
  if (isComp) {
    segmts.init.push(setComponent, setAttrsComp, 'children');
    segmts.extras.add(assignmentExpression('_$children', memberExpression(
      memberExpression('_$ctx', '$options'), 'children'
    )));
    segmts.extras.add(`${setAttrsComp} = () => (${attrs});`);
    segmts.extras.add(`${setComponent} = ${isIsAttrExp ? `(${params.join(', ')}) => {
        const comp = ${ctx(isValue, segmts.globals)};
        return isString(comp) ? children[comp] : comp;
      }` : `() => _$children['${isValue}']`};`);
    segmts.init.push(globName);
    segmts.extras.add(assignmentExpression(globName, setComponentCall));
  } else {
    const init = assignmentExpression(globName, callExpression('_$getComponent', ['_$ctx',
      ...(component === 'selfRef' ? [] : [literal(tag), literal(globName)])
    ]));
    if (!segmts.extras.includes(init)) {
      segmts.extras.add(init);
      segmts.init.push(globName);
      segmts.addImport('trebor/tools', '_$getComponent');
    }
  }
  segmts.addImport('trebor/tools', '_$callHook');
  segmts.addImport('trebor/tools', '_$addChild');
  const calls = (hook = 'destroy', params = []) => callExpression(
    '_$callHook', [varName, literal(`$${hook}`), ...params]
  );
  segmts.extras.add(`${varName} = _$addChild(_$ctx, ${globName}, ${isComp ? `${setAttrsComp}()` : attrs});`);
  segmts.create.add(assignmentExpression(anchor, callExpression(
    '_$child', index ? [parentVarName, literal(index)] : [parentVarName]
  )));
  segmts.create.add(calls('create'));
  extras.forEach(stmt => segmts.extras.add(stmt));
  each(node.childNodes, node => {
    processElementSlot(node, segmts, varName, parser);
  });
  segmts.unmount.add(calls('mount', [parentVarName, anchor]));
  if (isComp) {
    segmts.addImport('trebor/tools', '_$componentUpdate');
    const update = assignmentExpression(
      arrayPattern([varName, globName]),
      callExpression('_$componentUpdate', [
        '_$ctx', varName, globName, setComponentCall,
        callExpression(setAttrsComp), parentVarName, anchor
      ])
    );
    segmts.update.add(update);
  } else {
    segmts.update.add(calls('update'));
  }
  segmts.destroy.add(calls());
}
