"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _jrCallbacks = _interopRequireDefault(require("jr-callbacks"));

var _jrDebounce = _interopRequireDefault(require("jr-debounce"));

var _historyApi = _interopRequireDefault(require("./history-api"));

var _utils = _interopRequireDefault(require("./utils"));

var _pathToRegexp = _interopRequireDefault(require("./pathToRegexp"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var deb = (0, _jrDebounce.default)(100);
var notFoundBind = (0, _jrCallbacks.default)();
var oneBackCbs = (0, _jrCallbacks.default)();
var onChanged = (0, _jrCallbacks.default)();
var historyApi = new _historyApi.default();
var routesCbs = [];
var currKeys = {};
var currentPath = historyApi.getPath();
var notFoundCheck = {
  haveValidRoutes: false,
  havePassedRoutes: false
};

function checkNotFound() {
  deb.stop();
  notFoundCheck.haveValidRoutes = false;
  notFoundCheck.havePassedRoutes = false;

  for (var i = 0, l = routesCbs.length; i < l; i++) {
    var item = routesCbs[i];

    if (item.isValid) {
      notFoundCheck.haveValidRoutes = true;

      if (!item.opt.skipNotFound) {
        notFoundCheck.havePassedRoutes = true;
      }
    }
  }

  notFoundBind(notFoundCheck);
}

function onAdd() {
  deb(checkNotFound);
}

function IsValid(re, path) {
  return re.test(path);
}

var router = {
  startRouting: function startRouting() {
    historyApi.startHistory();

    _utils.default.fillKeys(currentPath, currKeys);
  },
  getKey: function getKey(key) {
    return currKeys[key];
  },
  getKeyFromPath: function getKeyFromPath(path, key) {
    var keysGetter = new _pathToRegexp.default(path);
    keysGetter.exec(currentPath);
    var res;
    var params = keysGetter.params;

    if (Array.isArray(key)) {
      res = {};
      key.forEach(function (pKey) {
        res[pKey] = params[pKey];
      });
    } else {
      res = params[key];
    }

    return res;
  },
  getPath: function getPath() {
    return currentPath;
  },
  length: historyApi.length,
  onChanged: onChanged,
  onRoute: function onRoute(bindPath, onToggle) {
    var opt = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    var pte = new _pathToRegexp.default(bindPath, true);
    var item = {
      path: bindPath,
      onToggle: onToggle,
      opt: opt,
      pte: pte,
      isValid: IsValid(pte, currentPath)
    };
    routesCbs.push(item);
    item.isValid && _utils.default.onShowRe(currentPath, currKeys, item);
    onAdd();
  },
  offRoute: function offRoute(onToggle) {
    for (var i = routesCbs.length - 1; i >= 0; i--) {
      if (routesCbs[i].onToggle == onToggle) {
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

    if (path != currentPath) {
      historyApi.replaceState(path);
    }
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

  _utils.default.fillKeys(currentPath, currKeys);

  routesCbs.forEach(function (item) {
    item.isValid = IsValid(item.pte, currentPath);

    if (item.isValid) {
      _utils.default.onShowRe(currentPath, currKeys, item);
    } else {
      item.onToggle(false);
    }
  });
  checkNotFound();
});
var _default = router;
exports.default = _default;