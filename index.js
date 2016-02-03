/* jshint node: true */
'use strict';

module.exports = {
  name: 'ember-load-initializers',

  included: function() {
    this._super.included.apply(this, arguments);

    this.app.import('vendor/ember-load-initializers/legacy-shims.js');
  }
};
