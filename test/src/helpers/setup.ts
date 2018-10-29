import { join } from 'path';
import glob = require('glob');
import { writeFileSync } from 'fs';
import { specs, components } from './config';

const jasmineCoreDir = '../node_modules/jasmine-core';

glob(specs, (err, test) => {
  if (err) console.log(err);
  glob(components, (err, utils) => {
    if (err) console.log(err);
    writeFileSync(join(__dirname, '../test.html'), `<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8">
		<title>Jasmine Spec Runner</title>
		<link rel="shortcut icon" type="image/png" href="${jasmineCoreDir}/images/jasmine_favicon.png">
		<link rel="stylesheet" href="${jasmineCoreDir}/lib/jasmine-core/jasmine.css">
		<!-- Jasmine lib files here... -->
		<script src="${jasmineCoreDir}/lib/jasmine-core/jasmine.js"></script>
		<script src="${jasmineCoreDir}/lib/jasmine-core/jasmine-html.js"></script>
		<script src="${jasmineCoreDir}/lib/jasmine-core/boot.js"></script>
		<script>
			var env = jasmine.getEnv();
			env.configure({ random: false });
		</script>
		<!-- include source files here... -->
		${insertScripts(utils)}
		<!-- include spec files here... -->
		${insertScripts(test)}
	</head>
  <body>
    <main style="display: none;"></main>
  </body>
</html>`, 'utf8');
  });
});

function insertScripts(scripts: string[]) {
  return scripts.map(u => `<script src="${u.replace('specs/', '')}"></script>`).join('\n    ');
}
