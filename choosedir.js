function chooseDir(cb) {
    var el = document.createElement('input');
    var id = randomString(8, 'abcdefghijklmnopqrstuvwxyz');
    el.type = 'file';
    el.style.cssText = 'display: none';
    el.id = id;
    el.nwdirectory = 'nwdirectory';

    document.body.appendChild(el);
    el.addEventListener('change', function(evt) {
        var el = document.querySelector('#' + id);
        cb(null, el.value);
    });

    el.click();
}

function randomString(length, chars) {
    var result = '';
    for (var i = length; i > 0; --i) result += chars[Math.round(Math.random() * (chars.length - 1))];
    return result;
}

module.exports = chooseDir;
