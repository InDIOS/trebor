import { each } from '../../utils';
import { Segments } from './segments';
import { Element } from '../html/element';
import ctx from './context';
import { directives } from '../../directives';

export default function parseDirectives(node: Element, segmts: Segments, parentVarName: string, createTpl: any) {
  const attrs = node.attributes.filter(({ name }) => name[0] === '$');
  if (attrs.length) {
    each(directives, directive => {
      const attr = `$${directive.attr}`;
      if (node.hasAttribute(attr)) {
        const expression = node.getAttribute(attr);
        node.removeAttribute(attr);
        segmts.globalTools = [];
        directive.ctx = ctx;
        directive.createTpl = createTpl;
        directive.action(node, expression, segmts, parentVarName);
        delete segmts.globalTools;
        if (directive.tools) {
          segmts.tools.add(directive.tools);
        }
      }
    });
  }
}
