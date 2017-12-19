import Application from '@ember/application';
import Resolver from './resolver';
import loadInitializers from 'ember-load-initializers';
import config from './config/environment';

const App = Application.extend({
  modulePrefix: config.modulePrefix,
  podModulePrefix: config.podModulePrefix,
  Resolver,
  destroy() {
    this._super(...arguments);
    delete self.fooInitializeWasCalled;
    delete self.barInitializeWasCalled;
  }
});

loadInitializers(App, config.modulePrefix);

export default App;
