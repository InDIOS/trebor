import { AllHtmlEntities } from 'html-entities';
import { Segment, Segments } from '../parsers/script/segments';
import { Identifier, ExpressionStatement, AssignmentExpression } from '../parsers/script/estree';
import { isAssignmentExpression, isCallExpression, isExpressionStatement } from '../parsers/script/nodes';

const entities = new AllHtmlEntities();

function replaceVar(array: Segment, oldVar: string, newVar: string) {
  const assign = <ExpressionStatement>array.find(stmt => {
    if (isExpressionStatement(stmt)) {
      const exp = stmt.expression;
      return isAssignmentExpression(exp) && (<Identifier>exp.left).name === oldVar &&
        isCallExpression(exp.right) && (<Identifier>exp.right.callee).name === '_$child';
    }
    return false;
  });
  if (assign) {
    (<Identifier>(<AssignmentExpression>assign.expression).left).name = newVar;
  }
}

function replaceItem<T extends any>(array: T[], item: T, replacer?: T) {
  const index = array.indexOf(item);
  if (~index) {
    if (replacer) {
      array.splice(index, 1, replacer);
    } else {
      array.splice(index, 1);
    }
  }
}

function capitalize(str: string, from?: number) {
  str = typeof from === 'number' ? str.slice(from) : str;
  return str[0].toUpperCase() + str.slice(1);
}

function snakeToCamel(str: string) {
  return str.replace(/([-_]\w)/g, w => w[1].toUpperCase());
}

function camelToSnake(str: string) {
  return str.replace(/[\w]([A-Z])/g, m => `${m[0]}_${m[1]}`).toLowerCase();
}

function each<T extends any>(array: T[], cb: (item: T, i: number, array: T[]) => void) {
  if (!cb) {
    return;
  }
  let { length } = array;
  for (let i = 0; i < length; i++) {
    cb(array[i], i, array);
    if (length !== array.length) {
      i--;
      length = array.length;
    }
  }
}

function escapeCharacters(str: string) {
  return str.replace(/(\t|\r|\n|')/g, match => {
    switch (match) {
      case '\n': return '\\n';
      case '\r': return '\\r';
      case '\t': return '\\t';
      case '\'': return `\\'`;
      default: break;
    }
  });
}

function toValidate(str: string | string[]) {
  const list = Array.isArray(str) ? str : str.split(',');
  return (val: string) => list.includes(val);
}

function filterPlaceholders(list: string[]) {
  return list.filter(g => !['_$v', '_$i'].includes(g));
}

function pad(hash: string, len: number) {
  while (hash.length < len) {
    hash = `0${hash}`;
  }
  return hash;
}

function fold(hash: number, text: string) {
  let i: number, chr: number, len: number;
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

function hash(value: string) {
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

function filters(expression: string, segmts: Segments) {
  let pos = 0;
  let stmt = '';
  const exps = expression.split(/\s*\|\s*/);
  for (let i = 0; i < exps.length; i++) {
    const exp = exps[i];
    if (exps[i + 1] === '') {
      let after = exps[i + 2];
      stmt = `${stmt ? stmt : exp} || ${after}`;
      i++;
    } else {
      pos = i;
      i = exps.length;
    }
  }
  if (!stmt) {
    stmt = exps[pos];
  }
  const filters = exps.slice(pos + 1, exps.length);
  if (filters.length) {
    segmts.addImport('trebor/tools', '_$filters');
    segmts.globalTools = segmts.globalTools || [];
    segmts.globalTools.push('_$filters');
    return `_$filters(_$ctx, ${stmt}, ${filters.map(filter => {
      const [name, params] = filter.split(/\((.*)\)/);
      return `['${name.trim()}'${params ? `, ${params}` : ''}]`;
    }, '')})`;
  } else {
    return stmt;
  }
}

function parseTextExpression(str: string, checkOrCb?: boolean | ((exp: string) => string)) {
  let exp = '';
  let code = '';
  let text = '`';
  let quotemark = '';
  let blockLevel = 0;
  let blockStart = -1;
  let blockClose = false;
  const quotemarks = `"'\``;

  for (let currentPos = 0, length = str.length; currentPos < length; currentPos++) {
    blockClose = false;
    let char = str[currentPos];
    if (char !== '\\') { // skip escaped characters
      const index = quotemarks.indexOf(char); // Check for blocks inside strings
      if (~index) {
        // Check for unfinished strings
        const hasPair = char !== quotemark && !!~str.slice(currentPos + 1).indexOf(char);
        quotemark = hasPair ? quotemarks[index] : ''; // Set to corresponding closing quote
      } else if (!quotemark) {
        if (char === '}' && str[currentPos - 1] !== '\\') {
          if (blockLevel === 1) {
            blockLevel = 0;
            blockClose = true;
            exp = code.trim(); // Collect expression parts
            text += exp ? `\${${typeof checkOrCb === 'function' && checkOrCb(exp) || exp}}` : '';
            code = '';
            if (checkOrCb === true) {
              currentPos = length;
            }
          } else {
            blockLevel && blockLevel--; // Check for block closing tag without starting tag
          }
        } else if (char === '{' && str[currentPos - 1] !== '\\') { // New block handling
          blockLevel++;
          blockStart = currentPos;
          text += entities.decode(code); // Collect text parts
          code = '';
        }
      }
      code += blockStart !== currentPos && !blockClose ? char : '';
    }
  }
  text += `${entities.decode(code)}\``;
  return checkOrCb === true ? !!exp : text;
}

export {
  replaceVar, replaceItem, capitalize, snakeToCamel, camelToSnake, each, toValidate, filters,
  filterPlaceholders, hash, parseTextExpression, escapeCharacters
};