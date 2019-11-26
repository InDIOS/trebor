function fireEvent(el: HTMLElement, name: string, type?: string) { // element to click on
  // Create the event.
  var event = document.createEvent(`${type ? type[0].toUpperCase() + type.slice(1) : ''}Event`);
  // Define that the event name is 'build'.
  event.initEvent(name, true, true);
  // target can be any Element or other EventTarget.
  return el.dispatchEvent(event);
}

describe('Component Bind', () => {
  let instance: Component;

  beforeEach(done => {
    instance = new Bind();
    instance.$mount('main');
    done();
  });

  afterEach(done => {
    instance && instance.$destroy();
    done();
  });

  describe('$name directive', () => {
    describe('in checked checkbox', () => {
      it('should add value to an array', () => {
        let input: HTMLInputElement = document.querySelector('#checkbox_1');
        fireEvent(input, 'click', 'mouse');
        expect(instance.checkboxes.length).toBe(1);
        expect(instance.checkboxes[0]).toBe('Yes');
      });
  
      it('with bond value should add object to an array', () => {
        let input: HTMLInputElement = document.querySelector('#checkbox_3');
        fireEvent(input, 'click', 'mouse');
        expect(instance.checkboxes_1.length).toBe(1);
        let obj = instance.checkboxes_1[0];
        expect(obj).toBeDefined();
        expect(typeof obj).toBe('object');
        expect(obj).toEqual({ value: 'Yes' });
      });
    });

    describe('in a unchecked checkbox', () => {
      it('should remove value from the array', () => {
        let input: HTMLInputElement = document.querySelector('#checkbox_1');
        fireEvent(input, 'click', 'mouse');
        fireEvent(input, 'click', 'mouse');
        expect(instance.checkboxes.length).toBe(0);
      });

      it('with bond value should remove value from the array', () => {
        let input: HTMLInputElement = document.querySelector('#checkbox_4');
        fireEvent(input, 'click', 'mouse');
        fireEvent(input, 'click', 'mouse');
        expect(instance.checkboxes_1.length).toBe(0);
      });
    });

    describe('in a checked radio', () => {
      it('should assign value to the property', () => {
        let input: HTMLInputElement = document.querySelector('#radio_1');
        fireEvent(input, 'click', 'mouse');
        expect(instance.radios).toBe('radio 1');
      });

      it('with bond value should assign the object value to the property', () => {
        let input: HTMLInputElement = document.querySelector('#radio_5');
        fireEvent(input, 'click', 'mouse');
        let obj = instance.radios_1;
        expect(obj).toBeDefined();
        expect(typeof obj).toBe('object');
        expect(obj).toEqual({ value: 'radio 5' });
      });
    });
  });

  describe('$value directive', () => {
    it('should change text input value from model', () => {
      instance.$set('textValue', 'some text');
      let input: HTMLInputElement = document.querySelector('#text');
      expect(input.value).toBe('some text');
    });
  
    it('should change number input value from model', () => {
      instance.$set('numValue', 10);
      let input: HTMLInputElement = document.querySelector('#number');
      expect(input.value).toBe('10');
    });
  });

  describe('input.value', () => {
    it('should change text input value in model', () => {
      let input: HTMLInputElement = document.querySelector('#text');
      input.value = 'text test';
      fireEvent(input, 'input');
      expect(instance.textValue).toBe('text test');
    });
  
    it('should change number input value in model', () => {
      let input: HTMLInputElement = document.querySelector('#number');
      input.value = '5';
      fireEvent(input, 'input');
      expect(instance.numValue).toBe(5);
    });
  });
});