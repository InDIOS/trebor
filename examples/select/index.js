phantom.injectJs('index.iif.js');

var app = new Index();
app.$mount('body');

var input_1 = document.querySelector('#checkbox_1');
var input_2 = document.querySelector('#checkbox_2');

fireEvent('MouseEvents', input_1, 'click');
fireEvent('MouseEvents', input_2, 'click');

console.log('Model Value:', JSON.stringify(app.checkboxes));
console.log('Input 1 Value:', input_1.value, typeof input_1.value);
console.log('Input 1 _Value:', input_1._value, typeof input_1._value);
console.log('Input 2 Value:', input_2.value, typeof input_2.value);
console.log('Input 2 _Value:', input_2._value, typeof input_2._value);

phantom.exit();

function fireEvent(type, el, name) { // element to click on
  // Create the event.
  var event = document.createEvent(type);
  // Define that the event name is 'build'.
  event.initEvent(name, true, true);
  // target can be any Element or other EventTarget.
  return el.dispatchEvent(event);
}
