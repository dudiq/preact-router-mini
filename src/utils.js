
const utils = {
    fillKeys: function (location, keyList) {
        const levels = location.split('/');
        for (let key in keyList) {
            delete keyList[key];
        }

        for (let i = 0, l = levels.length; i < l; i++) {
            const item = levels[i] + '';
            const values = item.split('=');
            const key = values[0];
            if (key) {
                const val = utils.toCorrectType(values[1]);
                keyList[key] = val;
            }
        }
    },
    toCorrectType: function (val) {
        let ret = val;
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
    onShowRe: function (path, keyList, item) {

        const vals = item.re.exec(path);
        const idxToKey = item.idxToKey;

        for (let key in idxToKey) {
            const idx = idxToKey[key];
            keyList[key] = vals[idx];
        }

        item.onShow();
    },
    getKeysIndexes: function (path) {
        const levels = path.split('/');
        const keys = {};
        let idx = 1;
        levels.forEach((item) => {
            if (item && item[0] == ':') {
                const first = item.substr(1);
                const key = (first[first.length - 1] == '?')
                    ? first.substr(0, first.length - 1)
                    : first;
                keys[key] = idx;
                idx++;
            }
        });
        return keys;
    },
};

export default utils;
