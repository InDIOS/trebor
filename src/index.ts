import glob = require('glob');
import { Linter } from 'eslint';
import { minify } from 'uglify-js';
import { replace } from 'estraverse';
import { generate } from 'escodegen';
import { getDoc } from './utilities/html';
import { transpileModule } from 'typescript';
import { minify as minifyES } from 'uglify-es';
import { basename, extname, dirname, join } from 'path';
import { writeFileSync, readFileSync, statSync } from 'fs';
import { genTemplate, CompilerOptions } from './generators';
import { kebabToCamelCases, capitalize } from './utilities/tools';
import { TryStatement, FunctionDeclaration, FunctionExpression } from 'estree';

const dest = `{ _$CompCtr, _$, _$d, _$a, _$add, _$remove, _$as, _$r, _$ce, _$cse, _$ct, _$iu, _$tu,
 _$cm, _$sa, _$ga, _$al, _$ul, _$rl, _$bc, _$bs, _$f, _$e, _$is, _$ds, _$toStr, _$bindMultiSelect, _$gv,
 _$setRef, _$noop, _$isType, _$isKey, _$bindGroup, _$cu, _$emptyElse, _$extends, _$updateMultiSelect }`;
const esDeps = `import ${dest} from 'trebor/tools';`;
const cjsDeps = `const ${dest} = require('trebor/tools');`;
const tools = readFileSync(join(__dirname, '../tools/index.js'), 'utf8');

export function genSource(html: string, opts: CompilerOptions) {
  const body = getDoc(html, !!opts.minify);
  const { moduleName } = opts;
  const { imports, template, extras, options } = genTemplate(body, '_$state', opts);
  if (opts.format === 'es') {
		imports.unshift(esDeps);
  }
  const source = [template, extras,
    `function ${moduleName}(_$attrs, _$parent) {
			_$CompCtr.call(this, _$attrs, _$tpl${moduleName}, ${options}, _$parent);
			!_$parent && this.$create();
		}
    _$extends(${moduleName}, _$CompCtr);`
  ].filter(c => !!c.length).join('\n');
  return { imports, source };
}

function compileFile(options: CompilerOptions) {
  options.format = options.format || 'umd';
  const html = readFileSync(options.input, 'utf8');
  const ext = extname(options.input);
  const dir = dirname(options.input);
  const file = basename(options.input, ext);
  let moduleName = kebabToCamelCases(capitalize(file).replace(/\./g, '_'));
  options.moduleName = options.moduleName || moduleName;
	const fileName = `${file}.${options.format}.js`;
  if (!options.out) {
    options.out = dir;
  }
  const { compilerOptions, uglifyOptions } = getOptions(options);
	const { imports, source } = genSource(html, options);
  const code = [
		options.format === 'es' ? '' : options.format === 'cjs' ? cjsDeps : [
			...imports, tools
		].join('\n'), source, exportFormat(options.format, moduleName)
  ].join('\n');
  let { outputText } = transpileModule(code, { compilerOptions });

  outputText = optimize(options.format === 'es' ? [...imports, outputText].join('\n') : outputText);

  if (options.format === 'umd') {
    outputText = umdTpl(moduleName, outputText);
  } else if (options.format === 'iif') {
    if (options.minify) {
      uglifyOptions.compress = uglifyOptions.compress || {};
      uglifyOptions.compress.top_retain = [moduleName];
    }
		outputText = iifTpl(moduleName, outputText);
  }
  const min = options.format === 'es' ? minifyES : minify;
  writeFileSync(join(options.out, fileName), options.minify ? min(outputText, uglifyOptions).code : outputText, 'utf8');
}

export function exportFormat(format: string, moduleName: string) {
	return `${format === 'es' ? 'export default' : 'export ='} ${moduleName};`;
}

