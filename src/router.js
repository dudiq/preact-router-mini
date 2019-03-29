import callbacks from 'jr-callbacks';
import debounce from 'jr-debounce';
import HistoryApiClass from './history-api';
import utils from './utils';
import pathToRegexp from './pathToRegexp';

const deb = debounce(100);

const notFoundBind = callbacks();
const oneBackCbs = callbacks();
const onChanged = callbacks();

const historyApi = new HistoryApiClass();

const routesCbs = [];
const currKeys = {};
let currentPath = historyApi.getPath();
const notFoundCheck = {
    haveValidRoutes: false,
    havePassedRoutes: false,
};

function checkNotFound() {
    deb.stop();
    notFoundCheck.haveValidRoutes = false;
    notFoundCheck.havePassedRoutes = false;
    for (let i = 0, l = routesCbs.length; i < l; i++) {
        const item = routesCbs[i];
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

const router = {
    startRouting: function () {
        historyApi.startHistory();
        utils.fillKeys(currentPath, currKeys);
    },

    getKey: function (key) {
        return currKeys[key];
    },
    getKeyFromPath: function (path, key) {
        const keysGetter = new pathToRegexp(path);
        keysGetter.exec(currentPath);
        let res;
        const params = keysGetter.params;
        if (Array.isArray(key)) {
            res = {};
            key.forEach((pKey) => {
                res[pKey] = params[pKey];
            });
        } else {
            res = params[key];
        }
        return res;
    },
    getPath: function () {
        return currentPath;
    },
    length: historyApi.length,
    onChanged,
    onRoute: function (bindPath, onToggle, opt = {}) {
        const pte = new pathToRegexp(bindPath, true);
        const item = {
            path: bindPath,
            onToggle: onToggle,
            opt,
            pte: pte,
            isValid: IsValid(pte, currentPath),
        };
        routesCbs.push(item);
        item.isValid && utils.onShowRe(currentPath, currKeys, item);

        onAdd();
    },

    offRoute: function (onToggle) {
        for (let i = routesCbs.length - 1; i >= 0; i--) {
            if (routesCbs[i].onToggle == onToggle) {
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
        if (path != currentPath) {
            historyApi.replaceState(path);
        }
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
        item.isValid = IsValid(item.pte, currentPath);
        if (item.isValid) {
            utils.onShowRe(currentPath, currKeys, item);
        } else {
            item.onToggle(false);
        }
    });

    checkNotFound();
});

export default router;
