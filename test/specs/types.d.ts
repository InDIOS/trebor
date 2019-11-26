declare type MountParam = string | HTMLElement;

declare interface Component {
	$set(key: string, value: any): void;
	$destroy(): void;
  $mount(parent: MountParam, sibling?: MountParam | boolean): void;
	[key: string]: any;
}

declare interface ComponentConstructor {
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
