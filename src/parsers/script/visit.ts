import { BaseNode } from './estree';

interface Node extends BaseNode {
  parent?: Node;
}

interface Path {
  __node: Node;
  parent: Node;
  property: string;
  parentPath: Path;
  __skippedKeys: string[];
  skip(...keys: string[]): void;
  visit(...keys: string[]): void;
  findParent(cb: (parent: Node) => boolean): Node;
  replace(property: string, newNode: Node, noVisit?: boolean): void;
}

type VisitorsObject = {
  enter?(this: Path, node: Node): void;
  leave?(this: Path, node: Node): void;
} & Record<string, (this: Path, node: Node) => void>;

const keysCache: Map<string, string[]> = new Map();

function createObj(obj = {}, proto = null) {
  const p = proto ? Object.create(null) : null;
  proto && Object.assign(p, proto);
  const o = Object.create(p);
  Object.assign(o, obj);
  return o;
}

function isObject(obj: any): obj is Object {
  return typeof obj === 'object';
}

function isArray(array: any): array is any[] {
  return Array.isArray(array);
}

function isNode(obj: any) {
  return obj != null && isObject(obj) && obj.type && typeof obj.type === 'string';
}

function nodeKeys(node: Node) {
  if (!keysCache.has(node.type)) {
    const keys: string[] = [];
    for (const key in node) {
      if (key !== 'parent' && (isArray(node[key]) || isNode(node[key]) || node[key] === null)) {
        keys.push(key);
      }
    }
    keysCache.set(node.type, keys);
  }
  return keysCache.get(node.type);
}

function createPath(visitors: VisitorsObject, node = null, parent = null, property = null, parentPath = null): Path {
  return createObj({ parent, property, parentPath, __node: node, __skippedKeys: null }, {
    ...visitors,
    skip(...keys: string[]) {
      this.__skippedKeys = this.__skippedKeys ? [...this.__skippedKeys, ...keys] : keys;
    },
    visit(...keys: string[]) {
      keys = keys.length ? keys : nodeKeys(this.__node);
      for (let i = 0; i < keys.length; i++) {
        const property = keys[i];
        const node = this.__node[property];
        if (isArray(node)) {
          node.forEach(n => {
            const childPath = createPath(visitors, n, this.__node, property, this);
            visit(n, childPath, visitors);
          });
        } else {
          const childPath = createPath(visitors, node, this.__node, property, this);
          visit(node, childPath, visitors);
        }
      }
      this.skip();
    },
    replace(property: string, newNode: Node, noVisit = false) {
      const node = this.__node;
      const prop = node[property];
      if (prop !== undefined) {
        node[property] = newNode;
      }
      if (noVisit) {
        this.skip(property);
      }
    },
    findParent(cb: (parent: Node) => boolean) {
      if (this.parentPath == null) {
        return null;
      }
      let { parentPath: parent } = this;
      while (parent) {
        if (cb(parent.parent)) {
          return parent.parent;
        }
        parent = parent.parentPath;
      }
      return null;
    }
  });
}

function skipper(node: Node, path: Path) {
  return (handler: Function) => {
    handler.call(path, node);
    return isArray(path.__skippedKeys) && !path.__skippedKeys.length;
  };
}

function visit(node: Node, path: Path, visitors: VisitorsObject = {}) {
  if (!isNode(node)) {
    throw new Error(`'node' must be a valid AST node`);
  }

  const keys = nodeKeys(node);
  const skip = skipper(node, path);

  if (visitors.enter && skip(visitors.enter)) {
    return;
  }

  if (visitors[node.type] && skip(visitors[node.type])) {
    return;
  }


  for (let i = 0, length = keys.length; i < length; i++) {
    const key = keys[i];
    const value: Node | Node[] = node[key];

    if (value == null || ~(path.__skippedKeys || []).indexOf(key)) {
      continue;
    }

    const currPath = createPath(visitors, value, node, key, path);

    if (isArray(value)) {
      for (let j = 0; j < value.length; j += 1) {
        if (isNode(value[j])) {
          currPath.__node = value[j];
          visit(value[j], currPath, visitors);
        }
      }
    } else {
      visit(value, currPath, visitors);
    }
  }

  if (visitors.leave) {
    visitors.leave.call(path, node);
  }
}

export default function visitor(ast: Node, visitors: VisitorsObject) {
  visit(ast, createPath(visitors, ast), createObj(visitors));
}
