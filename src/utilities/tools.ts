export function capitalize(str: string) {
  return str[0].toUpperCase() + str.slice(1);
}

export function clearText(str: string) {
  return str.replace(/[\r\t\n]/g, ' ').replace(/\s{2,}/g, ' ');
}

export function escapeExp(str: string) {
  return str.replace(/\n/g, '\\n').replace(/\r/g, '\\r').replace(/\t/g, '\\t').replace(/'/g, `\\'`);
}

export function createElement(variable: string, tag: string, isSVG: boolean) {
  return `${variable} = ${isSVG ? '_$svg' : '_$el'}(${tag === 'div' || tag === 'svg' ? '' : `'${tag}'`});`;
}

export function createNode(variable: string, content?: string) {
  return `${variable} = ${variable.split('_')[0] === 'txt' ? '_$text' : '_$comment'}(${content || ''});`;
}

export function getVarName(variables: string[], variable: string) {
  variable = `${variable}_1`;
  if (variables.includes(variable)) {
    let [varName] = variable.split('_');
    let count = variables.filter(varb => varb.split('_')[0] === varName).length;
    varName = `${varName}_${count + 1}`;
    variables.push(varName);
    return varName;
  } else {
    let varName = variables.push(variable);
    return variables[varName - 1];
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

export function toMap(str: string) {
  const map: Record<string, boolean> = str
    .split(',').reduce((map, val) => (map[val.trim()] = 1, map), {});
  return (val: string) => !!map[val];
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
  let pos = 0;
  let variable = '';
  let exps = expression.split(/\s*\|\s*/);
  for (let i = 0; i < exps.length; i++) {
    const exp = exps[i];
    if (exps[i + 1] === '') {
      let after = exps[i + 2];
      variable = `${variable ? variable : exp} || ${after}`;
      i++;
    } else {
      pos = i;
      i = exps.length;
    }
  }
  if (!variable) {
    variable = exps[pos];
  }
  let filters = exps.slice(pos + 1, exps.length);
  return filters.length === 0 ? variable : filters.reduce((prevfilter, filter) => {
    const [filterName, ...args] = filter.split(/\s/);
    const params = args.join(', ');
    return `$filters.${filterName}(${prevfilter ? prevfilter : variable}${params ? `, ${params}` : params})`;
  }, '');
}