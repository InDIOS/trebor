import glob = require('glob');
import { promisify } from 'util';
import { minify } from 'uglify-es';
import { getDoc } from './utilities/html';
import { transpileModule } from 'typescript';
import { basename, extname, dirname, join } from 'path';
import { genTemplate, CompilerOptions } from './generators';
import { readFileSync, statSync, writeFile, existsSync } from 'fs';
import { kebabToCamelCases, capitalize, camelToKebabCase } from './utilities/tools';
const dest = `{
  _$bindUpdate, _$comment, _$setElements, _$emptySlot, _$appendToSlot, _$declareSlots,
  _$updateMultiSelect, _$componentUpdate, _$htmlUpdate, _$tagUpdate, _$bindBooleanAttr,
  _$removeReference, _$addChild, _$textUpdate, _$getValue, _$text, _$conditionalUpdate,
  _$noop, _$toString, _$setReference, _$isType, _$isKey, _$select, _$docFragment, _$append,
  _$removeChild, _$bindGroup, _$emptyElse, _$Ctor, _$bindMultiSelect, _$setAttr, _$removeEl,
  _$assignEl, _$el, _$bindStyle, _$forLoop, _$each, _$insertStyle, _$removeStyle, _$getAttr,
  _$addListener, _$updateListener, _$removeListener, _$bindClasses, _$destroyComponent, _$svg,
}`;
const esDeps = `import ${dest} from 'trebor-tools';`;
const cjsDeps = `const ${dest} = require('trebor-tools');`;
const tools = readFileSync(join(__dirname, '../tools/index.js'), 'utf8');

export function genSource(html: string, opts: CompilerOptions) {
  const body = getDoc(html, !!opts.minify);
  const { moduleName } = opts;
  const { imports, template, extras, options } = genTemplate(body, '_$state', opts);
  if (checkModule(opts.format)) {
    imports.unshift(opts.format === 'es' ? esDeps : cjsDeps);
  }
  const source = [template, extras, `const ${moduleName} = _$Ctor(_$tpl${moduleName}, ${options});`]
    .filter(c => !!c.length).join('\n');
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
  const fileName = `${file}${options.minify ? '.min' : ''}.js`;
  if (!options.out) {
    options.out = dir;
  }
  const { compilerOptions, uglifyOptions } = getOptions(options);
  const { imports, source } = genSource(html, options);
  const utilities = (checkModule(options.format) ? [...imports] : [...imports, tools]).join('\n');
  const code = [utilities, source, exportFormat(options.format, moduleName)].join('\n');

  let { outputText } = transpileModule(code, { compilerOptions, moduleName: camelToKebabCase(moduleName) });
  outputText = minify(outputText, uglifyOptions).code;

  if (options.format === 'umd') {
    outputText = umdTpl(moduleName, outputText);
  } else if (options.format === 'iif') {
    if (options.minify) {
      uglifyOptions.compress = uglifyOptions.compress || {};
    }
    outputText = iifTpl(moduleName, outputText);
  }
  
  return [join(options.out, fileName), minify(outputText, uglifyOptions).code];
}

export function exportFormat(format: string, moduleName: string) {
  return `${format === 'es' ? 'export default' : 'export ='} ${moduleName};`;
}

function getOptions(options: CompilerOptions) {
  let uglifyOptions: { [key: string]: any } = {
    compress: { toplevel: true }, output: { beautify: true }
  };
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
  } else if (options.format === 'cjs') {
    compilerOptions.module = 1;
  } else if (options.format === 'system') {
    compilerOptions.module = 4;
  }
  uglifyOptions.mangle = false;
  if (options.minify) {
    uglifyOptions.output.beautify = false;
    uglifyOptions.mangle = { toplevel: true };
  } else {
    uglifyOptions.output.indent_level = 2;
    uglifyOptions.output.bracketize = true;

    uglifyOptions.compress.inline = false;
    uglifyOptions.compress.if_return = false;
    uglifyOptions.compress.join_vars = false;
    uglifyOptions.compress.sequences = false;
    uglifyOptions.compress.reduce_vars = false;
    uglifyOptions.compress.reduce_funcs = false;
    uglifyOptions.compress.collapse_vars = false;
  }
  return { uglifyOptions, compilerOptions };
}

function umdTpl(moduleName: string, body: string) {
  return `!function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define('${camelToKebabCase(moduleName)}', factory) :
    (global.${moduleName} = factory());
  }(this, function () {
    ${body.replace('module.exports =', 'return')}
  });`;
}

function iifTpl(moduleName: string, body: string) {
  return `!function(glob) { 
    ${body.replace('module.exports =', `glob.${moduleName} =`)} 
  }(this);`;
}

function checkExistToolsModule() {
  return existsSync(join(__dirname, '..', '..', 'trebor-tools', 'package.json'));
}

function checkModule(format: string) {
  return /es|cjs/.test(format);
}

export default function cli(options: CompilerOptions) {
  const info = statSync(options.input);
  const time = start => `Compilation finished in ${Date.now() - start}ms`;
  if (options.format && checkModule(options.format) && !checkExistToolsModule()) {
    console.log('You must install `trebor-tools` or set it as dependency if you want use the components.');
  }
  if (info.isFile()) {
    let start = Date.now();
    let [path, code] = compileFile(options);
    writeFile(path, code, 'utf8', err => {
      if (err) throw err;
      console.log(time(start));
    });
  } else if (info.isDirectory()) {
    glob(`${options.input}/**/*.html`, async (err, files) => {
      if (err) throw err;
      let start = Date.now();
      let codes = files.filter(f => !f.includes('node_modules')).map(file => {
        let [path, code] = compileFile({ ...options, ...{ input: file } });
        return promisify(writeFile)(path, code, 'utf8');
      });
      try {
        await Promise.all(codes);
        console.log(time(start));
      } catch (error) {
        throw error;
      }
    });
  }
}