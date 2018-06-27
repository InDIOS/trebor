import { genIf } from './conditions';
import { genForItem } from './loops';
import { genHtml } from './directives';
import { ctx } from '../utilities/context';
import { genSetAttrs } from './attributes';
import { AllHtmlEntities } from 'html-entities';
import { genSlot, genComponent, genTag } from './components';
import { NodeElement, BlockAreas } from '../utilities/classes';
import {
  getVarName, capitalize, createNode, createElement, escapeExp, filterParser, clearText
} from '../utilities/tools';

const entities = new AllHtmlEntities();

export function genBlockAreas(node: NodeElement, areas: BlockAreas, scope: string) {
  if (node.nodeType === 3) {
    let variable = '';
    if (/\{\{\s*((?!\}\})(.|\n))*\}\}/.test(node.textContent)) {
      [scope] = scope.split(',');
      variable = getVarName(areas.variables, 'txt');
      const setVariable = `set${capitalize(variable)}`;
      areas.variables.push(setVariable);
      const codeFrag = node.textContent;
      const intrps = codeFrag.split(/(\{\{\s*((?!\}\})(.|\n))*\}\})/).filter(int => !!clearText(int).trim());
      const code = intrps.map(int => {
        if (int.startsWith('{{') && int.endsWith('}}')) {
          int = int.replace(/\{\{(\s*((?!\}\})(.|\n))*)\}\}/g, (_, replacer: string) => replacer.trim());
          return `(${ctx(filterParser(int), scope, areas.globals)})`;
        }
        return `'${clearText(entities.decode(int))}'`;
      }).join('+');
      let params = areas.globals && areas.globals.length > 0 ? `, ${areas.globals.join(', ')}` : '';
      const setTxt = `${setVariable}(${scope}${params})`;
      areas.extras.push(`${setVariable} = (${scope}${params}) => ${code};`);
      areas.create.push(createNode(variable));
      areas.create.push(`${variable}.data = ${setTxt};`);
      areas.update.push(genTextUpdate(`${scope}${params}`, variable));
      return variable;
    } else {
      variable = getVarName(areas.variables, 'txt');
      areas.create.push(createNode(variable, `'${clearText(entities.decode(node.textContent))}'`));
      return variable;
    }
  } else if (node.nodeType === 1) {
    switch (true) {
      case node.hasAttribute('$for') && !node.hasAttribute('$if'):
        return genForItem(node, areas, scope);
      case node.hasAttribute('$if'):
        return genIf(node, areas, scope);
      case node.hasAttribute('$html') && !node.getAttribute('$html'):
        return genHtml(node, areas);
      case node.hasAttribute('$html') && !!node.getAttribute('$html'):
        return genHtml(node, areas, scope);
      case node.tagName === 'slot':
        return genSlot(node, areas, scope);
      case node.isUnknownElement:
        return genComponent(node, areas, scope);
      default:
        const tag = node.tagName;
        const isTpl = tag === 'template';
        const isBlock = node['isBlock'];
        let variable = getVarName(areas.variables, tag);
        if (node.hasAttribute('$tag')) {
          areas.variables.pop();
          variable = genTag(node, areas, scope);
        } else if (!isTpl || !isBlock) {
          areas.create.push(createElement(variable, tag));
        }
        let childNodes: NodeElement[] = node.childNodes;
        if (isTpl) {
          childNodes = node.content.childNodes;
        }
        let { length } = childNodes;
        for (let i = 0; i < length; i++) {
          const n = childNodes[i];
          const el = genBlockAreas(n, areas, scope);
          if (el) {
            areas.unmount.push(`_$a(${variable}${isTpl && !isBlock ? '.content' : ''}, ${el});`);
          }
          if (length !== childNodes.length) {
            i--;
            length = childNodes.length;
          }
        }
        const attr = genSetAttrs(variable, node, scope, areas);
        if (attr) {
          areas.hydrate.push(attr);
        }
        if (isTpl && areas.create.length === 0) {
          areas.variables.splice(areas.variables.indexOf(variable), 1);
          variable = '';
        }
        return variable;
    }
  } else if (node.nodeType === 8) {
    const variable = getVarName(areas.variables, 'comment');
    areas.create.push(createNode(variable, `'${escapeExp(node.textContent).replace(/'/g, `\\'`)}'`));
    return variable;
  }
}

export function genBody(funcName: string, scope: string, areas: BlockAreas, condType?: string) {
  return `${!areas.outer.length ? '' : `${areas.outer.join('\n')}
	`}function ${funcName}(${scope}, children) {
		${!areas.variables.length ? '' : `let ${areas.variables.join(', ')}`};${!areas.extras.length ? '' : `
		${areas.extras.join('\n')}`}
		return {
			${!condType ? '' : `type: '${condType}'
			,`}$create${!!areas.create.length ? `() {
				${areas.create.join('\n')}${!areas.hydrate.length ? '' : `
				this.$hydrate();`}
			}` : ': _$noop'},${!areas.hydrate.length ? '' : `
			$hydrate() {
				${areas.hydrate.join('\n')}
			},`}
      $mount(parent, sibling) {
        ${condType || scope.includes(',') ? '' : `this.$parentEl = parent;
        this.$siblingEl = sibling;`}
				this.$unmount();
				${areas.mount.join('\n')}${!areas.mountDirt.length ? '' : `
				${areas.mountDirt.join('\n')}`}
			},
			$update${!!areas.update.length ? `(${scope}) {
        ${areas.update.join('\n')}
			}` : ': _$noop'},
			$unmount${!!areas.unmount.length ? `() {
				${areas.unmount.join('\n')}
			}` : ': _$noop'},
      $destroy() {
				this.$unmount();
        ${condType || scope.includes(',') ? '' : `this.$parent = null;
        this.$parentEl = null;
        this.$siblingEl = null;
				this.$children.splice(0, this.$children.length);`}
				${areas.destroy.join('\n')}
				${areas.variables.join(' = ')} = void 0;
      }
		};
	}`;
}

function genTextUpdate(scope: string, variable: string) {
  const updateVar = `update${capitalize(variable)}`;
  return `var ${updateVar} = set${capitalize(variable)}(${scope});
	if (${variable}.data !== _$toStr(${updateVar})) {
		${variable}.data = ${updateVar};
	}
	${updateVar} = void 0;`;
}