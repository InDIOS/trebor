#!/usr/bin/env node

const glob = require('glob');
const { resolve } = require('path');
const program = require('commander');
const { parseFile } = require('../build');

program
  // TO-DO: Put here parsers (css,html,js) and directives
  .option('-i, --input <fileOrDirPath>', 'Path to input file or directory', dir => resolve(dir))
  .option('-o, --output [fileOrDirPath]', 'Path to output file or directory (default: input directory)')
  .option('-f, --format <OutputFormat>', 'Specify output format: esm, cjs o iif (default: iif)', val => {
    return /^(esm|cjs|iif)$/i.test(val) ? val : '';
  })
  .option('-c, --comments', 'Include comments in parsed result file')
  .option('-m, --minify', 'Optimize output with minification')
  .option('-d, --directives [value]', 'A set of path to directive files', (dir, directives) => {
    directives.push(require(resolve(dir)));
    return directives;
  }, [])
  .version('1.0.0', '-v, --version')
  .parse(process.argv);

const options = program.opts();

if (!options.input) {
  console.log('');
  console.error('[Error]: An input file must be provided in argument -i o --input');
  console.log('');
  process.exit(1);
}

if (options.format === '') {
  console.log('');
  console.warn('[Warn]: An incorrect output format was provided');
  console.warn('[Warn]: Format option will fallback to `iif` module');
}

if (options.input) {
  options.input = resolve(options.input);
}

if (options.output) {
  options.output = resolve(options.output);
}

options.format = options.format || 'iif';
options.minify = options.minify || false;
options.comments = options.comments || false;

const compilerOptions = {
  minify: options.minify,
  format: options.format,
  comments: options.comments,
  outDir: options.output,
  optimize: true
};

const start = new Date();

glob(options.input, { nonull: false }, (err, files) => {
  if (err) {
    console.log(err);
    process.exit(1);
  } else {
    Promise.all(files.map(file => {
      return new Promise((resolve, reject) => {
        parseFile(file, { compilerOptions, directives: options.directives }, err => {
          if (err) {
            err.message = `${err.message} on file '${file}'`;
            reject(err);
          } else {
            resolve();
          }
        });
      });
    })).then(wrotes => {
      if (wrotes.length === files.length) {
        const time = ((new Date()) - start) / 1000;
        console.log(`[Info]: All work done successfully in ${time.toFixed(2)}s`);
      }
    }).catch(err => {
      console.log(err);
      console.error('\n[Error]: Something was wrong');
      process.exit(1);
    });
  }
});