'use strict';

const object = {
    get: require('@zerointermittency/utils/object/get.js'),
    paths: require('@zerointermittency/utils/object/paths.js'),
};

module.exports = (attrs, language = 'original') => {
    const searchables = object.paths(attrs, (attr) => attr['analyzer']);
    for (let i = searchables.length - 1; i >= 0; i--) {
        const attr = object.get(attrs, searchables[i]),
            priority = (attr.priority) ? `^${attr.priority}` : '';
        if (attr.type === 'LocalizableString')
            searchables[i] = `innerObject.${searchables[i]}.${language}${priority}`;
        else searchables[i] = `innerObject.${searchables[i]}${priority}`;
    }
    return searchables;
};