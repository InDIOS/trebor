describe('Component Conditions', () => {
  let instance, span: HTMLSpanElement, div: HTMLDivElement;
  
  beforeEach(done => {
    instance = new Condition();
    instance.$mount('main');
    done();
  });

  afterEach(done => {
    instance && instance.$destroy();
    done();
  });

  it('`$if` should be rendered', () => {
    span = document.querySelector('main span');
    expect(span.textContent).toBe('1');
  });

  it('`$else-if` should be rendered', () => {
    instance.$set('condition', 2);
    span = document.querySelector('main span');
    expect(span.textContent).toBe('2');
  });

  it('`$else` should be rendered', () => {
    instance.$set('condition', 3);
    span = document.querySelector('main span');
    expect(span.textContent).toBe('other');
  });

  it('`$if` only should be rendered', () => {
    div = document.querySelector('main div');
    expect(div.textContent).toBe('1');
  });

  it('`$if` only should be hidden', () => {
    instance.$set('condition_1', 2);
    div = document.querySelector('main div');
    expect(div).toBeNull();
  });
});