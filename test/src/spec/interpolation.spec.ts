describe('Component Text interpolation', () => {
	let instance;

	beforeEach(done => {
		instance = new Interpolation();
		instance.$mount('main');
		done();
	});

	afterEach(done => {
		instance && instance.$destroy();
		done();
	});

	it('should render text correctly', () => {
		let text_1 = document.querySelector('#text_1');
		let text_2 = document.querySelector('#text_2');
		let text_3 = document.querySelector('#text_3');
		expect(text_1.textContent).toBe('Test interpolation with some text.');
		expect(text_2.textContent).toBe('Test interpolation with some text and some text with quote \' and double quote "');
		expect(text_3.textContent).toBe('Test some text with some text with quote \' and double quote " and some expresions with AND');
	});
});