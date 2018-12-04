'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var utils = {
    fillKeys: function fillKeys(location, keyList) {
        var levels = location.split('/');
        for (var key in keyList) {
            delete keyList[key];
        }

        for (var i = 0, l = levels.length; i < l; i++) {
            var item = levels[i] + '';
            var values = item.split('=');
            var _key = values[0];
            if (_key) {
                var val = utils.toCorrectType(values[1]);
                keyList[_key] = val;
            }
        }
    },
    toCorrectType: function toCorrectType(val) {
        var ret = val;
        if (!isNaN(val - 0)) {
            // number
            ret = val - 0;
        } else if (val === 'true') {
            ret = true;
        } else if (val === 'false') {
            ret = false;
        }
        return ret;
    },
    onShowRe: function onShowRe(path, keyList, item) {

        var vals = item.re.exec(path);
        var idxToKey = item.idxToKey;

        for (var key in idxToKey) {
            var idx = idxToKey[key];
            keyList[key] = vals[idx];
        }

        item.onShow();
    },
    getKeysIndexes: function getKeysIndexes(path) {
        var levels = path.split('/');
        var keys = {};
        var idx = 1;
        levels.forEach(function (item) {
            if (item && item[0] == ':') {
                var first = item.substr(1);
                var key = first[first.length - 1] == '?' ? first.substr(0, first.length - 1) : first;
                keys[key] = idx;
                idx++;
            }
        });
        return keys;
    }
};

exports.default = utils;