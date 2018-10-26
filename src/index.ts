import glob = require('glob');
import { minify } from 'uglify-js';
import { getDoc } from './utilities/html';
import { transpileModule } from 'typescript';
import { optimize } from './utilities/context';
import { minify as minifyES } from 'uglify-es';
import { readFileSync, statSync, writeFile } from 'fs';
import { basename, extname, dirname, join } from 'path';
import { genTemplate, CompilerOptions } from './generators';
import { kebabToCamelCases, capitalize, camelToKebabCase } from './utilities/tools';

const dest = `{ _$CompCtr, _$, _$d, _$a, _$add, _$remove, _$as, _$r, _$ce, _$cse, _$ct,
 _$bu, _$tu, _$nu, _$rr, _$hu, _$pu, _$cm, _$sa, _$ga, _$al, _$ul, _$rl, _$bc, _$bs, _$f,
 _$e, _$is, _$ds, _$toStr, _$bindMultiSelect, _$gv, _$setRef, _$noop, _$isType, _$isKey,
 _$bindGroup, _$cu, _$bba, _$emptyElse, _$extends, _$updateMultiSelect }`;
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

export default function cli(options: CompilerOptions) {
	const info = statSync(options.input);
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