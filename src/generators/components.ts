import { genBlockAreas } from './commons';
import { ctx } from '../utilities/context';
import { genDirective } from './directives';
import { NodeElement, BlockAreas } from '../utilities/classes';
import { kebabToCamelCases, getVarName, getParent, capitalize, createElement, filterParser } from '../utilities/tools';

export function genTag(node: NodeElement, areas: BlockAreas, scope: string) {
  [scope] = scope.split(',');
  let element = getVarName(areas.variables, '_$node');
  const expression = node.getAttribute('$tag');
  node.removeAttribute('$tag');
  if (node.childNodes.length) node['dymTag'] = element;
  if (expression) {
    const setElement = `setTag${capitalize(element)}`;
    const updateTag = `updateTag${capitalize(element)}`;
    areas.variables.push(setElement);
    const code = ctx(filterParser(expression), scope, areas.globals);
    let params = areas.globals && areas.globals.length > 0 ? `, ${areas.globals.join(', ')}` : '';
    const setTag = `${setElement}(${scope}${params})`;
    areas.extras.push(`${setElement} = (${scope}${params}) => ${code};`);
    areas.create.push(`${element} = _$ce(${setTag});`);
    areas.update.push(`let ${updateTag} = ${setTag};
		if (${updateTag}.toUpperCase() !== ${element}.tagName) {
			${element} = _$as(${element}, _$ce(${updateTag}));
		}
		${updateTag} = void 0;`);
  } else {
    element = getVarName(areas.variables, node.tagName);
  }
  return element;
}

export function genSlot(node: NodeElement, areas: BlockAreas, scope: string) {
  const slotName = node.getAttribute('name') || 'default';
  const slot = `${scope.split(', ')[0]}.$slots['${slotName}']`;
  areas.extras.push(`${slot} = _$d();`);
  const roots: string[] = [];
  node.childNodes.forEach(n => {
    const el = genBlockAreas(n, areas, scope);
    if (el) {
      roots.push(el);
      areas.create.push(`_$a(${slot}, ${el});`);
    }
  });
  const parent = node.parentElement;
  let root = parent['dymTag'] ? parent['dymTag'] : getParent(areas.variables, parent.tagName);
  areas.unmount.push(`_$a(${root || '_$frag'}, ${slot});`);
}

