'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _preact = require('preact');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

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

var PathRouter = function (_Component) {
    _inherits(PathRouter, _Component);

    function PathRouter(props) {
        _classCallCheck(this, PathRouter);

        var _this = _possibleConstructorReturn(this, (PathRouter.__proto__ || Object.getPrototypeOf(PathRouter)).call(this, props));

        _this.onShow = function () {
            _this.setState({
                isShow: true
            });
        };

        _this.onHide = function () {
            _this.setState({
                isShow: false
            });
        };

        _this.state = {
            isShow: false
        };
        if (props.children.length > 1) {
            err('sorry, but only one children can be in PathRouter, doh...');
        }
        return _this;
    }

    _createClass(PathRouter, [{
        key: 'getChildContext',
        value: function getChildContext() {
            return _extends({
                __pathRoute: this.getFullPath()
            }, this.context);
        }
    }, {
        key: 'componentDidMount',
        value: function componentDidMount() {
            this.context.router.onRoute(this.getFullPath(), this.onShow, this.onHide, this);
        }
    }, {
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
            this.context.router.offRoute(this);
        }
    }, {
        key: 'getFullPath',
        value: function getFullPath() {
            var root = parseLevels(this.context.__pathRoute);
            var ret = root + this.props.path;

            return ret;
        }
    }, {
        key: 'render',
        value: function render() {
            var _props = _extends({}, this.props),
                children = _props.children;

            var isShow = this.state.isShow;

            return isShow ? children[0] : null;
        }
    }]);

    return PathRouter;
}(_preact.Component);

exports.default = PathRouter;