import parser = require('../../lib/CSSParse');
import {
	Rule, Declaration, Charset, Document,
	FontFace, Namespace, KeyFrames, KeyFrame,
	Media, Import, Page, Supports, Stylesheet
} from 'css';

export default function parseCSS(cssData) {
	try {
		let parsed = parser(cssData);
		return cssRules(parsed);
	} catch (err) {
		console.log('Error during parsing css data:', err.message, err.stack);
	}
}

function declarationNodes(props: Object, declarations: Declaration[]) {
	for (let j = 0; j < declarations.length; j++) {
		let declaration = declarations[j];
		if (declaration.type === 'declaration') {
			props[declaration.property] = declaration.value;
		}
	}
}

function ruleNode(node: Rule | FontFace | Page) {
	let body: { [key: string]: string } = {};
	declarationNodes(body, node.declarations);
	let selector = node.type === 'rule' ? (<Rule>node).selectors.join(', ') : `@${node.type}`;
	return { selector, body };
}

function keyframesNode(node: KeyFrames) {
	let frames = {};
	for (let i = 0; i < node.keyframes.length; i++) {
		let rule = <KeyFrame>node.keyframes[i];
		if (rule.type === 'keyframe') {
			let frame = {};
			declarationNodes(frame, rule.declarations);
			frames[rule.values.join(', ')] = frame;
		}
	}
	const body = { name: node.name, frames };
	return { selector: node.type, body };
}

function unNestedAtRuleNodes(node: Charset | Import | Namespace) {
	return { selector: `@${node.type}`, body: node[node.type] };
}

function nestedAtRuleNode(node: Document | Media | Supports) {
	let body = {};
	for (let i = 0; i < node.rules.length; i++) {
		const rule = node.rules[i];
		let parts = { selector: '', body: {} };
		switch (rule.type) {
			case 'import':
			case 'charset':
			case 'namesapce': {
				parts = unNestedAtRuleNodes(rule);
				break;
			}
			case 'rule':
			case 'page':
			case 'fontface': {
				parts = ruleNode(rule);
				break;
			}
			case 'keyframes': {
				parts = keyframesNode(rule);
				break;
			}
			default:
				parts = nestedAtRuleNode(rule);
				break;
		}
		body[parts.selector] = parts.body;
	}
	return { selector: `@${node.type}${node[node.type] ? ` ${node[node.type]}` : ''}`, body };
}

function cssRules(ast: Stylesheet) {
	let json = {};
	if (ast && ast.type === 'stylesheet' && ast.stylesheet && ast.stylesheet.rules) {
		for (let j = 0; j < ast.stylesheet.rules.length; j++) {
			let rule = ast.stylesheet.rules[j];
			let parts = { selector: '', body: {} };
			switch (rule.type) {
				case 'import':
				case 'charset':
				case 'namesapce': {
					parts = unNestedAtRuleNodes(rule);
					break;
				}
				case 'rule':
				case 'page':
				case 'fontface': {
					parts = ruleNode(rule);
					break;
				}
				case 'keyframes': {
					parts = keyframesNode(rule);
					break;
				}
				default:
					parts = nestedAtRuleNode(rule);
					break;
			}
			json[parts.selector] = { ...(json[parts.selector] || {}),...parts.body};
		}
	}
	return json;
}
