'use strict';

const object = {
    get: require('@zerointermittency/utils/object/get.js'),
    paths: require('@zerointermittency/utils/object/paths.js'),
};

module.exports = (attrs) => {
    const nil = object.paths(
            attrs, (attr) => attr['type'] === 'Available' || attr['nil']
        ),
        result = [];
    for (let i = nil.length - 1; i >= 0; i--) {
        const attr = object.get(attrs, nil[i]);
        if (attr['type'] === 'Available')
            result[i] = [`${nil[i]}.until`, '3000-01-01T00:00:00Z'];
        else
            result[i] = [`${nil[i]}`, attr['nil']];
    }
    return result;
};