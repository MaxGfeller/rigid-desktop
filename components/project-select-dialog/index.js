var thunkify = require('thunkify');
var co = require('co');
var choosedir = require('../../choosedir');
var projectManager = require('../../lib/project-manager');
var EventedView = require('../../util/evented-view');
var inherits = require('util').inherits;

inherits(ProjectSelectDialog, EventedView);

var openProjectClick = function() {
    co(function*() {
        var dir = yield thunkify(choosedir)();
        try {
            yield thunkify(projectManager.isDirectoryRigidProject)(dir);
        } catch(e) {
            return window.alert(e);
        }

        yield thunkify(projectManager.selectActiveProject)(dir);
        this.emit('selectedProject', dir);
    }).call(this);
}

function ProjectSelectDialog() {
    EventedView.call(this, {
        'template': __dirname + '/template.hbs',
        'events': {
            '#open-project': {
                click: openProjectClick.bind(this)
            }
        }
    });
}

module.exports = new ProjectSelectDialog();
