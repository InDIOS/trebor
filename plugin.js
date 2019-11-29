const { parseSource } = require('./build');
const { extname, basename } = require('path');
const { createFilter } = require('rollup-pluginutils');
const { snakeToCamel, capitalize } = require('./build/utils');

module.exports = function ({ include, exclude, comments = false, format = 'esm', directives = [] } = {}) {
  format = /^(esm|cjs)$/i.test(format) ? format : 'esm';
  const filter = createFilter(include || './**/*.html', exclude);
  return {
    name: 'rollup-plugin-trebor',
    transform(html, filePath) {
      if (!filter(filePath)) return;
      const ext = extname(filePath);
      const file = basename(filePath, ext);
      const moduleName = capitalize(snakeToCamel(file));

      const { code, map } = parseSource(html, {
        filePath: this.resourcePath,
        compilerOptions: { comments, format, minify: false, moduleName },
        directives, optimize: false
      });

      return { code, map };
    }
  };
};