export function capitalize(str: string) {
	return str[0].toUpperCase() + str.slice(1);
}

export function escapeExp(str: string) {
	return str.replace(/\n/g, '\\n').replace(/\r/g, '\\r').replace(/\t/g, '\\t').replace(/'/g, `\\'`);
}

export function createElement(variable: string, tag: string) {
	return `${variable} = _$ce(${tag !== 'div' ? `'${tag}'` : ''});`;
}

export function createNode(variable: string, content?: string) {
	return `${variable} = ${variable.split('_')[0] === 'txt' ? '_$ct' : '_$cm'}(${content || ''});`;
}

export function getParent(variables: string[], tag: string) {
	let variable = '';
	const tags = variables.filter(variable => variable.includes(tag));
	if (tags.length) {
		variable = tags[tags.length - 1];
	}
	return variable;
}

export function getVarName(variables: string[], variable: string) {
	if (variables.includes(variable)) {
		let [varName] = variable.split('_');
		let count = variables.filter(varb => varb.split('_')[0] === varName).length;
		varName = `${varName}${count ? `_${count}` : ''}`;
		variables.push(varName);
		return varName;
	} else {
		variables.push(variable);
		return variable;
	}
}

export function kebabToCamelCases(str: string) {
	return str.replace(/-([a-z0-9_])/g, (_, w) => w.toUpperCase());
}

export function camelToKebabCase(str: string) {
	let kebab = str.replace(/([A-Z])/g, w => `-${w.toLowerCase()}`);
	if (kebab.charAt(0) === '-') kebab = kebab.substring(1);
	return kebab;
}

function pad(hash: string, len: number) {
	while (hash.length < len) {
		hash = `0${hash}`;
	}
	return hash;
}

function fold(hash: number, text: string) {
	let i, chr, len;
	if (text.length === 0) {
		return hash;
	}
	for (i = 0, len = text.length; i < len; i++) {
		chr = text.charCodeAt(i);
		hash = ((hash << 5) - hash) + chr;
		hash |= 0;
	}
	return hash < 0 ? hash * -2 : hash;
}

export function hash(value: string) {
	let preHash = fold(0, value);
	if (value === null) {
		preHash = fold(preHash, 'null');
	} else if (value === undefined) {
		preHash = fold(preHash, 'undefined');
	} else {
		preHash = fold(preHash, value.toString());
	}
	return pad(preHash.toString(16), 8);
}

export function filterParser(expression: string) {
	const [variable, ...filters] = expression.split(/\s*\|\s*/);
	return filters.length === 0 ? variable : filters.reduce((prevfilter, filter) => {
		const [filterName, ...args] = filter.split(/\s/);
		const params = args.length ? `, ${args.join(', ')}` : '';
		return `$filters.${filterName}(${prevfilter ? prevfilter : variable}${params})`;
	}, '');
}