import { Directive } from './index';
import ctx from '../parsers/script/context';
import { Element } from '../parsers/html/element';
import { Segments } from '../parsers/script/segments';
import { replaceItem, replaceVar, filters, filterPlaceholders } from '../utils';
import { callExpression, memberExpression, thisExpression } from '../parsers/script/nodes';

export default function loopDirective(this: Directive, node: Element, expression: string, segmts: Segments, parentVarName: string) {
  this.tools = tools;
  const loopIndex = ++segmts.loops;
  const loopItem = `loop_${loopIndex}`;
  const loop = `_$loopBlock_${loopIndex}`;
  const anchor = `_$loopAnchor_${loopIndex}`;
  replaceItem(segmts.init, node.varName, anchor);
  replaceVar(segmts.create, node.varName, anchor);
  segmts.variables.set(node.tagName, segmts.variables.get(node.tagName) - 1);
  segmts.addImport('trebor/tools', '_$each');
  segmts.addImport('trebor/tools', '_$slice');
  segmts.addImport('trebor/tools', '_$apply');

  let [iterator, variable] = expression.split(' in ');
  const [value, key, index] = iterator.split(',').map(v => v.replace(/[()]/g, '').trim());
  let [asNumber, ...rest] = variable.split('\|');
  let [start, end] = asNumber.split('..');
  if (!isNaN(+start)) {
    let length = (+end || 0) - (+start);
    let array = [...Array(length > 0 ? length : -length)].map((_, i) => end ? i + (+start) : i);
    variable = [`[${array.join(', ')}]`, ...rest].join('|');
  }
  const args = filterPlaceholders([...segmts.globals].slice(1));
  const params = args ? `, ${args.join(', ')}` : '';
  const code = ctx(filters(variable, segmts), segmts.globals, segmts.globalTools);

  segmts.init.push(loop);
  segmts.extras.add(`${loop} = _$forLoop(_$ctx, ${code}, _$${loopItem}${params});`);
  segmts.create.add(callExpression(memberExpression(loop, '$create')));
  segmts.unmount.add(callExpression(memberExpression(loop, '$mount'), [parentVarName, anchor]));
  segmts.update.add(`${loop}.$update(_$ctx, ${code}${params});`);
  segmts.destroy.add(callExpression(memberExpression(loop, '$destroy')));
  
  const subSegmts = new Segments(segmts);
  const _node = node.tagName === 'template' ? node : { childNodes: [node] };
  
  subSegmts.globals.add(value).add(key || '_$v').add(index || '_$i');
  args.forEach(arg => subSegmts.globals.add(arg));
  subSegmts.destroy.replace(callExpression(memberExpression(thisExpression(), '$unmount')));
  const loopItemFunc: any = this.parser.parse(_node.childNodes, subSegmts, loopItem);

  segmts.loops = subSegmts.loops;
  segmts.body.add(...loopItemFunc);
  segmts._imports = subSegmts._imports;
  segmts.conditions = subSegmts.conditions;
}

const tools = `function _$forLoop(ctx, list, loop) {
  const items = {};
  const globs = _$slice(arguments, 3);
  let loopParent, loopSibling;
  _$each(list, (item, key, index) => { items[key] = _$apply(loop, [ctx, item, key, index], globs); });
  return {
    $create() {
      _$each(items, item => { item.$create(); });
    },
    $mount(parent, sibling) {
      loopParent = _$(parent);
      loopSibling = _$(sibling);
      _$each(items, item => { item.$mount(loopParent, loopSibling); });
    },
    $update(ctx, obj) {
      const globs = _$slice(arguments, 2);
      _$each(items, (item, key, index) => {
        if (obj[key]) {
          _$apply(item.$update, [ctx, obj[key], key, index], globs, item);
        } else {
          item.$destroy();
          delete items[key];
        }
      });
      _$each(obj, (item, key, index) => {
        if (!items[key]) {
          items[key] = _$apply(loop, [ctx, item, key, index], globs);
          items[key].$create();
          items[key].$mount(loopParent, loopSibling);
        }
      });
    },
    $destroy() {
      _$each(items, item => { item.$destroy(); });
    }
  };
}`;
