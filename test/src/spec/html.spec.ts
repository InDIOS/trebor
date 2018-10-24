describe('Component Html', () => {
  let instance, divs: NodeListOf<HTMLDivElement>;

  beforeEach(done => {
    instance = new Html();
    instance.$mount('main');
    done();
  });

  afterEach(done => {
    instance && instance.$destroy();
    done();
	});

  it('nodes without expression should be normally rendered', () => {
    divs = document.querySelectorAll('div');
    let div = divs.item(0);
    expect(div.innerHTML).toBe('<p>Here\'s a very interesting note displayed in a lovely shadowed box.</p><p>Any kind of content here. Such as &lt;p&gt;, &lt;table&gt;. You name it!</p>');
  });

  it('nodes with expression should not escape expressions', () => {
    divs = document.querySelectorAll('div');
    let div_1 = divs.item(1), div_2 = divs.item(2);
    expect(div_1.innerHTML).toBe('<p>Some paragraph with text undefined</p>');
    expect(div_2.innerHTML).toBe('<p>Some paragraph with undefined and undefined expressions</p>');
  });

  it('`$html` should escape expressions', () => {
    divs = document.querySelectorAll('div');
    let div_1 = divs.item(3), div_2 = divs.item(4);
    expect(div_1.innerHTML).toBe('<p $some-attr="someVar">Some paragraph with text intentional {{escaped}}</p>');
    expect(div_2.innerHTML).toBe('<p $some-attr="someVar">Some paragraph with text from {{model}}</p>');
  });
});