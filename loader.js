const { extname, basename } = require('path');
const { getOptions } = require('loader-utils');
const { transpileModule } = require('typescript');
const { genSource, exportFormat } = require('./build');
const { optimize } = require('./build/utilities/context');
const { kebabToCamelCases, capitalize } = require('./build/utilities/tools');

module.exports = function (code, map, meta) {
  const format = 'es';
  const ext = extname(this.resourcePath);
  const file = basename(this.resourcePath, ext);
  const moduleName = kebabToCamelCases(capitalize(file).replace(/\./g, '_'));
  const { comments } = getOptions(this) || {};
  const { imports, source } = genSource(code, {
    noComments: !comments, moduleName, format, input: this.resourcePath
  });
  const src = [source, exportFormat(format, moduleName)].join('\n');
  const { outputText, sourceMapText } = transpileModule(src, {
    compilerOptions: { target: 1, module: 5, removeComments: !comments }
  });

  this.callback(null, optimize([...imports, outputText].join('\n')), sourceMapText, meta);
};