import pathToRegexp from 'path-to-regexp';
import callbacks from 'jr-callbacks';
import debounce from 'jr-debounce';
import HistoryApiClass from './history-api';
import utils from './utils';

const deb = debounce(100);

const notFoundBind = callbacks();
const oneBackCbs = callbacks();
const onChanged = callbacks();

const historyApi = new HistoryApiClass();

const routesCbs = [];
const currKeys = {};
let currentPath = historyApi.getPath();

function checkNotFound() {
    deb.stop();
    let haveRes = false;
    for (let i = 0, l = routesCbs.length; i < l; i++) {
        const item = routesCbs[i];
        if (item.isValid) {
            haveRes = true;
        }
    }
    notFoundBind(!haveRes);
}

function onAdd() {
    deb(checkNotFound);
}

const router = {
    startRouting: function () {
        historyApi.startHistory();
    },

    getKey: function (key) {
        return currKeys[key];
    },
    getPath: function () {
        return currentPath;
    },
    length: historyApi.length,
    onChanged,
    onRoute: function (bindPath, onShow, onHide, ctx) {
        const re = pathToRegexp(bindPath);
        const item = {
            path: bindPath,
            ctx,
            onShow,
            onHide,
            re: re,
            isValid: re.test(currentPath),
            idxToKey: utils.getKeysIndexes(bindPath),
        };
        routesCbs.push(item);
        item.isValid && utils.onShowRe(currentPath, currKeys, item);

        onAdd();
    },

    offRoute: function (ctx) {
        for (let i = routesCbs.length - 1; i >= 0; i--) {
            if (routesCbs[i].ctx == ctx) {
                routesCbs.splice(i, 1);
            }
        }
    },

    oneBack: function (cb) {
        oneBackCbs.clean();
        oneBackCbs.on(cb);
    },
    offBack: function (cb) {
        cb
            ? oneBackCbs.off(cb)
            : oneBackCbs.clean();
    },
    notFoundBind,

    replaceState: function (path) {
        oneBackCbs.clean();
        historyApi.replaceState(path);
    },

    pushState: function (path) {
        oneBackCbs.clean();
        historyApi.pushState(path);
    },
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
    utils.fillKeys(currentPath, currKeys);
    routesCbs.forEach((item) => {
        item.isValid = item.re.test(currentPath);
        if (item.isValid) {
            utils.onShowRe(currentPath, currKeys, item);
        } else {
            item.onHide();
        }
    });

    checkNotFound();
});

export default router;
