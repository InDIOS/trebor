const path = require('path');
const trebor = require('../../plugin');
const alias = require('@rollup/plugin-alias');
const { terser } = require('rollup-plugin-terser');

module.exports = {
  input: path.join(__dirname, 'src/main.js'),
  output: {
    file: path.join(__dirname, 'dist/main.js'),
    format: 'iife'
  },
  plugins: [trebor(), alias({
    entries: {
      'trebor/tools': path.resolve(__dirname, '../../tools/index.js')
    }
  }), terser({
    mangle: false,
    module: true,
    toplevel: true,
    parse: { ecma: 9 },
    output: {
      quote_style: 1, indent_level: 2, beautify: true, braces: true
    },
    compress: {
      passes: 2, keep_fargs: false, inline: false, if_return: false, sequences: false,
      reduce_vars: false, reduce_funcs: false, conditionals: false, join_vars: false
    }
  })]
};