import '../helpers/setup';
const Component = require('../components/loop.umd');

describe('Component Loop', () => {
  let instance, items: NodeListOf<HTMLLIElement>;
  
  beforeAll(done => {
    instance = new Component();
    instance.$mount('main');
    done();
  });

  it('should loop over an array variable', () => {
    items = document.querySelectorAll('#loop_1 li');
    expect(items.length).toBe(5);
    for (let i = 0; i < items.length; i++) {
      expect(items.item(i).textContent).toBe(`${i + 1}`);
    }
  });

  it('should loop over an object', () => {
    items = document.querySelectorAll('#loop_2 li');
    expect(items.length).toBe(5);
    expect(items.item(0).textContent).toBe('a');
    expect(items.item(4).textContent).toBe('e');
  });

  it('should loop over an array', () => {
    items = document.querySelectorAll('#loop_3 li');
    expect(items.length).toBe(5);
    for (let i = 0; i < items.length; i++) {
      expect(items.item(i).textContent).toBe(`${i + 1}`);
    }
  });

  it('should loop over a number', () => {
    items = document.querySelectorAll('#loop_4 li');
    expect(items.length).toBe(5);
    for (let i = 0; i < items.length; i++) {
      expect(items.item(i).textContent).toBe(`${i}`);
    }
  });

  it('should loop over a range of numbers', () => {
    items = document.querySelectorAll('#loop_5 li');
    expect(items.length).toBe(5);
    for (let i = 0; i < items.length; i++) {
      expect(items.item(i).textContent).toBe(`${i}`);
    }
  });

  it('items should be modified', () => {
    instance.items.splice(3, 1);
    items = document.querySelectorAll('#loop_1 li');
    expect(items.length).toBe(4);
    expect(items.item(0).textContent).toBe('1');
    expect(items.item(1).textContent).toBe('2');
    expect(items.item(2).textContent).toBe('3');
    expect(items.item(3).textContent).toBe('5');
  });
});