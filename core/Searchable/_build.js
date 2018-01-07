'use strict';

const object = {
    get: require('@zerointermittency/utils/object/get.js'),
    set: require('@zerointermittency/utils/object/set.js'),
    unset: require('@zerointermittency/utils/object/unset.js'),
};

module.exports = (searchable, obj) => {
    const commons = searchable.props.commons,
        nil = searchable.props.nil,
        __id = object.get(obj, commons.__id),
        buildObj = {
            __id: __id,
            deepLink: searchable.deepLink.replace('{{_id}}', __id),
            searchable: `${searchable.index}:${searchable.type}`,
            displayName: searchable.displayName,
        };

    /* istanbul ignore else */
    if (commons.title)
        buildObj.title = object.get(obj, commons.title);
    /* istanbul ignore else */
    if (commons.description)
        buildObj.description = object.get(obj, commons.description);
    /* istanbul ignore else */
    if (commons.images)
        buildObj.images = object.get(obj, commons.images);
    /* istanbul ignore else */
    if (commons.videos)
        buildObj.videos = object.get(obj, commons.videos);
    /* istanbul ignore else */
    if (commons.__client)
        buildObj.__client = object.get(obj, commons.__client);
    /* istanbul ignore else */
    if (commons.__appgroup)
        buildObj.__appgroup = object.get(obj, commons.__appgroup);
    /* istanbul ignore else */
    if (commons.__apps)
        buildObj.__apps = object.get(obj, commons.__apps);
    /* istanbul ignore else */
    if (commons.__accessgroups)
        buildObj.__accessgroups = object.get(obj, commons.__accessgroups);
    /* istanbul ignore else */
    if (commons.from)
        buildObj.from = object.get(obj, commons.from);

    for (let i = nil.length - 1; i >= 0; i--) {
        const prop = nil[i][0],
            value = nil[i][1];
        /* istanbul ignore else */
        if (object.get(obj, prop) == null) object.set(obj, prop, value);
    }

    buildObj.innerObject = obj;
    return buildObj;
};