(function() {
define("ember/load-initializers",
  [],
  function() {
    "use strict";

    return {
      'default': function(app, prefix) {
        var initializersRegExp = new RegExp('^' + prefix + '/initializers');

        Ember.keys(requirejs._eak_seen).filter(function(key) {
          return initializersRegExp.test(key);
        }).forEach(function(moduleName) {
          var module = require(moduleName, null, null, true);
          if (!module) { throw new Error(moduleName + ' must export an initializer.'); }
          var initializer = module['default'];
          if (typeof initializer === 'function') {
            initializer = {
              initialize: initializer
            };
          }
          initializer.name = initializer.name || moduleName.split('/').pop();
          app.initializer(initializer);
        });
      }
    }
  }
);
})();
