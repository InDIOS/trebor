#!/usr/bin/env node
const yargs = require('yargs');
const gnt = require('../build');
const { resolve } = require('path');

const options = yargs.options({
	input: {
		alias: 'i',
		type: 'string',
		demandOption: true,
		describe: 'Path to the input file.'
	},
	output: {
		alias: 'o',
		type: 'string',
		describe: 'Path to the output file.'
	},
	format: {
		alias: 'f',
		type: 'string',
		choices: ['es', 'iif', 'umd', 'amd', 'system'],
		describe: 'Format of the output.'
	},
	minify: {
		alias: 'm',
		type: 'boolean',
		describe: 'Minify the output.'
	}
}).version('0.0.1').argv;

const cwd = process.cwd();

gnt({
	input: resolve(cwd, options.input),
	out: options.output ? resolve(cwd, options.output) : undefined,
	format: options.format,
	minify: options.minify
});