import { ctx } from '../utilities/context';
import { BlockAreas } from '../utilities/classes';
import { capitalize, filters, toMap } from '../utilities/tools';

const isBooleanAttr = toMap(`allowfullscreen,async,autofocus,autoplay,checked,compact,controls,
declare,default,defaultchecked,defaultmuted,defaultselected,defer,disabled,enabled,formnovalidate,
hidden,indeterminate,inert,ismap,itemscope,loop,multiple,muted,nohref,noresize,noshade,novalidate,
nowrap,open,pauseonexit,readonly,required,reversed,scoped,seamless,selected,sortable,translate,
truespeed,typemustmatch,visible`);

export function genBind(variable: string, attr: string, expression: string, areas: BlockAreas, scope: string, type: string, classes: string) {
  [scope] = scope.split(', ');
  const bindFuncName = `bind${capitalize(attr)}${capitalize(variable)}`;
  const isSelMulti = /select/.test(variable) && type === 'multiple';
  let params = areas.globals.length > 0 ? `, ${areas.globals.join(', ')}` : '';
  let bindExp = expression === null ? 'true' : `${ctx(filters(scope, expression), scope, areas.globals.concat([variable]))}`;
  if (attr === 'class' || attr === 'style') {
    bindExp = attr === 'style' ?
			`_$bindStyle(${bindExp})` : `(${classes ? `'${classes} ' + ` : ''}_$bindClasses(${bindExp})).trim()`;
  }
  areas.variables.push(bindFuncName);
  areas.extras.push(`${bindFuncName} = (${scope}${params}) => (['${attr}', ${bindExp}]);`);
  let bindFunc = `${bindFuncName}(${scope}${params})`;
  if (attr === 'value' && /input|select|textarea/.test(variable) && !/checkbox|radio/.test(type)) {
    if (isSelMulti) {
      areas.update.push(`_$bindMultiSelect(${variable}, ${bindFunc}[1]);`);
      areas.unmount.push(`_$bindMultiSelect(${variable}, ${bindFunc}[1]);`);
    } else {
      areas.hydrate.push(`${variable}.value = _$toString(${bindFunc}[1]);`);
    }
  } else if (isBooleanAttr(attr)) {
    areas.update.push(`_$bindBooleanAttr(${variable}, ${bindFunc});`);
    areas.hydrate.push(`_$bindBooleanAttr(${variable}, ${bindFunc});`);
  } else {
		areas.hydrate.push(`_$setAttr(${variable}, ${bindFunc});`);
  }
	!isSelMulti && !isBooleanAttr(attr) && areas.update.push(`_$bindUpdate(${variable}, ${bindFunc});`);
}
