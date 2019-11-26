import { snakeToCamel } from './utils';
import { transpileModule } from 'typescript';
import { readFileSync, writeFile } from 'fs';
import { minify, MinifyOptions } from 'terser';
import { program } from './parsers/script/nodes';
import { generate } from './parsers/script/generator';
import { basename, join, resolve, dirname } from 'path';
import compiler, { CompileSourceOptions, CompilerOptions } from './parsers';

export interface CompileFileOptions extends CompileSourceOptions {
  extension?: string;
  compilerOptions: CompilerOptions & {
    outDir?: string;
  };
}

export function parseFile(filePath: string, options?: CompileFileOptions, cb?: (err?: Error) => void) {
  let { compilerOptions: { outDir }, extension } = options;
  const htmlCode = readFileSync(resolve(filePath), 'utf8');

  if (!extension) {
    extension = 'html';
  }

  const fileName = basename(filePath, `.${extension}`);
  options.compilerOptions.moduleName = snakeToCamel(fileName);

  filePath = outDir || join(dirname(filePath), `${fileName}.js`);
  if (!filePath.endsWith('.js')) {
    join(filePath, `${fileName}.js`);
  }
  options.filePath = filePath;
  const jsCode = parseSource(htmlCode, options);

  if (!cb) {
    cb = err => err && console.log(err);
  }

  if (!jsCode.code) {
    cb(jsCode.error);
  } else {
    writeFile(filePath, jsCode.code, 'utf8', cb);
  }
}

export function parseSource(htmlCode: string, options?: CompileSourceOptions) {
  let map = '';
  let code = '';
  let astBody = [];
  let error = null;
  try {
    astBody = compiler(htmlCode, options);
    const terserOptions = getTerserOptions(options.compilerOptions.minify);
    const jsCode = <string>generate(program(astBody, 'module'), { semicolon: true, quotemark: `'` });
    const result = transpileModule(jsCode, {
      moduleName: options.compilerOptions.moduleName,
      compilerOptions: {
        target: 1,
        sourceMap: true,
        importHelpers: false,
        module: getModuleKind(options.compilerOptions.format || 'esm'),
        removeComments: true
      }
    });

    if (options.compilerOptions.optimize) {
      const output = minify(result.outputText, terserOptions);
      code = output.code;
      error = output.error;
      map = <string>output.map;
    } else {
      code = result.outputText;
      map = result.sourceMapText;
    }
  } catch (err) {
    error = err;
  }
  return { code, map, error };
}

function getModuleKind(modType: 'esm' | 'cjs' | 'iif') {
  switch (modType) {
    case 'cjs':
      return 1;
    case 'esm':
      return 99;
    default:
      return 5;
  }
}

function getTerserOptions(minify: boolean) {
  const options: MinifyOptions = {
    mangle: true,
    module: true,
    toplevel: true,
    parse: { ecma: 9 },
    output: { quote_style: 1 },
    compress: { passes: 2, keep_fargs: false }
  };
  if (!minify) {
    options.mangle = false;
    Object.assign(options.compress, {
      inline: false, if_return: false, sequences: false, reduce_vars: false, reduce_funcs: false,
      conditionals: false, join_vars: false
    });
    Object.assign(options.output, { indent_level: 2, beautify: true, braces: true });
  }
  return options;
}
