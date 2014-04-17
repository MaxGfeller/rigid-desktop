var co = require('co');
var EventedView = require('../../util/evented-view');
var inherits = require('util').inherits;
var rigid = require('rigid');
var thunkify = require('thunkify');
var fs = require('fs');
var siteEditor = require('../site-editor/index');

inherits(SitesListView, EventedView);

function SitesListView() {
    EventedView.call(this, {
        'template': __dirname + '/template.hbs',
        'events': {
            '.sites-list-entry': {
                click: this._onSitesListEntryClick.bind(this)
            }
        }
    });

    this.sites = [];
}

SitesListView.prototype._onSitesListEntryClick = function(evt) {
    co(function *() {
        var el = evt.srcElement;
        var filename = el.dataset.file;

        var contents = yield thunkify(fs.readFile).call(null, this.sitesDir + '/' + filename, { encoding: 'utf8' });
        var lastIndex = contents.lastIndexOf('---') + 3;
        var contentsWithoutFrontmatter = contents.slice(lastIndex);

        yield thunkify(siteEditor.render).call(siteEditor, '.main-content-container', { value: contentsWithoutFrontmatter });
    }).call(this);
}

SitesListView.prototype.load = function(path, cb) {
    co(function *() {
        var configParser = rigid.configParser;
        var frontmatterParser = rigid.parserFrontmatter;
        var cfgPath = path + '/rigid.json';
        var cfg = yield thunkify(configParser.parseConfig).call(configParser, cfgPath);

        this.sitesDir = path + '/' + cfg.siteDir;

        var files = yield thunkify(fs.readdir)(this.sitesDir);

        files.forEach(function(file, i) {
            co(function *() {
                var frontmatter = yield thunkify(frontmatterParser.parse)(this.sitesDir + '/' + file);

                frontmatter['filename'] = file;
                this.sites.push(frontmatter);

                if(i === files.length - 1) cb(null);
            }).call(this);
        }.bind(this));
    }).call(this);
}

SitesListView.prototype.render = function(el, opts, cb) {
    co(function *() {
        yield thunkify(EventedView.prototype.render).call(this, el, { sites: this.sites });
        cb(null);
    }).call(this);
}

module.exports = new SitesListView();
