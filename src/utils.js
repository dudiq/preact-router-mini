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
        item.pte.exec(path, keyList);
        item.onToggle(true);
    },
};

export default utils;
