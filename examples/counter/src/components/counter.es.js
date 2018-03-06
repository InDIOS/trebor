import {
  _$CompCtr,
  _$,
  _$d,
  _$a,
  _$r,
  _$ce,
  _$ct,
  _$sa,
  _$ga,
  _$al,
  _$rl,
  _$bc,
  _$is,
  _$ds,
  _$toStr
} from 'trebor/tools';
'use strict';
function _$tplCounter(state) {
  var div, h3, txt, label, txt_1, strong, txt_2, setTxt_2, bindClassStrong, br, button, txt_3, clickEvent, handlerClickEvent, button_1, txt_4, clickEvent_1, handlerClickEvent_1;
  setTxt_2 = function (state) {
    return state.count;
  };
  bindClassStrong = function (state) {
    return _$bc(state.negative()).trim();
  };
  clickEvent = function (state) {
    state.increment();
  };
  clickEvent_1 = function (state) {
    state.decrement();
  };
  return {
    $create: function () {
      div = _$ce();
      h3 = _$ce('h3');
      txt = _$ct('Counter Example');
      _$a(h3, txt);
      _$a(div, h3);
      label = _$ce('label');
      txt_1 = _$ct('Counter: ');
      _$a(label, txt_1);
      _$a(div, label);
      strong = _$ce('strong');
      txt_2 = _$ct();
      txt_2.data = setTxt_2(state);
      _$a(strong, txt_2);
      _$a(div, strong);
      br = _$ce('br');
      _$a(div, br);
      button = _$ce('button');
      txt_3 = _$ct('Increment');
      _$a(button, txt_3);
      _$a(div, button);
      button_1 = _$ce('button');
      txt_4 = _$ct('Decrement');
      _$a(button_1, txt_4);
      _$a(div, button_1);
      this.$hydrate();
    },
    $hydrate: function () {
      _$sa(h3, 'class', 'title is-3');
      _$sa(strong, 'class', _$toStr(bindClassStrong(state)));
      _$al(button, 'click', handlerClickEvent = function (event) {
        clickEvent(state, event, button);
      });
      _$sa(button, 'class', 'button is-primary');
      _$al(button_1, 'click', handlerClickEvent_1 = function (event) {
        clickEvent_1(state, event, button_1);
      });
      _$sa(button_1, 'class', 'button is-danger');
      _$sa(div, 'class', 'container');
    },
    $mount: function (parent, sibling) {
      _$is('scope_672e9690', '.negative {color:crimson;}');
      var frag = _$d();
      _$a(frag, div);
      _$a(_$(parent), frag, _$(sibling));
    },
    $update: function (state) {
      var updateTxt_2 = setTxt_2(state);
      if (txt_2.data !== updateTxt_2.toString()) {
        txt_2.data = updateTxt_2;
      }
      updateTxt_2 = void 0;
      var updateClassStrong = _$toStr(bindClassStrong(state));
      if (_$ga(strong, 'class') !== updateClassStrong) {
        _$sa(strong, 'class', updateClassStrong);
      }
      updateClassStrong = void 0;
    },
    $destroy: function () {
      _$ds('scope_672e9690');
      _$rl(button, 'click', handlerClickEvent);
      _$rl(button_1, 'click', handlerClickEvent_1);
      if (div) {
        _$r(div);
      }
      delete state.$root;
      div = h3 = txt = label = txt_1 = strong = txt_2 = setTxt_2 = bindClassStrong = br = button = txt_3 = clickEvent = handlerClickEvent = button_1 = txt_4 = clickEvent_1 = handlerClickEvent_1 = void 0;
    }
  };
}
function Counter(attrs) {
  _$CompCtr.call(this, attrs, _$tplCounter, {
    model: {
      count: 0,
      increment: function () {
        this.count = this.count + 1;
      },
      decrement: function () {
        this.count = this.count - 1;
      },
      negative: function () {
        return { 'negative': this.count < 0 };
      }
    }
  });
}
Counter.prototype = Object.create(_$CompCtr.prototype);
Counter.prototype.constructor = Counter;
export default Counter;