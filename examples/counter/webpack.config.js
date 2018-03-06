const { resolve } = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { optimize: { ModuleConcatenationPlugin } } = require('webpack');

module.exports = {
	context: resolve(__dirname, 'src'),
	entry: './main.ts',
	output: {
		filename: 'counter.js',
		path: resolve(__dirname, 'dist/js')
	},
	module: {
		rules: [
			{
				test: /\.html$/,
				use: 'trebor',
				exclude: /index\.html/
			},
			{
				test: /\.ts$/,
				use: 'ts-loader',
				exclude: /node_modules/
			}
		],
	},
	resolve: {
		alias: {
			'trebor/tools': resolve(__dirname, '../../tools')
		}
	},
	resolveLoader: {
		alias: {
			'trebor': resolve(__dirname, '../../')
		}
	},
	plugins: [
		new ModuleConcatenationPlugin(),
		new HtmlWebpackPlugin({
			filename: resolve(__dirname, 'dist/index.html'),
			template: './index.html'
		})
	]
};