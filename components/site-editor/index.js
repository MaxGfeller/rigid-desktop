var co = require('co');
var inherits = require('util').inherits;
var thunkify = require('thunkify');
var fs = require('fs');
var EventedView = require('../../util/evented-view');
var CodeMirror = require('code-mirror/mode/gfm');
var marked = require('marked');
var rigid = require('rigid');

inherits(SiteEditor, EventedView);

function SiteEditor() {
    EventedView.call(this, {
        'template': __dirname + '/template.hbs',
        // 'events': {
        //     '.sites-list-entry': {
        //         click: this._onSitesListEntryClick
        //     }
        // }
    });
}

SiteEditor.prototype.render = function(el, opts, cb) {
    co(function *() {
        yield thunkify(EventedView.prototype.render).call(this, el, {});
        // load editor
        this.cm = new CodeMirror(document.querySelector('#markdown-editor'), {
            value: opts.value,
            lineNumbers: true,
            lineWrapping: true,
            theme: require('code-mirror/theme/mbo'),
            mode: 'markdown'
        });

        this.cm.on('change', this.renderMarkdownPreview.bind(this));

        this.renderMarkdownPreview();
    }).call(this);
}

SiteEditor.prototype.renderMarkdownPreview = function() {
    var el = document.querySelector('.right-panel');
    el.innerHTML = marked(this.cm.getValue());
}

module.exports = new SiteEditor();
