/*
* History HTML5 api wrapper
*
* license: mit
* author: dudiq (c) 2018
*
* */

//todo check debounce with timeout for detect correct changed navigation

const his = window.history;

function onEvent(node, event, listener, useCapture = false) {
    if (node.addEventListener) {
        node.addEventListener(event, listener, useCapture);
    } else {
        node.attachEvent('on' + event, listener);
    }
}

function getLocationPath() {
    const loc = window.location;
    const origin = loc.origin;
    const location = loc + '';
    const path = location.substring(origin.length);
    return path;
}

function replaceWithHash(path) {
    const origin = window.location.origin;
    const hashIndex = path.indexOf('#');
    if (hashIndex == -1 || hashIndex > 2) {
        const newPath = origin + '/#' + (path ? path : '/');
        his.replaceState({}, '', newPath);
    }
}

function createStatePath(path) {
    if (path && path[0] == '/') {
        path = path.substring(1);
    }
    const loc = window.location;
    const origin = loc.origin;
    const hash = this.opt.useHash ?
        '/#/' :
        '/';
    const ret = origin + hash + path;
    return ret;
}

function parseLocation() {
    const path = this.getPath();
    const callbacks = this.callbacks;
    for (let i = 0, l = callbacks.length; i < l; i++) {
        callbacks[i](path);
    }
}

export default class HistoryApi {
    constructor({useHash = true} = {}) {
        this.opt = {useHash};
        const self = this;
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

    startHistory() {
        this.enable = true;
        parseLocation.call(this);
    }

    length() {
        return his.length;
    }

    getPath() {
        let path = getLocationPath();
        // parse path to correct string without # or other symbols
        const hashIndex = path.indexOf('#');
        if (hashIndex != -1) {
            path = path.substring(2);
        }
        if (path && path[0] == '/') {
            path = path.substring(1);
        }
        return path;
    }

    pushState(path) {
        const newPath = createStatePath.call(this, path);
        his.pushState({}, '', newPath);
        parseLocation.call(this);
    }

    replaceState(path) {
        const newPath = createStatePath.call(this, path);
        his.replaceState({}, '', newPath);
        parseLocation.call(this);
    }

    on(cb) {
        this.callbacks.push(cb);
        if (this.opt.useHash) {
            const path = getLocationPath();
            replaceWithHash(path);
        }
    }

    off(cb) {
        const pos = this.callbacks.indexOf(cb);
        if (pos >= 0) {
            this.callbacks.splice(pos, 1);
        }
    }
}
