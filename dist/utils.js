"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
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
    item.pte.exec(path, keyList);
    item.onToggle(true);
  }
};
var _default = utils;
exports.default = _default;