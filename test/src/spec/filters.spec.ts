describe('Component Filters', () => {
  let instance;

  beforeEach(done => {
    instance = new Filters();
    instance.$mount('main');
    done();
  });

  afterEach(done => {
    instance && instance.$destroy();
    done();
  });

  it('should be declared', () => {
    const { $filters } = instance;
    expect($filters.upper).toBeDefined();
    expect($filters.trim).toBeDefined();
    expect($filters.filterBy).toBeDefined();
  });

  it('should be functions', () => {
    const { $filters } = instance;
    expect(typeof $filters.upper).toBe('function');
    expect(typeof $filters.trim).toBe('function');
    expect(typeof $filters.filterBy).toBe('function');
  });

  it('should be filter correctly', () => {
    const [span, span1, ul]: [HTMLSpanElement, HTMLSpanElement, HTMLUListElement] = [].slice.call(document.querySelector('main').children);
    expect(span.textContent).toBe('some test text');
    expect(span1.textContent).toBe('some text uppercase'.toUpperCase());
    instance.$set('filter', 'a');
    expect(ul.children.length).toBe(2);
    expect(ul.children[0].textContent).toBe('AB');
    expect(ul.children[1].textContent).toBe('A C');
  });
});