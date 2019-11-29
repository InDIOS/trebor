type ObjectMap<T> = Record<string, T>;
type AttrTypes = string | number | RegExp | null | boolean;
type PluginFn = (this: Component, ctor: typeof Component, pluginOptions?: ObjectMap<any>) => void;

interface AttrDefinition {
  required?: boolean;
  type: string | Function;
  validator?(value: any): boolean;
  default?: AttrTypes | (() => AttrTypes | Object);
}

interface ComponentOptions {
  $children?: ObjectMap<Component>;
  $filters?: ObjectMap<(...args: any[]) => any>;
  $attributes?: string[] | ObjectMap<AttrDefinition>;
}

declare class BaseComponent {
  $parent: Component;
  $parentEl: HTMLElement;
  $siblingEl: HTMLElement;
  readonly $refs: ObjectMap<HTMLElement | HTMLElement[]>;
  readonly $slots: ObjectMap<DocumentFragment>;
  readonly $filters: ObjectMap<(...args: any[]) => any>;
  readonly $options: ComponentOptions;
  readonly $children: Component[];

  $get<T extends any>(path: string): T;
  $set<T extends any>(path: string, value: T): void;
  $on(event: string, handler: (data?: any) => void): void;
  $off(event: string, handler: (data?: any) => void): void;
  $once(event: string, handler: (data?: any) => void): void;
  $fire(event: string, data?: any): void;
  $notify(key: string): void;
  $observe(key: string | string[], handler: () => void): { $unobserve(): void };
  $watch(key: string, handler: (oldValue?: any, newValue?: any) => void): { $unwatch(): void };
}

declare class Component extends BaseComponent {
  static $children?: ObjectMap<Component>;
  static $filters?: ObjectMap<(...args: any[]) => any>;
  static $attributes?: string[] | ObjectMap<AttrDefinition>;
  static $plugin(fn: PluginFn, options?: ObjectMap<any>): void;
  
  constructor(attrs?: ObjectMap<any>, parent?: Component);

  willCreate?(this: Component): void;
  willMount?(this: Component): void;
  willUpdate?(this: Component): void;
  willUnmount?(this: Component): void;
  willDestroy?(this: Component): void;

  didCreate?(this: Component): void;
  didMount?(this: Component): void;
  didUpdate?(this: Component): void;
  didUnmount?(this: Component): void;
  didDestroy?(this: Component): void;

  $create(): void;
  $mount(parent: string | Element, sibling?: string | boolean | Element): void;
  $update(this: Component, ...args: any[]): void;
  $unmount(): void;
  $destroy(): void;

  [key: string]: any;
}
