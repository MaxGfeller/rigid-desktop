var fs = require('fs');
var levelup = require('levelup');
var co = require('co');
var thunkify = require('thunkify');
var i18n = require('i18next');
var leveljs = require('level-js');
var nth = require('co-nth-arg');

var db = levelup('rigid-projects', { db: leveljs });

function ProjectManager() {
    this.activeProject = null;
    this.lastOpenedProjects = [];
}

ProjectManager.prototype.isDirectoryRigidProject = function(dir, cb) {
    co(function*() {
        var exists = yield nth.zeroth(thunkify(fs.exists))(dir + '/rigid.json');

        if(!exists) {
            return cb(i18n.t('project-select-dialog.errors.no-config-file-found'));
        }

        cb(null);
    })();
}

ProjectManager.prototype.getActiveProject = function(cb) {
    co(function *() {
        if(!this.activeProject) {
            var activeProj = yield thunkify(db.get).call(db, 'active-directory');
            this.activeProject = activeProj;
        }

        cb(null, this.activeProject);
    }).call(this);
}

ProjectManager.prototype.selectActiveProject = function(dir, cb) {
    co(function*() {
        this.activeProject = dir;
        yield thunkify(db.put).call(db, 'active-directory', dir);
        cb(null);
    })();
}

module.exports = new ProjectManager();
