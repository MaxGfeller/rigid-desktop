var Handlebars = require('../handlebars-i18n');
var co = require('co');
var thunkify = require('thunkify');
var fs = require('fs');
var EventEmitter = require('events').EventEmitter;
var inherits = require('util').inherits;

inherits(EventedView, EventEmitter);

function EventedView(obj) {
    EventEmitter.call(this);
    this.events = obj.events || {};
    this.template = obj.template || null;
}

EventedView.prototype._registerEvents = function() {
    for(var selector in this.events) {
        var el = document.querySelector(selector);
        if(el) {
            var events = this.events[selector];
            for(var event in events) {
                el.addEventListener(event, events[event]);
            }
        }
    }
}

EventedView.prototype.render = function(selector, opts, cb) {
    co(function *() {
        var src = yield thunkify(fs.readFile)(this.template, {
            encoding: 'utf8'
        });

        var html = Handlebars.compile(src)(opts);

        if(selector) {
            var el = document.querySelector(selector);
            el.innerHTML = html;
            this.container = el;
        } else {
            var el = document.createElement('div');
            el.style.position = 'absolute';
            el.style.top = '0px';
            el.style.width = '100%';
            el.style.height = '100%';
            el.style.backgroundColor = 'rgba(0, 0, 0, 0.6)';
            el.innerHTML = html;

            document.body.appendChild(el);
            this.container = el;
        }

        this._registerEvents();
        cb(null);
    }).call(this);
}

EventedView.prototype.destroy = function() {
    this.container.parentNode.removeChild(this.container);
}

module.exports = EventedView;
