var page = require('page');
var co = require('co');
var domready = require('domready');
var thunkify = require('thunkify');
var os = require('os');

var projectSelectDialog = require('./components/project-select-dialog/index.js');

co(function*() {
    yield thunkify(domready)();

    var mainEl = document.querySelector('#main');

    yield thunkify(projectSelectDialog.render).call(projectSelectDialog, null);
    projectSelectDialog.on('selectedProject', function(activeProj) {
        projectSelectDialog.destroy.call(projectSelectDialog);
    });
})();
