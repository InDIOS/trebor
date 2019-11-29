import Jasmine from 'jasmine';
import JasmineConsoleReporter from 'jasmine-console-reporter';

// setup Jasmine
const jasmine = new Jasmine({});
jasmine.loadConfig({
  spec_dir: 'test/specs',
  spec_files: ['**/*[sS]pec.js'],
  random: false,
  seed: null,
  stopSpecOnExpectationFailure: false
});
jasmine.jasmine['DEFAULT_TIMEOUT_INTERVAL'] = 15000;

// setup console reporter
const reporter = new JasmineConsoleReporter({
  colors: 1,
  emoji: true,
  verbosity: 4,
  cleanStack: 1,
  timeUnit: 'ms',
  listStyle: 'indent',
  activity: 'bouncingBar',
  timeThreshold: { ok: 500, warn: 1000, ouch: 3000 },
});

// initialize and execute
jasmine.env.clearReporters();
jasmine.addReporter(reporter);
jasmine.execute();
