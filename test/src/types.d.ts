declare var phantom: {
	exit(code?: number): void;
}

interface Component {
	$set(key: string, value: any): void;
	$destroy(): void;
	$mount(parent: HTMLElement, sibling?: HTMLElement | boolean): void;
	[key: string]: any;
}

interface ComponentConstructor {
	new(...args: any[]): Component;
}

declare const Bind: ComponentConstructor;
declare const Html: ComponentConstructor;
declare const Init: ComponentConstructor;
declare const Loop: ComponentConstructor;
declare const Filters: ComponentConstructor;
declare const Condition: ComponentConstructor;
declare const Components: ComponentConstructor;
declare const Interpolation: ComponentConstructor;

declare module 'system' {
	interface System {
		args: string[]
	}

	var system: System;

	export = system;
}

declare module 'webpage' {
	interface Page {
		open(url: string, callback: (status: string) => any): void;
		open(url: string, method: string, callback: (status: string) => any): void;
		open(url: string, method: string, data: any, callback: (status: string) => any): void;
		onConsoleMessage: (msg: string, lineNum?: number, sourceId?: string) => any;
		evaluate<T>(fn: Function, ...args: any[]): T;
	}

	interface WebPage {
		create(): Page
	}

	var webPage: WebPage;

	export = webPage;
}
