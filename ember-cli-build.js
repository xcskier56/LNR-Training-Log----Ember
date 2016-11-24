/*jshint node:true*/
/* global require, module */
var EmberApp = require('ember-cli/lib/broccoli/ember-app');

module.exports = function (defaults) {
  var app = new EmberApp(defaults, {
    sassOptions: {
      includePaths: [
        'bower_components/bootstrap/scss'
      ]
    }
  });
  app.import('bower_components/es5-shim/es5-shim.js', {
    type: 'vendor',
    prepend: true
  });
  app.import('vendor/object_values_polyfill.js', {
    type: 'vendor',
    prepend: true
  });
  app.import('bower_components/moment/moment.js');
  return app.toTree();
};
