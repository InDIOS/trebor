const path = require('path');
const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');

const config = {
  mode: 'production',
  context: __dirname,
  entry: './src/main',
  output: {
    filename: 'main.js',
    libraryTarget: 'umd',
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    rules: [
      {
        test: /\.html$/,
        use: {
          loader: path.resolve(__dirname, '../../loader.js'),
          options: {
            // options here...
          }
        }
      }
    ]
  },
  resolve: {
    alias: {
      'trebor/tools': path.resolve(__dirname, '../../tools/index.js'),
    },
  },
  plugins: [
    new webpack.optimize.ModuleConcatenationPlugin()
  ],
  optimization: {
    usedExports: true,
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
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
        }
      })
    ]
  }
};

module.exports = config;
