var co = require('co');
var EventedView = require('../../util/evented-view');
var inherits = require('util').inherits;

inherits(SitesListView, EventedView);

function SitesListView() {
    EventedView.call(this, {
        'template': __dirname + '/template.hbs',
        // 'events': {
        //     // '.sites-list-entry': {
        //     //     click: function() {}
        //     // }
        // }
    });
}

module.exports = new SitesListView();
