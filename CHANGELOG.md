0.3.0
- Added warning when trebor-tools module are not installed.
- Added trebor-tools as dependency when format is 'es' or 'cjs'.
- Refactored helper function names to be compatible with 'trebor-tools'.
- Optimized component destroy hook.

0.2.4
- Added ability to get the iteration index when iterate over obejcts.
- Fixed issue initializing element attributes.
- Fixed missing spaces in adjacent interpolation expressions.
- Fixed missing attribute generation.
- Fixed scope issue when conditional are inside loops.
- Changed test to work with PhantomJS.

0.2.3
- Added ability to add or remove boolean attributes.
- Fixed some bugs on context assignment with Sequence and Assignment expressions.

0.2.2
- Added Sequence expression to context generation.
- Fixed missing attributes generating elements in slots.
- Fixed bug generating code for component event attributes.
- Fixed internal errors passing children in loops and conditions.

0.2.1
- Fixed issue analyzing slots.
- Fixed bug mounting components.

0.2.0
- Added commonjs to the list of output formats.
- Added new badges to the README.
- Added documentation and license link  to the README.
- Added first test files.
- Rewritten method to assign scope to javascript expressions.
- Fixed some bugs and issues.
- Optimized code generation and generated code.

0.1.2
- Added default include pattern to every file with extension html in rollup plugin.
- Added a validator property to component attributes definition.
- Component plugins are store globally now.
- Ignore html files inside node_modules folder by default in cli mode.
- Fixed bug in output path in cli mode.

0.1.1
- Fixed issue with file location in cli mode.

0.1.0
- Added ability to work with `SVG` elements.
- Added ability to iterate over number and range with `$for` attribute.
- Added `$parentEl` and `siblingEl` properties to the component instance.
- Added `component` build-in element to work with dynamic components.
- Added more examples of how to use the library.
- Moved webpack loader and rollup plugin to an individual files.
- Rewrote the reactivity to work more efficient updating the DOM.
- Changed `refs` attribute for `#<ref-name>` attribute.
- Fixed issues in loop and condition generation.
- Fixed issues in parent resolution when template, loops and conditions are used.

0.0.3
- Fixed extra event updates.

0.0.2
- Added `$tag` especial attribute functionality.
- Added ability to filter bound expressions.
- Added ability to remove comments in minify mode only.
- Added `$unmount` hook.
- Made hooks direct properties of options.
- Make `es` output file only if minify is disabled.
- Fixed missing nodes when analize conditions.

0.0.1
- Project initialization and commit of project files.