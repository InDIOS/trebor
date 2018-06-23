export interface CompilerOptions {
	out?: string;
	input?: string;
	minify?: boolean;
	moduleName?: string;
	noComments?: boolean;
	format?: 'es' | 'iif' | 'umd' | 'amd' | 'system';
}