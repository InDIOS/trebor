import { parse } from 'meriyah';
import { Program } from './estree';

export default function parser(source = '', options = {}) {
  return <Program><any>parse(source, Object.assign({ module: true, next: true, ranges: true }, options));
}
