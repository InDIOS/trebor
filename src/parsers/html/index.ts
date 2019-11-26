import { Element } from './element';
import { tokenize, constructTree } from 'hyntax';

export { Element };
export default function parse(html: string, options?: { comments?: boolean }) {
  const { tokens } = tokenize(html);
  const { ast } = constructTree(tokens);
  const { comments } = (options || { comments: false });

  return new Element(ast, null, comments);
}
