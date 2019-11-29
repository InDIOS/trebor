import parseCss from './css';
import { readFileSync } from 'fs';
import parseJs from './script/parser';
import { iif } from './script/wrappers';
import { hash, capitalize } from '../utils';
import parseHtml, { Element } from './html';
import { join, dirname, resolve } from 'path';
import parseScript from './script/parseScript';
import prepareDirectives, { Directive } from '../directives';
import { callExpression, exportDefaultDeclaration } from './script/nodes';
import createTpl, { Segments, setSpecialAttrs, setNonWalkAttrs } from './script';

type ObjectMap<T> = Record<string, T>;

export interface CompilerOptions {
  minify?: boolean;
  comments?: boolean;
  moduleName: string;
  optimize?: boolean;
  format?: 'esm' | 'cjs' | 'iif';
}

export interface CompileSourceOptions {
  filePath: string;
  compilerOptions: CompilerOptions;
  cssParser?(source: string, options: ObjectMap<any>): string;
  htmlParser?(source: string, options: ObjectMap<any>): string;
  jsParser?(source: string, options: ObjectMap<any>): string;
  directives?: Directive[];
}

let tools = null;

export default function compiler(html: string, option: CompileSourceOptions) {
  const { compilerOptions, directives, cssParser, htmlParser, jsParser, filePath } = option;
  const moduleName = capitalize(compilerOptions.moduleName);

  html = htmlParser ? htmlParser(html, compilerOptions) : html;
  const document = parseHtml(html, compilerOptions);

  const segmts = new Segments();
  const cssImports: string[] = [];
  const links = document.querySelectorAll('link');
  const styles = document.querySelector('style');
  const scripts = document.querySelector('script');

  if (styles) {
    styles.remove();
    const isScoped = styles.hasAttribute('scoped');
    const style = cssParser ? cssParser(styles.textContent, compilerOptions) : styles.textContent;
    const { scope, css } = parseCss(style, { minify: compilerOptions.minify, scoped: isScoped });
    const className = isScoped ? scope : `scope_${hash(filePath)}`;
    segmts.addImport('trebor/tools', '_$insertStyle');
    segmts.addImport('trebor/tools', '_$removeStyle');
    segmts.destroy.add(`_$removeStyle('${className}');`);
    segmts.mount.add(`_$insertStyle('${className}', ${JSON.stringify(css)});`);
    if (isScoped) {
      document.childNodes.forEach(scopedElement(scope));
    }
  } else if (links.length) {
    segmts.addImport('trebor/tools', '_$insertStyle');
    segmts.addImport('trebor/tools', '_$removeStyle');
    links.forEach(link => {
      if (link.getAttribute('rel') === 'stylesheet') {
        const className = `scope_${hash(link.getAttribute('href'))}`;
        cssImports.push(`import style${capitalize(className)} from '${link.getAttribute('href')}';`);
        segmts.mount.add(`_$insertStyle('${className}', style${capitalize(className)});`);
        segmts.destroy.add(`_$removeStyle('${className}');`);
      }
    });
  }

  let script = 'export default class {}';
  if (scripts) {
    scripts.remove();
    if (scripts.hasAttribute('src')) {
      const dir = dirname(filePath);
      const file = resolve(dir, scripts.getAttribute('src'));
      script = readFileSync(file, 'utf8');
    } else {
      script = scripts.textContent;
    }
  }

  const ast = parseJs(jsParser ? jsParser(script, compilerOptions) : script);
  const { imports, extras, options } = parseScript(ast);
  const { specialAttrs, nonWalkAttrs } = prepareDirectives(directives || []);

  setSpecialAttrs(specialAttrs);
  setNonWalkAttrs(nonWalkAttrs);

  const tplName = `tpl${moduleName}`;
  const tpl = createTpl(document.childNodes, segmts, tplName);
  const compCreator = '_$createComponent';
  segmts.addImport('trebor/tools', compCreator);
  const moduleClass = options.declaration;
  const code = [];

  if (compilerOptions.format === 'iif') {
    if (!tools) {
      tools = parseJs(readFileSync(join(__dirname, '../../tools/index.js'), 'utf8'));
     tools.body.pop();
    }
    code.push(iif(moduleName, moduleClass, [...tools.body, ...segmts.getTools(), ...extras, ...tpl]));
  } else {
    code.push(...segmts.imports, ...imports);
    const opt = exportDefaultDeclaration(callExpression(compCreator, [moduleClass, `_$${tplName}`]));
    code.push(...segmts.getTools(), ...extras, ...tpl, opt);
  }
  return code;
}

function scopedElement(scope: string) {
  return (el: Element) => {
    if (el.nodeType === 1 && !/template|slot|options/.test(el.tagName)) {
      el.setAttribute('class', `${scope}${el.getAttribute('class') ? ` ${el.getAttribute('class')}` : ''}`);
      el.childNodes.forEach(scopedElement(scope));
    }
  };
}
