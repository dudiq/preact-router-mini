'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/*
* History HTML5 api wrapper
*
* license: mit
* author: dudiq (c) 2018
*
* */

//todo check debounce with timeout for detect correct changed navigation

var his = window.history;

function onEvent(node, event, listener) {
    var useCapture = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;

    if (node.addEventListener) {
        node.addEventListener(event, listener, useCapture);
    } else {
        node.attachEvent('on' + event, listener);
    }
}

function getLocationPath() {
    var loc = window.location;
    var origin = loc.origin;
    var location = loc + '';
    var path = location.substring(origin.length);
    return path;
}

function replaceWithHash(path) {
    var origin = window.location.origin;
    var hashIndex = path.indexOf('#');
    if (hashIndex == -1 || hashIndex > 2) {
        var newPath = origin + '/#' + (path ? path : '/');
        his.replaceState({}, '', newPath);
    }
}

function createStatePath(path) {
    if (path && path[0] == '/') {
        path = path.substring(1);
    }
    var loc = window.location;
    var origin = loc.origin;
    var hash = this.opt.useHash ? '/#/' : '/';
    var ret = origin + hash + path;
    return ret;
}

function parseLocation() {
    var path = this.getPath();
    var callbacks = this.callbacks;
    for (var i = 0, l = callbacks.length; i < l; i = i + 2) {
        callbacks[i](path);
    }
}

var HistoryApi = function () {
    function HistoryApi() {
        var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            _ref$useHash = _ref.useHash,
            useHash = _ref$useHash === undefined ? true : _ref$useHash;

        _classCallCheck(this, HistoryApi);

        this.opt = { useHash: useHash };
        var self = this;
        this.enable = false;
        onEvent(window, 'popstate', function (ev) {
            if (self.enable) {
                parseLocation.call(self);
                ev.preventDefault();
                return false;
            }
        });
        onEvent(window, 'pushstate', function (ev) {
            if (self.enable) {
                parseLocation.call(self);
                ev.preventDefault();
                return false;
            }
        });
        this.callbacks = [];
    }

    _createClass(HistoryApi, [{
        key: 'startHistory',
        value: function startHistory() {
            this.enable = true;
            parseLocation.call(this);
        }
    }, {
        key: 'length',
        value: function length() {
            return his.length;
        }
    }, {
        key: 'getPath',
        value: function getPath() {
            var path = getLocationPath();
            // parse path to correct string without # or other symbols
            var hashIndex = path.indexOf('#');
            if (hashIndex != -1) {
                path = path.substring(2);
            }
            if (path && path[0] == '/') {
                path = path.substring(1);
            }
            return path;
        }
    }, {
        key: 'pushState',
        value: function pushState(path) {
            var newPath = createStatePath.call(this, path);
            his.pushState({}, '', newPath);
            parseLocation.call(this);
        }
    }, {
        key: 'replaceState',
        value: function replaceState(path) {
            var newPath = createStatePath.call(this, path);
            his.replaceState({}, '', newPath);
            parseLocation.call(this);
        }
    }, {
        key: 'on',
        value: function on(cb) {
            this.callbacks.push(cb);
            if (this.opt.useHash) {
                var path = getLocationPath();
                replaceWithHash(path);
            }
        }
    }, {
        key: 'off',
        value: function off(cb) {
            var pos = this.callbacks.indexOf(cb);
            if (pos >= 0) {
                this.callbacks.splice(pos, 1);
            }
        }
    }]);

    return HistoryApi;
}();

exports.default = HistoryApi;