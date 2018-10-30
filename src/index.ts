import glob = require('glob');
import { minify } from 'uglify-js';
import { getDoc } from './utilities/html';
import { transpileModule } from 'typescript';
import { optimize } from './utilities/context';
import { minify as minifyES } from 'uglify-es';
import { basename, extname, dirname, join } from 'path';
import { genTemplate, CompilerOptions } from './generators';
import { readFileSync, statSync, writeFile, existsSync } from 'fs';
import { kebabToCamelCases, capitalize, camelToKebabCase } from './utilities/tools';

const dest = `{
  _$bindUpdate, _$comment, _$setElements, _$emptySlot,
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
	if (opts.format === 'es') {
		imports.unshift(esDeps);
	}
	const source = [template, extras, `const ${moduleName} = _$Ctor('${moduleName}', _$tpl${moduleName}, ${options});`]
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
	let { outputText } = transpileModule(code, { compilerOptions, moduleName: camelToKebabCase(moduleName) });

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
	return [join(options.out, fileName), options.minify ? <string>min(outputText, uglifyOptions).code : outputText];
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
	} else if (options.format === 'cjs') {
		compilerOptions.module = 1;
	} else if (options.format === 'system') {
		compilerOptions.module = 4;
	}
	if (options.minify) {
		uglifyOptions.mangle = {};
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

export default function cli(options: CompilerOptions) {
	const info = statSync(options.input);
	if (options.format && /es|cjs/.test(options.format) && !checkExistToolsModule()) {
		console.log('You must install `trebor-tools` or set it as dependency if you want use the components.');
	}
	if (info.isFile()) {
		let [path, code] = compileFile(options);
		writeFile(path, code, 'utf8', err => err && console.log(err));
	} else if (info.isDirectory()) {
		glob(`${options.input}/**/*.html`, (err, files) => {
			if (err) throw err;
			let codes = files.filter(f => !f.includes('node_modules')).map(file => {
				let [path, code] = compileFile({ ...options, ...{ input: file } });
				return new Promise<void>((res, rej) => {
					writeFile(path, code, 'utf8', err => err ? rej(err) : res());
				});
			});
			Promise.all(codes);
		});
	}
}