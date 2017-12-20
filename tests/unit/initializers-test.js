import { module } from 'qunit';
import test from 'ember-sinon-qunit/test-support/test';
import loadInitializers from 'ember-load-initializers';
import lotsakeys from '../fixtures/required-keys';

module('loadInitializers test', {
});
// one of mock builder because I don't know
// how to cleanly initalize ember-qunit-sinon in a before
function mockApp() {
  const app = {
    initializer: this.spy(),
    instanceInitializer: this.spy()
  };
  return app;
}
const isFunction = val => typeof val === 'function';

test('loadInitializers initializer', function(assert) {
  assert.expect(2);
  const app = mockApp.call(this);
  loadInitializers(app, 'dummy');
  // initializers will be called with each dependency
  // we only care about foo and bar
  const [ fooInit ] = app.initializer.args.find(([ { name } ]) => name && name === 'foo');
  assert.ok(fooInit.name, 'foo', `calls an application's foo initializer`);
  assert.ok(isFunction(fooInit.initialize), `resolved an initializer`);
});

test('loadInitializers instance initializer', function(assert) {
  assert.expect(2);
  const app = mockApp.call(this);
  loadInitializers(app, 'dummy');
  const [ barInit ] = app.instanceInitializer.args.find(([ { name } ]) => name && name === 'bar');
  assert.ok(barInit.name, 'bar', `calls an application's instance initializer`);
  assert.ok(isFunction(barInit.initialize), `resolved an instance initializer`);
});

test('loadInitializers perf', function(assert) {
  assert.expect(2);
  const samples = lotsakeys();

  const uuid = () => uuid.index++;
  uuid.index = 0;

  samples.forEach(path => {
    //eslint-disable-next-line
    requirejs._eak_seen[path] = {
      uuid: uuid(),
      id: path,
      deps: [],
      callback() {},
      module: {}
    };
  });
  const app = mockApp.call(this);
  let count = 5;
  const runs = [];
  while (count) {
    window.performance.clearMarks();
    window.performance.clearMeasures();
    window.performance.mark('before');
    loadInitializers(app, 'dummy');
    window.performance.mark('after');
    window.performance.measure('something', 'before', 'after');
    const [ { duration } ] = window.performance.getEntriesByName('something');
    runs.push(duration);
    count--;
  }
  assert.equal(runs.length, 5, 'averages performance runs');
  const sum = (p, c) => p + c;
  assert.equal(runs.reduce(sum) / runs.length < 15, true, 'executes reasonably well with hundreds of require entries');
});