function getOptions(options: CompilerOptions) {
  let uglifyOptions: { [key: string]: any } = { compress: { toplevel: true } };
  let compilerOptions: { [key: string]: any } = {
    sourceMap: false, importHelpers: false, target: 1, module: 1, removeComments: true
  };
  if (typeof options.noComments !== 'boolean') {
    options.noComments = false;
  }
  if (options.format === 'es') {
    compilerOptions.module = 5;
  } else if (options.format === 'amd') {
    compilerOptions.module = 2;
	} else if (options.format === 'cjs') { // TO-DO: Implement this module system
		compilerOptions.module = 1;
	} else if (options.format === 'system') { // TO-DO: Implement this module system
    compilerOptions.module = 4;
  }
  if (options.minify) {
    uglifyOptions.mangle = {};
  }
  return { uglifyOptions, compilerOptions };
}

export function optimize(src: string, iteration = 0) {
  const linter = new Linter();
  const messages = linter.verify(src, {
    parserOptions: { ecmaVersion: 8, sourceType: 'module' },
    env: { browser: true, amd: true, node: true, es6: true },
    rules: {
      'no-empty': [2],
      'no-debugger': [2],
      'no-unused-vars': [2, { args: 'all', caughtErrors: 'all' }]
    }
  });
  const canOptimize = messages.length !== 0;
  let ast = null;
  try {
    ast = linter.getSourceCode().ast;
  } catch (error) {
    console.log(error);
    return src;
  }

  if (!canOptimize) {
    return src;
  }

  function canRemove(node) {
    const { type, loc } = node;
    const { start, end } = loc;
    const found = messages.filter(msg => type === msg.nodeType && start.column + 1 === msg.column && end.column + 1 === msg.endColumn && start.line === msg.line && end.line === msg.endLine);
    return !!found.length;
  }

  replace(ast, {
    enter(node) {
      switch (true) {
        case node.type === 'SwitchStatement' && canRemove(node):
        case node.type === 'WhileStatement' && canRemove(node.body):
        case node.type === 'FunctionDeclaration' && canRemove(node.id):
        case node.type === 'IfStatement' && ((canRemove(node.consequent) && node.alternate === null) || (canRemove(node.consequent) && canRemove(node.alternate))):
          this.remove();
          break;
        case node.type === 'TryStatement' && node.finalizer && canRemove(node.finalizer):
          (<TryStatement>node).finalizer = null;
          return node;
        case node.type === 'ImportDeclaration' || node.type === 'VariableDeclaration': {
          const [subProp, prop] = node.type === 'ImportDeclaration' ? ['local', 'specifiers'] : ['id', 'declarations'];
          let subs = node[prop];
          node[prop] = subs.filter(n => !canRemove(n[subProp]));
          if (node[prop].length === 0) {
            this.remove();
            break;
          }
          return node;
        }
        case node.type === 'FunctionDeclaration' || node.type === 'FunctionExpression': {
          const { params } = (<FunctionDeclaration | FunctionExpression>node);
          for (let i = params.length - 1; i >= 0; i--) {
            if (canRemove(params[i])) {
              params.splice(i, 1);
            } else {
              i = -1;
            }
          }
          return node;
        }
        case node.type === 'DebuggerStatement':
          this.remove();
          break;
        default:
          return node;
      }
    }
  });
  const out = generate(ast, { format: { indent: { style: '  ' } } });
  iteration++;
  return iteration < 5 ? optimize(out, iteration) : out;
}

function umdTpl(moduleName: string, body: string) {
  return `!function (global, factory) {
		typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
		typeof define === 'function' && define.amd ? define('${moduleName}', factory) :
		(global.${moduleName} = factory());
	}(this, function () {
		${body.replace('module.exports =', 'return')}
	});`;
	}

function iifTpl(moduleName: string, body: string) {
	return `!function(glob) { 
		${body.replace('module.exports =', `glob['${moduleName}'] =`)} 
	}(this);`;
}

export default function cli(options: CompilerOptions) {
  const info = statSync(options.input);
  if (info.isFile()) {
    compileFile(options);
  } else if (info.isDirectory()) {
    glob(`${options.input}/**/*.html`, (err, files) => {
      if (err) throw err;
      files.filter(f => !f.includes('node_modules')).forEach(file => {
        compileFile({ ...options, ...{ input: file } });
      });
    });
  }
}