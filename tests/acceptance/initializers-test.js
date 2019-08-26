import { test, module } from 'qunit';
import { visit, currentURL } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';

module('Acceptance | before test', function() {
  test('initializers', function(assert) {
    assert.equal(
      self.fooInitializeWasCalled,
      undefined,
      'initializer:foo should not yet be called'
    );
    assert.equal(
      self.barInitializeWasCalled,
      undefined,
      'instance-initializer:bar should not yet be called'
    );
  });
});

module('Acceptance | initializers', function(hooks) {
  setupApplicationTest(hooks);
  test('visiting /', async function(assert) {
    await visit('/');

    assert.equal(self.fooInitializeWasCalled, true, 'initializer:foo should have been called');
    assert.equal(
      self.barInitializeWasCalled,
      true,
      'instance-initializer:boo should have been called'
    );
    assert.equal(currentURL(), '/');
  });
});
