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