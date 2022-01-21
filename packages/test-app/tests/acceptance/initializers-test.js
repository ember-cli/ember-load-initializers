import { test, module } from 'qunit';
import { visit, currentURL } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';

module('Acceptance | before test', function () {
  test('initializers', function (assert) {
    assert.strictEqual(
      self.fooInitializeWasCalled,
      undefined,
      'initializer:foo should not yet be called'
    );
    assert.strictEqual(
      self.barInitializeWasCalled,
      undefined,
      'instance-initializer:bar should not yet be called'
    );
  });
});

module('Acceptance | initializers', function (hooks) {
  setupApplicationTest(hooks);
  test('visiting /', async function (assert) {
    await visit('/');

    assert.true(true, 'initializer:foo should have been called');
    assert.true(
      self.barInitializeWasCalled,
      'instance-initializer:boo should have been called'
    );
    assert.strictEqual(currentURL(), '/');
  });
});
