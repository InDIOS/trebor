import { parse } from 'himalaya';
import { NodeElement } from './classes';
import { Node, Element, Text, Comment } from '../types.d';

export function removeEmptyNodes(nodes: Node[]) {
	return nodes.filter(node => {
		if (node.type === 'element') {
			(<Element>node).children = removeEmptyNodes((<Element>node).children);
			return true;
		}
		return (<Text>node).content.length;
	});
}

export function stripWhitespace(nodes: Node[]) {
	return nodes.map(node => {
		if (node.type === 'element') {
			(<Element>node).children = stripWhitespace((<Element>node).children);
		} else {
			(<Text>node).content = (<Text>node).content.trim() ? (<Text>node).content : '';
		}
		return node;
	});
}

export function removeComments(nodes:Node[]) {
	return nodes.map(node => { 
		if (node.type === 'element') {
			(<Element>node).children = removeComments((<Element>node).children);
		} else if (node.type === 'comment') {
			(<Comment>node).content = '';
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
	let ast = parse(html);
	ast = removeEmptyNodes(stripWhitespace(ast));
	if (noComments) {
		ast = removeEmptyNodes(removeComments(ast));
	}
	return ast;
}

export function getDoc(html: string, noComments: boolean = false) {
	const children: Node[] = getNodes(html, noComments);
	return new NodeElement(<Element>{ type: 'element', tagName: 'body', children, attributes: [] }, null);
}
