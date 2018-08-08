const { resolve } = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { optimize: { ModuleConcatenationPlugin } } = require('webpack');

module.exports = {
	context: resolve(__dirname, 'src'),
	entry: './main.ts',
	output: {
		filename: 'animation.js',
		path: resolve(__dirname, 'dist/js')
	},
	mode: 'development',
	devtool: 'eval-source-map',
	module: {
		rules: [
			{
				test: /\.html$/,
        use: 'trebor-loader',
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
			'trebor/tools': resolve(__dirname, '../../tools'),
			'trebor-transitions': resolve(__dirname, '../../../trebor-transitions')
		}
	},
	resolveLoader: {
		alias: {
			'trebor-loader': resolve(__dirname, '../../loader.js')
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