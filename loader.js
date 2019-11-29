const { parseSource } = require('./build');
const { extname, basename } = require('path');
const { getOptions } = require('loader-utils');
const { snakeToCamel, capitalize } = require('./build/utils');

module.exports = function (html, sourceMap, meta) {
  let { comments = false, format = 'esm', directives = [] } = getOptions(this) || {};
  const ext = extname(this.resourcePath);
  const moduleName = capitalize(snakeToCamel(basename(this.resourcePath, ext)));
  const { code, map, error } = parseSource(html, {
    filePath: this.resourcePath,
    compilerOptions: {
      comments, format: /^(esm|cjs)$/i.test(format) ? format : 'esm',
      minify: false, moduleName, optimize: false
    },
    directives
  });

  if (error) {
    throw error;
  }

  this.callback(null, code, map, meta);
};