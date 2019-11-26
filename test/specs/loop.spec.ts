describe('Component Loop', () => {
  let instance, items: NodeListOf<HTMLLIElement>;
  
  beforeEach(done => {
    instance = new Loop();
    instance.$mount('main');
    done();
  });

  afterEach(done => {
    instance && instance.$destroy();
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

  it('should loop over an array variable with the given index', () => {
    items = document.querySelectorAll('#loop_6 li');
    expect(items.length).toBe(5);
    for (let i = 0; i < items.length; i++) {
      expect(items.item(i).textContent).toBe(`${i + 1} ${i + 1}`);
    }
  });

	it('should loop over an object with the given index', () => {
    items = document.querySelectorAll('#loop_7 li');
    expect(items.length).toBe(5);
    expect(items.item(0).textContent).toBe('1. a: a');
    expect(items.item(4).textContent).toBe('5. e: e');
	});
	
	it('should loop over an array with the given index', () => {
		items = document.querySelectorAll('#loop_8 li');
		expect(items.length).toBe(5);
		for (let i = 0; i < items.length; i++) {
			expect(items.item(i).textContent).toBe(`${i + 1} ${i + 1}`);
		}
	});

	it('should loop over a number with the given index', () => {
		items = document.querySelectorAll('#loop_9 li');
		expect(items.length).toBe(5);
		for (let i = 0; i < items.length; i++) {
			expect(items.item(i).textContent).toBe(`${i + 1} ${i}`);
		}
	});

	it('should loop over a range of numbers with the given index', () => {
		items = document.querySelectorAll('#loop_10 li');
		expect(items.length).toBe(5);
		for (let i = 0; i < items.length; i++) {
			expect(items.item(i).textContent).toBe(`${i + 1} ${i}`);
		}
	});

	it('nested loops should render with the according scope', () => {
		items = document.querySelectorAll('#loop_11 li');
		expect(items.length).toBe(5);
		for (let i = 0; i < items.length; i++) {
			let { children } = items.item(i);
			expect(children.length).toBe(5);
			for (let j = 0; j < children.length; j++) {
				expect(!!~children[j].textContent.indexOf(`${i + 1}.${i + 1}.${j + 1}`)).toBeTruthy();
			}
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