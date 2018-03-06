declare module "*.html" {
	type AttrTypes = string | number | RegExp | null | boolean;
	interface AttrDefinition {
		required?: boolean;
		type: 'string' | 'number' | 'object' | 'boolean' | 'function' | 'array' | Function;
		default?: AttrTypes | (() => AttrTypes | Object);
	}
	interface DirectiveOptions {
		value: any;
		expression: string;
		modifiers: { [key: string]: boolean }
	}
	interface DirectiveDefinition {
		$init?(inst: Component, options: DirectiveOptions, node: HTMLElement): void;
		$inserted?(inst: Component, options: DirectiveOptions, node: HTMLElement): void;
		$update(inst: Component, options: DirectiveOptions, node: HTMLElement): void;
		$destroy?(inst: Component, options: DirectiveOptions, node: HTMLElement): void
	}
	interface DirectivesOption {
		[key: string]: DirectiveDefinition
	}
	interface ComponentOptions {
		model: { [key: string]: any };
		attrs: string[] | { [key: string]: AttrDefinition };
		filters: { [key: string]: (...args: any[]) => any };
		children: { [key: string]: Component };
		directives: {
			[key: string]: (inst: Component, options: DirectiveOptions, node: HTMLElement) => void | DirectiveDefinition
		};
	}
	interface Component {
		readonly $refs: { [key: string]: HTMLElement[] };
		readonly $slots: { [key: string]: DocumentFragment };
		readonly $filters: { [key: string]: (...args: any[]) => any };
		readonly $options: ComponentOptions;
		readonly $directives: DirectivesOption;
		$create(): void;
		$hydrate?(): void;
		$mount(parent: string | HTMLElement, sibling?: string | HTMLElement): void;
		$update(state: Object, ...args: any[]): void;
		$destroy(): void;
		$set(data: Object): void;
		$on(event: string, handler: (data?: any) => void): { $off(): void };
		$once(event: string, handler: (data?: any) => void): void;
		$fire(event: string, data?: any): void;
		$notify(key: string): void;
		$observe(key: string | string[], handler: () => void): { $unobserve(): void };
		$watch(key: string, handler: (oldValue?: any, newValue?: any) => void): { $unwatch(): void };
		[key: string]: any;
	}
	interface ComponentConstructor {
		new <T extends Component>(attrs?: string[] | { [key: string]: AttrDefinition }): T;
		prototype: Component;
	}
	const component: ComponentConstructor;
	export default component;
}