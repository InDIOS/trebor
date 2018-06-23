import { NodeElement } from './classes';
import { parseFragment, DefaultTreeNode, DefaultTreeElement, DefaultTreeDocumentFragment, DefaultTreeCommentNode, DefaultTreeTextNode } from 'parse5';

export function removeEmptyNodes(nodes: DefaultTreeNode[]) {
  return nodes.filter(node => {
    if ((<DefaultTreeElement>node).tagName) {
      (<DefaultTreeElement>node).childNodes = removeEmptyNodes((<DefaultTreeElement>node).childNodes);
      return true;
    }
    let prop = 'value' in node ? 'value' : 'data';
    return (<DefaultTreeTextNode>node)[prop].length;
  });
}

export function stripWhitespace(nodes: DefaultTreeNode[]) {
  return nodes.map(node => {
    if ((<DefaultTreeElement>node).tagName) {
      (<DefaultTreeElement>node).childNodes = stripWhitespace((<DefaultTreeElement>node).childNodes);
    } else {
      let prop = 'value' in node ? 'value' : 'data';
      let value = node[prop];
      (<DefaultTreeTextNode>node)[prop] = value.trim() ? value : '';
    }
    return node;
  });
}

export function removeComments(nodes: DefaultTreeNode[]) {
  return nodes.map(node => {
    if ((<DefaultTreeElement>node).tagName) {
      (<DefaultTreeElement>node).childNodes = removeComments((<DefaultTreeElement>node).childNodes);
    } else if (node.nodeName === '#comment') {
      (<DefaultTreeCommentNode>node).data = '';
    }
    return node;
  });
}

export function walkNode(root: NodeElement, walk: (el: NodeElement) => void, includeRoot: boolean = false) {
  if (includeRoot) walk(root);
  const nodes = root.content ? root.content.childNodes : root.childNodes;
  nodes.forEach(node => {
    if (node.nodeType === 1) {
      if (!includeRoot) walk(node);
      walkNode(node, walk, includeRoot);
    } else {
      walk(node);
    }
  });
}

function getNodes(html: string, noComments: boolean = false) {
  let ast = <DefaultTreeDocumentFragment>parseFragment(html);
  let nodes = noComments ? removeComments(ast.childNodes) : stripWhitespace(ast.childNodes);
  return removeEmptyNodes(nodes);
}

export function getDoc(html: string, noComments: boolean = false) {
  const childNodes: DefaultTreeNode[] = getNodes(html, noComments);
  return new NodeElement(<DefaultTreeElement>{ nodeName: '#document-fragment', childNodes }, null);
}
