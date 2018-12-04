'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _pathToRegexp = require('path-to-regexp');

var _pathToRegexp2 = _interopRequireDefault(_pathToRegexp);

var _jrCallbacks = require('jr-callbacks');

var _jrCallbacks2 = _interopRequireDefault(_jrCallbacks);

var _jrDebounce = require('jr-debounce');

var _jrDebounce2 = _interopRequireDefault(_jrDebounce);

var _historyApi = require('./history-api');

var _historyApi2 = _interopRequireDefault(_historyApi);

var _utils = require('./utils');

var _utils2 = _interopRequireDefault(_utils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var deb = (0, _jrDebounce2.default)(100);

var notFoundBind = (0, _jrCallbacks2.default)();
var oneBackCbs = (0, _jrCallbacks2.default)();
var onChanged = (0, _jrCallbacks2.default)();

var historyApi = new _historyApi2.default();

var routesCbs = [];
var currKeys = {};
var currentPath = historyApi.getPath();

function checkNotFound() {
    deb.stop();
    var haveRes = false;
    for (var i = 0, l = routesCbs.length; i < l; i++) {
        var item = routesCbs[i];
        if (item.isValid) {
            haveRes = true;
        }
    }
    notFoundBind(!haveRes);
}

function onAdd() {
    deb(checkNotFound);
}

var router = {
    startRouting: function startRouting() {
        historyApi.startHistory();
    },

    getKey: function getKey(key) {
        return currKeys[key];
    },
    getPath: function getPath() {
        return currentPath;
    },
    length: historyApi.length,
    onChanged: onChanged,
    onRoute: function onRoute(bindPath, onShow, onHide, ctx) {
        var re = (0, _pathToRegexp2.default)(bindPath);
        var item = {
            path: bindPath,
            ctx: ctx,
            onShow: onShow,
            onHide: onHide,
            re: re,
            isValid: re.test(currentPath),
            idxToKey: _utils2.default.getKeysIndexes(bindPath)
        };
        routesCbs.push(item);
        item.isValid && _utils2.default.onShowRe(currentPath, currKeys, item);

        onAdd();
    },

    offRoute: function offRoute(ctx) {
        for (var i = routesCbs.length - 1; i >= 0; i--) {
            if (routesCbs[i].ctx == ctx) {
                routesCbs.splice(i, 1);
            }
        }
    },

    oneBack: function oneBack(cb) {
        oneBackCbs.clean();
        oneBackCbs.on(cb);
    },
    offBack: function offBack(cb) {
        cb ? oneBackCbs.off(cb) : oneBackCbs.clean();
    },
    notFoundBind: notFoundBind,

    replaceState: function replaceState(path) {
        oneBackCbs.clean();
        historyApi.replaceState(path);
    },

    pushState: function pushState(path) {
        oneBackCbs.clean();
        historyApi.pushState(path);
    }
};

historyApi.on(function onPathChanged(location) {
    if (oneBackCbs.getLength()) {
        oneBackCbs();
        oneBackCbs.clean();
        router && router.pushState(currentPath);
        return;
    }

    currentPath = '/' + location;
    onChanged(currentPath);
    _utils2.default.fillKeys(currentPath, currKeys);
    routesCbs.forEach(function (item) {
        item.isValid = item.re.test(currentPath);
        if (item.isValid) {
            _utils2.default.onShowRe(currentPath, currKeys, item);
        } else {
            item.onHide();
        }
    });

    checkNotFound();
});

exports.default = router;