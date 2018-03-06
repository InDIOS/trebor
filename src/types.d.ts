export interface Node {
	type: 'element' | 'comment' | 'text';
}

export interface Element extends Node {
	type: 'element';
	tagName: string;
	children: Node[];
	attributes: Attribute[];
}

export interface Attribute {
	key: string;
	value?: string;
}

export interface Text extends Node {
	type: 'text';
	content: string;
}

export interface CompilerOptions {
	out?: string;
	input?: string;
	moduleName?: string;
	noComments?: boolean;
	minify?: { [key: string]: any };
	format?: 'es' | 'iif' | 'umd' | 'amd' | 'system';
}