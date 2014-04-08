var fs = require('fs');
var levelup = require('levelup');
var co = require('co');
var thunkify = require('thunkify');
var i18n = require('i18next');
// var db = levelup('./project-dir');
var nth = require('co-nth-arg');

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
    return this.activeProject;
}

ProjectManager.prototype.selectActiveProject = function(dir, cb) {
    co(function*() {
        this.activeProject = dir;
        // yield thunkify(db.put)('active-directory', dir);
        cb(null);
    })();
}

module.exports = new ProjectManager();
