import cssToJson from './cssToJson';
import jsonToCss from './jsonToCss';

export default function parse(css: string, options?: { minify?: boolean, scoped?: boolean }) {
  const opts = options || { minify: false, scoped: false };

  const styleAst = cssToJson(css);
  const toCSS = jsonToCss(opts);
  const { className, styleText } = toCSS(styleAst);

  return {
    scope: className,
    css: opts.scoped ? styleText : styleText.replace(new RegExp(`\\.${className}`, 'g'), '')
  };
}