export function genComponent(node: NodeElement, areas: BlockAreas, scope: string) {
  const tag = node.tagName;
  let params: string[] = [];
  [scope, ...params] = scope.split(', ');
  const varName = kebabToCamelCases(tag);
  const anchor = getVarName(areas.variables, `${varName}Anchor`);
  const variable = getVarName(areas.variables, varName);
  const parent = node.parentElement;
  let root = parent['dymTag'] ? parent['dymTag'] : getParent(areas.variables, parent.tagName);
  let attrs = '{';
  const extras: string[] = [];
  let isValue: string;
  let isIsAttrExp = node.hasAttribute(':is');
  if (varName === 'component') {
    let isAttr = `${isIsAttrExp ? ':' : ''}is`;
    isValue = node.getAttribute(isAttr);
    node.removeAttribute(isAttr);
  }
  node.attributes.forEach(({ name, value }) => {
    if (name[0] === '@') {
      const eventVar = `event${capitalize(kebabToCamelCases(name.slice(1)))}${capitalize(variable)}`;
      areas.variables.push(eventVar);
      extras.push(`${eventVar} = ${variable}.$on('${name.slice(1)}', ${ctx(value, scope, params)});`);
      areas.destroy.push(`${eventVar}.off();`);
    } else if (name[0] === ':') {
      attrs += `${kebabToCamelCases(name.slice(1))}() { return ${ctx(value, scope, params)}; },`;
    } else if (name[0] === '$' && !/model|show/.test(name.slice(1))) {
      genDirective(variable, name.slice(1), value, areas, scope);
    } else {
      attrs += `${name}: '${value}'`;
    }
  });
  attrs += '}';
  let globCompName = capitalize(varName);
  let init = `const `;
  let setComponent = `set${capitalize(variable)}`;
  let setAttrsComponent = `setAttrs${capitalize(variable)}`;
  if (varName === 'component') {
    globCompName = capitalize(variable);
    areas.variables.push(setComponent, setAttrsComponent);
    areas.extras.push(`${setAttrsComponent} = () => (${attrs});
    ${setComponent} = ${isIsAttrExp ? `(${[scope, params].join(', ')}) => {
      let comp = ${ctx(isValue, scope, areas.globals.concat(params))};
      return _$isType(comp, 'string') ? children[comp] : comp;
    }` : `() => children['${isValue}']`};`);
    init += `${globCompName} = ${setComponent}(${isIsAttrExp ? [scope, ...params].join(', ') : ''});`;
    areas.extras.push(`${init}
    ${anchor} = _$ct();
    ${variable} = new ${globCompName}(${setAttrsComponent}(), ${scope});
    ${variable} && _$add(${scope}, ${variable});`);
  } else {
    init += `${globCompName} = ${varName === 'selfRef' ? `${scope}.constructor` : `children['${tag}'] || window['${globCompName}']`};`;
    !areas.extras.includes(init) && areas.extras.push(init);
  areas.extras.push(`${anchor} = _$ct();
	${variable} = new ${globCompName}(${attrs}, ${scope});
  _$add(${scope}, ${variable});`);
  }
  areas.create.push(`${variable}.$create();`);
  areas.extras = areas.extras.concat(extras);
  areas.unmount.push(`_$a(${root || '_$frag'}, ${anchor});`);
  node.childNodes.forEach(n => {
    let slotName = 'default';
    if (n.hasAttribute('slot')) {
      slotName = n.getAttribute('slot') || slotName;
    }
    const slotDec = `${variable}.$slots['${slotName}']`;
    const init = `${slotDec} = _$d();`;
    if (!areas.extras.includes(init)) {
      areas.extras.push(`if (${slotDec} && ${slotDec}.childNodes.length !== 0) {
				${init}
			}`);
    }
    if (n.nodeType === 3) {
      let slot = genBlockAreas(n, areas, scope);
      areas.create.push(`if (${slotDec}) {
			_$a(${slotDec}, ${slot});
		}`);
    } else if (n.nodeType === 1) {
      const tag = n.tagName;
      let slot = getVarName(areas.variables, tag);
      if (tag !== 'template') {
        areas.create.push(createElement(slot, tag, n.isSVGElement));
      } else {
        areas.create.push(`${slot} = _$d();`);
        n.appendChild(n.content);
      }
      n.childNodes.forEach(child => {
        const el = genBlockAreas(child, areas, scope);
        if (el) {
          areas.create.push(`_$a(${slot}, ${el});`);
        }
      });
      areas.create.push(`if (${slotDec}) {
			_$a(${slotDec}, ${slot});
		}`);
    }
  });
  areas.unmount.push(`${variable}.$mount(_$frag, ${anchor});`);
  if (varName === 'component') {
    let updateVar = `update${capitalize(variable)}`;
    areas.update.push(`let ${updateVar} = ${setComponent}(${isIsAttrExp ? [scope, ...params].join(', ') : ''});
    if (${updateVar} === ${globCompName}) {
      ${variable} && ${variable}.$update();
    } else {
      ${globCompName} = ${updateVar};
      if (${variable}) {
        ${variable}.$destroy();
        _$remove(${scope}, ${variable});
      }
      ${variable} = new ${globCompName}(${setAttrsComponent}(), ${scope});
      if (${variable}) {
        _$add(${scope}, ${variable});
        ${variable}.$create();
        ${variable}.$mount(${root || `${scope}.$parentEl`}, ${anchor});
      }
    }
    ${updateVar} = void 0;`);
  } else {
    areas.update.push(`${variable} && ${variable}.$update();`);
  }
  areas.destroy.push(`${variable} && ${variable}.$destroy();`);
}