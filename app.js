var page = require('page');
var co = require('co');
var domready = require('domready');
var thunkify = require('thunkify');
var os = require('os');
var projectManager = require('./lib/project-manager');
var fs = require('fs');
var rigid = require('rigid');

var projectSelectDialog = require('./components/project-select-dialog/index');
var sitesListView = require('./components/sites-list/index');

co(function*() {
    yield thunkify(domready)();

    var mainEl = document.querySelector('#main');

    yield (thunkify(projectSelectDialog.render).bind(projectSelectDialog)(null, {}));
    projectSelectDialog.on('selectedProject', function(activeProj) {
        projectSelectDialog.destroy();
        renderMainView(activeProj);
    });
})();


var renderMainView = function(activeProject) {
    co(function *() {
        yield thunkify(sitesListView.load).call(sitesListView, activeProject);
        // render all subcomponents of the main view
        yield thunkify(sitesListView.render).call(sitesListView, '.sites-list-container', {
            sites: [{
                unprefixedName: 'Seite 1'
            }]
        });
    }).call(this);
}
