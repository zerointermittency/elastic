'use strict';

const object = {
    get: require('@zerointermittency/utils/object/get.js'),
    paths: require('@zerointermittency/utils/object/paths.js'),
};

module.exports = (attrs) => {
    const commons = object.paths(attrs, (attr) => attr['common']),
        result = {};
    for (let i = commons.length - 1; i >= 0; i--) {
        const attr = object.get(attrs, commons[i]);
        result[`${attr.common}`] = commons[i];
    }
    return result;
};