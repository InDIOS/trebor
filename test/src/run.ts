let system = require('system');

if (system.args.length !== 2) {
  console.log('Usage: test.js URL');
  phantom.exit(1);
}

let page = require('webpage').create();

page.onConsoleMessage = msg => {
  console.log(msg);
};

page.open(system.args[1], status => {
  if (status !== 'success') {
    console.log(`Unable to access to '${system.args[1]}'`);
    phantom.exit();
  } else {
    waitFor(() => page.evaluate(() => window['jsApiReporter'].status() === 'done'), () => {
      let exitCode = page.evaluate(() => {
        function padString(str: string, chars: string, length: number) {
          for (let i = 0; i < length; i++) str += chars;
          return str;
        }

        function $<T extends HTMLElement>(sel: string, parent?: HTMLElement) {
          return (parent || document.body).querySelector<T>(sel);
        }

        console.log('');

        let version = $('.jasmine-version').innerText;
        let duration = $('.jasmine-duration').innerText;
        console.log(`Jasmine v${version} - ${duration}`);

        let symbols = $('.jasmine-symbol-summary');
        let symbs = '';
        for (let i = 0; i < symbols.children.length; i++) {
          let sym = symbols.children[i];
          symbs += sym.classList.contains('jasmine-passed') ? 'o ' : 'x ';
        }
        let pad = padString('', '-', symbs.length - 1);
        console.log(pad);
        console.log(symbs.trim());
        console.log(pad);

        let failures = $('.jasmine-results > .jasmine-failures');
        if (failures.children.length > 0) {
          let list = failures.querySelectorAll<HTMLElement>('.jasmine-spec-detail.jasmine-failed');
          if (list && list.length > 0) {
            console.log('');
            console.log(`${list.length} test${list.length > 1 ? 's' : ''} of ${symbols.children.length} FAILED:`);
            for (let i = 0; i < list.length; ++i) {
              let el = list[i], desc = $('.jasmine-description', el),
                msg = $('.jasmine-messages > .jasmine-result-message', el),
                stack = $('.jasmine-messages > .jasmine-stack-trace', el);
              console.log('');
              let d = '';
              let descs = desc.innerText.split(' > ');
              for (let j = 0; j < descs.length; j++) {
                d += `${padString('', ' ', j ? j + 3 : 0)}${j === 0 ? `${i + 1}) ` : ''}- ${descs[j]}\n`;
              }
              console.log(d);
              console.log(msg.innerText);
              console.log('  on file:', stack.innerText.replace(/<Jasmine>/g, '').replace('file:///', '').trim());
              (i + 1) === list.length && console.log('');
            }
          }
          return 1;
        } else {
          console.log($('.jasmine-bar.jasmine-passed').innerText);
          return 0;
        }
      });
      !exitCode && console.log('');
      console.log(`Tests finished ${exitCode ? 'with errors' : 'successfully'}.`);
      exitCode && console.log('');
      phantom.exit(exitCode);
    }, 30000);
  }
});

function waitFor(testFx: string | (() => any), onReady: string | (() => any), timeOutMillis?: number) {
  let maxtimeOutMillis = timeOutMillis || 3001, start = new Date().getTime(), condition = false,
    interval = setInterval(() => {
      if ((new Date().getTime() - start < maxtimeOutMillis) && !condition) {
        condition = typeof testFx === 'string' ? eval(testFx) : testFx();
      } else {
        if (!condition) {
          console.log('Test took too much time to execute');
          phantom.exit(1);
        } else {
          typeof onReady === 'string' ? eval(onReady) : onReady();
          clearInterval(interval);
        }
      }
    }, 100);
}
