module.exports = {
  priority: 10,
  attr: 'focus-edit',
  action(node, expression, segmts) {
    if (node.tagName === 'input') {
      const { varName } = node;
      const exp = this.ctx(expression, segmts.globals);
      const setFocusVar = `_$setFocus${varName[2].toUpperCase() + varName.slice(3)}`;
      const setFocusCall = `${setFocusVar}(_$ctx);`;
      segmts.init.push(setFocusVar);
      segmts.extras.add(`${setFocusVar} = _$ctx => {${exp} && ${varName}.focus();};`);
      segmts.update.add(setFocusCall);
      segmts.unmount.add(setFocusCall);
    }
  }
};