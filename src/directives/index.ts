import tag from './tag';
import loop from './loop';
import show from './show';
import name from './name';
import html from './html';
import value from './value';
import condition from './condition';
import Parser from '../parsers/script';
import { Element } from '../parsers/html/element';
import { Segments } from '../parsers/script/segments';

interface Directive {
  attr: string;
  tools: string;
  priority: number;
  action(node: Element, expression: string, segmts: Segments, parentVarName: string): void;
  reference?: true;
  walkChildren?: false;
  ctx?(source: string, params?: Set<string>, extras?: string[]): string;
  parser?: Parser;
}

let directives: Directive[] = [
  {
    attr: 'for',
    tools: '',
    priority: -2,
    action: loop,
    reference: true
  },
  {
    attr: 'if',
    tools: '',
    priority: -1,
    action: condition,
    reference: true
  },
  {
    attr: 'value',
    tools: '',
    priority: 10,
    action: value
  },
  {
    attr: 'name',
    tools: '',
    priority: 10,
    action: name
  },
  {
    attr: 'tag',
    tools: '',
    priority: 10,
    action: tag
  },
  {
    attr: 'html',
    tools: '',
    priority: -1,
    action: html,
    walkChildren: false
  },
  {
    attr: 'show',
    tools: '',
    priority: 10,
    action: show
  }
];

export { Directive, directives };
  
export default function prepareDirectives(customeDirectives: Directive[]) {
  directives = customeDirectives.concat(directives);

  directives.sort((a, b) => a.priority - b.priority);

  const specialAttrs: string[] = [];
  const nonWalkAttrs: string[] = [];

  directives.forEach(directive => {
    if (directive.reference === true) {
      specialAttrs.push(directive.attr);
      nonWalkAttrs.push(directive.attr);
    } else if (directive.walkChildren === false) {
      nonWalkAttrs.push(directive.attr);
    }
  });
  return { specialAttrs, nonWalkAttrs };
}
