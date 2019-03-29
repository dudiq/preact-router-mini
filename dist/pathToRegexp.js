"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function pathToRegexp(path, keys, fromStart, sensitive, strict) {
  if (path instanceof RegExp) return path;
  if (path instanceof Array) path = '(' + path.join('|') + ')';
  path = path.concat(strict ? '' : '/?').replace(/\/\(/g, '(?:/').replace(/\+/g, '__plus__').replace(/(\/)?(\.)?:(\w+)(?:(\(.*?\)))?(\?)?/g, function (_, slash, format, key, capture, optional) {
    keys.push({
      name: key,
      optional: !!optional
    });
    slash = slash || '';
    return '' + (optional ? '' : slash) + '(?:' + (optional ? slash : '') + (format || '') + (capture || format && '([^/.]+?)' || '([^/]+?)') + ')' + (optional || '');
  }).replace(/([\/.])/g, '\\$1').replace(/__plus__/g, '(.+)').replace(/\*/g, '(.*)');
  return new RegExp((fromStart ? '^' : '') + path + '$', sensitive ? '' : 'i');
}

function Route(path, fromStart) {
  this.path = path;
  this.keys = [];
  this.params = {};
  this.regex = pathToRegexp(this.path, this.keys, fromStart, false, false);
}

var p = Route.prototype;

p.exec = function (path, params) {
  var m = this.regex.exec(path);
  if (!m) return false;

  for (var i = 1, len = m.length; i < len; ++i) {
    var key = this.keys[i - 1];
    var val = typeof m[i] == 'string' ? decodeURIComponent(m[i]) : m[i];

    if (key) {
      var name = key.name;
      this.params[name] = val;
      params && (params[name] = val);
    }
  }

  return true;
};

p.test = function (path) {
  return this.regex.test(path);
};

var _default = Route;
exports.default = _default;