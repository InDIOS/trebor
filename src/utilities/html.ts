import { parse } from 'himalaya';
import { NodeElement } from './classes';
import { Node, Element, Text } from '../types.d';

function removeEmptyNodes(nodes: Node[]) {
	return nodes.filter(node => {
		if (node.type === 'element') {
			(<Element>node).children = removeEmptyNodes((<Element>node).children);
			return true;
		}
		return (<Text>node).content.length;
	});
}

function stripWhitespace(nodes: Node[]) {
	return nodes.map(node => {
		if (node.type === 'element') {
			(<Element>node).children = stripWhitespace((<Element>node).children);
		} else {
			(<Text>node).content = (<Text>node).content.trim() ? (<Text>node).content : '';
		}
		return node;
	});
}

function removeWhitespace(nodes: Node[]) {
	return removeEmptyNodes(stripWhitespace(nodes));
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

function getNodes(html: string) {
	return removeWhitespace(parse(html));
}

export function getDoc(html: string) {
	const children: Node[] = getNodes(html);
	return new NodeElement(<Element>{ type: 'element', tagName: 'body', children, attributes: [] }, null);
}
