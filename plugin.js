const { extname, basename } = require('path');
const { transpileModule } = require('typescript');
const { createFilter } = require('rollup-pluginutils');
const { genSource, exportFormat } = require('./build');
const { optimize } = require('./build/utilities/context');
const { kebabToCamelCases, capitalize } = require('./build/utilities/tools');

module.exports = function ({ include, exclude, comments } = {}) {
  const format = 'es';
	const filter = createFilter(include || './**/*.html', exclude);
  return {
    name: 'rollup-plugin-trebor',
    transform(code, id) {
      if (!filter(id)) return;
      const ext = extname(id);
      const file = basename(id, ext);
      const moduleName = kebabToCamelCases(capitalize(file).replace(/\./g, '_'));
      const { imports, source } = genSource(code, {
        noComments: !comments, moduleName, format, input: id
      });
      const src = [source, exportFormat(format, moduleName)].join('\n');
      const { outputText, sourceMapText } = transpileModule(src, {
        compilerOptions: { sourceMap: true, target: 1, module: 5, removeComments: !comments }
      });

      return {
        code: optimize([...imports, outputText].join('\n')),
        map: sourceMapText
      };
    }
  };
};