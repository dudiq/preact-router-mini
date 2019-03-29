"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _preact = require("preact");

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var reg = /[^a-zA-Z]+/ig;

function err(msg) {
  if (_typeof(window.console) !== undefined) {
    console.error('PathRouter.js:', msg);
  }
}

function parseLevels(path) {
  path == '/' && (path = '');

  if (!path) {
    path = '';
    return path;
  }

  var levels = path.split('/');

  for (var i = 0, l = levels.length; i < l; i++) {
    var item = levels[i];
    levels[i] = item.replace(reg, '');
  }

  var ret = levels.join('/');
  return ret;
}

var PathRouter =
/*#__PURE__*/
function (_Component) {
  _inherits(PathRouter, _Component);

  function PathRouter(props) {
    var _this;

    _classCallCheck(this, PathRouter);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(PathRouter).call(this, props));

    _defineProperty(_assertThisInitialized(_this), "onToggle", function (isShow) {
      if (_this.state.isShow != isShow) {
        _this.setState({
          isShow: isShow
        });
      }
    });

    _this.state = {
      isShow: false
    };

    if (props.children.length > 1) {
      err('sorry, but only one children can be in PathRouter, doh...');
    }

    return _this;
  }

  _createClass(PathRouter, [{
    key: "getChildContext",
    value: function getChildContext() {
      return _objectSpread({
        __pathRoute: this.getFullPath()
      }, this.context);
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      this.context.router.onRoute(this.getFullPath(), this.onToggle, {
        skipNotFound: this.props.skipNotFound
      });
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      this.context.router.offRoute(this.onToggle);
    }
  }, {
    key: "getFullPath",
    value: function getFullPath() {
      var root = parseLevels(this.context.__pathRoute);
      var ret = root + this.props.path;
      return ret;
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props = _objectSpread({}, this.props),
          children = _this$props.children;

      var isShow = this.state.isShow;
      return isShow ? children[0] : null;
    }
  }]);

  return PathRouter;
}(_preact.Component);

exports.default = PathRouter;