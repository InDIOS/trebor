import '../helpers/setup';
const Component = require('../components/condition.umd');

describe('Component Conditions', () => {
  let instance, span: HTMLSpanElement, div: HTMLDivElement;
  
  beforeAll(done => {
    instance = new Component();
    instance.$mount('main');
    done();
  });

  it('`$if` should be rendered', () => {
    span = document.querySelector('span');
    expect(span.textContent).toBe('1');
  });

  it('`$else-if` should be rendered', () => {
    instance.$set('condition', 2);
    span = document.querySelector('span');
    expect(span.textContent).toBe('2');
  });

  it('`$else` should be rendered', () => {
    instance.$set('condition', 3);
    span = document.querySelector('span');
    expect(span.textContent).toBe('other');
  });

  it('`$if` only should be rendered', () => {
    div = document.querySelector('div');
    expect(div.textContent).toBe('1');
  });

  it('`$if` only should be hidden', () => {
    instance.$set('condition_1', 2);
    div = document.querySelector('div');
    expect(div).toBeNull();
  });
});