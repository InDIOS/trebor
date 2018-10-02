import '../helpers/setup';
const Component = require('../components/init.umd');

describe('Component', () => {

	it('should be a function constructor', () => {
		expect(Component).not.toBeNull();
		expect(typeof Component).toBe('function');
	});

	it('should get an instance when is used with new', () => {
		let instance = new Component();
		expect(typeof instance).toBe('object');
		expect(instance.constructor).toEqual(Component);
	});

	it('instance should have prototype methods', () => {
		let instance = new Component();
		expect('$refs' in instance).toBeTruthy();
		expect('$create' in instance).toBeTruthy();
		expect('$mount' in instance).toBeTruthy();
		expect('$update' in instance).toBeTruthy();
		expect('$unmount' in instance).toBeTruthy();
		expect('$destroy' in instance).toBeTruthy();
		expect('$watch' in instance).toBeTruthy();
		expect('$observe' in instance).toBeTruthy();
	});

	it('instance should have option properties', () => {
		let instance = new Component();
		expect('text' in instance).toBeTruthy();
		expect(instance.text).toBe('World');
	});
});

describe('Component Instance', () => {
	let instance, main;
	beforeAll(done => {
		instance = new Component();
		main = document.querySelector('main');
		done();
	});

	afterEach(done => {
		instance.$unmount();
		done();
	});

	it('should be mounted in an element selector', () => {
		instance.$mount('main');
		expect(instance.$parentEl).toEqual(main);
	});

	it('should be mounted in an element', () => {
		instance.$mount(main);
		expect(instance.$parentEl).toEqual(main);
	});

	it('should be mounted correctly', () => {
		instance.$mount('main');
		let h1 = main.firstChild;
		expect(h1.nodeName).toEqual('H1');
		expect(h1.textContent).toBe('Hello, World!!');
	});

	it('should update the view correctly', () => {
		instance.$mount('main');
		let h1 = main.firstChild;
		instance.$set('text', 'Somebody');
		expect(h1.textContent).toBe('Hello, Somebody!!');
	});

	it('should not update the view correctly if `$set` method is not used', () => {
		instance.$mount('main');
		let h1 = main.firstChild;
		instance.text = 'World';
		expect(h1.textContent).toBe('Hello, Somebody!!');
	});
});
