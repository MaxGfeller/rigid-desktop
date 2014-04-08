var Handlebars = require('handlebars');
var i18n = require("i18next");

i18n.init({
    lng: window.navigator.language,
    resGetPath: __dirname + '/locales/__lng__/__ns__.json'
});

Handlebars.registerHelper('t', function(i18n_key) {
    var result = i18n.t(i18n_key);

    return new Handlebars.SafeString(result);
});

module.exports = Handlebars;
