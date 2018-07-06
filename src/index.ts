import glob = require('glob');
import { Linter } from 'eslint';
import { minify } from 'uglify-js';
import { replace } from 'estraverse';
import { generate } from 'escodegen';
import { getDoc } from './utilities/html';
import { genTemplate } from './generators';
import { CompilerOptions } from './types.d';
import { transpileModule } from 'typescript';
import { minify as minifyES } from 'uglify-es';
import { basename, extname, dirname, join } from 'path';
import { writeFileSync, readFileSync, statSync } from 'fs';
import { kebabToCamelCases, capitalize } from './utilities/tools';
import { TryStatement, FunctionDeclaration, FunctionExpression } from 'estree';

const deps = `import { 
	_$CompCtr, _$, _$d, _$a, _$add, _$as, _$r, _$ce, _$cse,	_$ct, _$cm,
	 _$sa, _$ga, _$al, _$ul, _$rl, _$bc, _$bs, _$f, _$e, _$is, _$ds, _$toStr,
	 _$setRef, _$noop, _$isType, _$plugin, _$isKey, _$bindGroup,_$emptyElse
} from 'trebor/tools';`;
const tools = readFileSync(join(__dirname, '../tools/index.js'), 'utf8');

function genSource(html: string, opts: CompilerOptions) {
  const body = getDoc(html, !!opts.minify);
  const { moduleName } = opts;
  const { imports, template, extras, options } = genTemplate(body, '_$state', opts);
  if (opts.format === 'es') {
    imports.unshift(deps);
  }
  const source = [template, extras,
    `function ${moduleName}(_$attrs, _$parent) {
			_$CompCtr.call(this, _$attrs, _$tpl${moduleName}, ${options}, _$parent);
			!_$parent && this.$create();
		}
		${moduleName}.plugin = _$plugin;
		${moduleName}.prototype = Object.create(_$CompCtr.prototype);
		${moduleName}.prototype.constructor = ${moduleName};`
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
  if (!options.out) {
    options.out = join(dir, `${file}.${options.format}.js`);
  }
  const { compilerOptions, uglifyOptions } = getOptions(options);
  const {imports, source} = genSource(html, options);
  const code = [
    options.format === 'es' ? '' : [...imports, tools].join('\n'),
    source,
    exportFormat(options.format, moduleName),
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
    outputText = `var ${moduleName} = (function() { ${outputText.replace('module.exports =', 'return')} })();`;
  }
  const min = options.format === 'es' ? minifyES : minify;
  writeFileSync(options.out, options.minify ? min(outputText, uglifyOptions).code : outputText, 'utf8');
}

function exportFormat(format: string, moduleName: string) {
  return `${format === 'es' ? 'export default' : /umd|iif/.test(format) ? 'export =' : '\nreturn'} ${moduleName};`;
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
  } else if (options.format === 'system') {
    compilerOptions.module = 4;
  }
  if (options.minify) {
    uglifyOptions.mangle = {};
  }
  return { uglifyOptions, compilerOptions };
}

function optimize(src: string, iteration = 0) {
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
	if (module !== undefined && typeof module.exports === 'object') {
		factory(module);
	} else if (typeof define === 'function' && define.amd) {
		define('${moduleName}', factory);
	} else {
		var module = { exports: {} };
		factory(module);
		global.${moduleName} = module.exports;
	}
}(this, function (module) {
	${body}
});`;
}

function webpackLoader(wp, src: string, map, meta) {
  const format = 'es';
  const ext = extname(wp.resourcePath);
  const file = basename(wp.resourcePath, ext);
  const moduleName = kebabToCamelCases(capitalize(file).replace(/\./g, '_'));
  const { imports, source } = genSource(<string>src, { noComments: true, moduleName, format, input: wp.resourcePath });
  const { outputText } = transpileModule([source, exportFormat(format, moduleName)].join('\n'), {
    compilerOptions: { target: 1, module: 5, removeComments: true }
  });
  wp.callback(null, optimize([...imports, outputText].join('\n')), map, meta);
}

function rollupPlugin(_options: Object = {}) {
  return {
    name: 'rollup-plugin-trebor',
    transform(code: string, id: string) {
      const ext = extname(id);
      const file = basename(id, ext);
      const moduleName = kebabToCamelCases(capitalize(file).replace(/\./g, '_'));
      const { imports, source } = genSource(<string>code, { noComments: true, moduleName, format: 'es', input: id });
      const { outputText, sourceMapText } = transpileModule(source, {
        compilerOptions: { sourceMap: true, importHelpers: true, target: 1, module: 5, removeComments: true }
      });

      return {
        code: [...imports, outputText].join('\n'),
        map: sourceMapText
      };
    }
  };
}

function cli(options: CompilerOptions) {
  const info = statSync(options.input);
  if (info.isFile()) {
    compileFile(options);
  } else if (info.isDirectory()) {
    glob(`${options.input}/**/*.html`, (err, files) => {
      if (err) {
        throw err;
      }
      files.forEach(file => {
        compileFile({ ...options, ...{ input: file } });
      });
    });
  }
}

export = function (code: string | CompilerOptions, map, meta) {
  if (this && this.webpack) {
    webpackLoader(this, <string>code, map, meta);
  } else if ((<CompilerOptions>code).input) {
    cli(<CompilerOptions>code);
  } else {
    return rollupPlugin(code);
  }
};