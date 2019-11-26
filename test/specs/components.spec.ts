describe('Component instance', () => {
  let instance: Component;

	beforeEach(done => {
		instance = new Components();
		instance.$mount('main');
		done();
	});

	afterEach(done => {
		instance && instance.$destroy();
		done();
	});

	it('should mount all instances', () => {
    let main = <HTMLInputElement>document.querySelector('main');
		expect(main.children.length).toBe(3);
	});

	it('should be mounted and render the default slot', () => {
		let main = <HTMLInputElement>document.querySelector('main');
		expect(main.firstChild.nodeName).toBe('DIV');
		expect(main.firstChild.textContent).toBe('Some text');
	});

	it('should be mounted and overwrite the default slot', () => {
		let main = <HTMLInputElement>document.querySelector('main');
		let child = main.children[1];
		expect(child.nodeName).toBe('DIV');
		expect(child.textContent).toBe('Some other text');
	});

	it('should set the slot correctly', () => {
		let main = <HTMLInputElement>document.querySelector('main');
		let child = main.children[2];
		expect(child.nodeName).toBe('DIV');
		expect(child.children[0].tagName).toBe('SPAN');
		expect(child.children[0].textContent).toBe('Some header');
		expect(child.children[1].tagName).toBe('SPAN');
		expect(child.children[1].textContent).toBe('Some span text');
		expect(child.children[2].tagName).toBe('SPAN');
		expect(child.children[2].textContent).toBe('Some footer');
	});
});