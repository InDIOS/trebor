import abs from '../utilities/jsonToCss';
import toJSON from '../utilities/cssToJson';
import { CompilerOptions } from '../types.d';
import { walkNode } from '../utilities/html';
import { toOptions } from '../utilities/context';
import { genBlockAreas, genBody } from './commons';
import { hash, capitalize } from '../utilities/tools';
import { NodeElement, BlockAreas } from '../utilities/classes';

const toCSS = abs({ minify: true });

export function genTemplate(node: NodeElement, scope: string, opts: CompilerOptions) {
	const areas: BlockAreas = new BlockAreas();
	const links = node.querySelectorAll('links');
	const styleNode = node.querySelector('style');
	const scriptNode = node.querySelector('script');
	scriptNode.remove();
	if (styleNode) {
		styleNode.remove();
		if (styleNode.hasAttribute('scoped')) {
			const styleAst = toJSON(styleNode.textContent);
			const { className, styleText } = toCSS(styleAst);
			areas.mount.push(`_$is('${className}', ${JSON.stringify(styleText)});`);
			areas.destroy.push(`_$ds('${className}');`);
			walkNode(node, el => {
				if (el.nodeType === 1 && !/template|slot|options/.test(el.tagName)) {
					el.setAttribute('class', `${className}${el.getAttribute('class') ? ` ${el.getAttribute('class')}` : ''}`);
				}
			});
		} else {
			const className = `scope_${hash(opts.input)}`;
      areas.mount.push(`_$is('${className}', ${JSON.stringify(toCSS.minify(styleNode.textContent.trim()))});`);
			areas.destroy.push(`_$ds('${className}');`);
		}
	} else if (links.length) {
		links.forEach(link => {
			if (link.getAttribute('rel') === 'stylesheet') {
				const className = `scope_${hash(link.getAttribute('href'))}`;
				areas.outer.push(`import style${capitalize(className)} from '${link.getAttribute('href')}';`);
				areas.mount.push(`_$is('${className}', style${capitalize(className)});`);
				areas.destroy.push(`_$ds('${className}');`);
			}
		});
	}
	let script = '';
	if (scriptNode.hasAttribute('src')) {
		script = `import options from '${scriptNode.getAttribute('src') || ''}';
		export default options;`;
	} else {
		script = scriptNode.textContent.trim();
	}
	const { imports, options, extras } = toOptions(script);
	areas.variables.push('_$frag');
	areas.extras.push('_$frag = _$d();');
	let { length } = node.childNodes;
	for (let i = 0; i < length; i++) {
		const n = node.childNodes[i];
		const el = genBlockAreas(n, areas, scope);
		if (el) {
			areas.unmount.push(`_$a(_$frag, ${el});`);
		}
		if (length !== node.childNodes.length) {
			i--;
			length = node.childNodes.length;
		}
	}
	areas.mount.push('_$a(_$(parent), _$frag, _$(sibling));');
	areas.destroy.push(`delete ${scope}.$root;`);
	const template = genBody(`_$tpl${opts.moduleName}`, scope, areas);
	return { imports, template, extras, options };
}