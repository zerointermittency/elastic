'use strict';

const object = {
        get: require('@zerointermittency/utils/object/get.js'),
        set: require('@zerointermittency/utils/object/set.js'),
        paths: require('@zerointermittency/utils/object/paths.js'),
    },
    formatDate = 'yyyy-MM-dd\'T\'HH:mm:ss\'Z\'||epoch_millis';

// @n: https://www.elastic.co/guide/en/elasticsearch/reference/5.5/mapping.html#mapping-type
module.exports = (attrs) => {
    const props = object.paths(attrs, (attr, prop, result) => {
            if (result[0] && result[0].startsWith(prop)) return false;
            return typeof attr === 'object';
        }),
        LocalizableStringNotAnalyzed = {
            original: {type: 'string', index: 'not_analyzed'},
            es: {type: 'string', index: 'not_analyzed'},
            en: {type: 'string', index: 'not_analyzed'},
            pt: {type: 'string', index: 'not_analyzed'},
            zh: {type: 'string', index: 'not_analyzed'},
            de: {type: 'string', index: 'not_analyzed'},
            fr: {type: 'string', index: 'not_analyzed'},
            it: {type: 'string', index: 'not_analyzed'},
        },
        mapping = {
            properties: {
                __id: {type: 'string', index: 'not_analyzed'},
                __client: {type: 'string', index: 'not_analyzed'},
                __appgroup: {type: 'string', index: 'not_analyzed'},
                __apps: {type: 'string', index: 'not_analyzed'},
                __accessgroups: {type: 'string', index: 'not_analyzed'},
                title: {
                    properties: LocalizableStringNotAnalyzed,
                },
                description: {
                    properties: LocalizableStringNotAnalyzed,
                },
                deepLink: {type: 'string', index: 'not_analyzed'},
                images: {
                    properties: {
                        _id: {type: 'string', index: 'not_analyzed'},
                        type: {type: 'string', index: 'not_analyzed'},
                        default: {type: 'boolean', index: 'not_analyzed'},
                    },
                },
                videos: {
                    properties: {
                        _id: {type: 'string', index: 'not_analyzed'},
                        name: {
                            properties: LocalizableStringNotAnalyzed,
                        },
                        weight: {type: 'integer', index: 'not_analyzed'},
                    },
                },
                searchable: {type: 'string', index: 'not_analyzed'},
                displayName: {
                    properties: LocalizableStringNotAnalyzed,
                },
                from: {type: 'date', format: formatDate, index: 'not_analyzed'},
            },
        },
        buildMapping = (map, parent, prop) => {
            const {
                type = 'String',
                analyzer,
            } = object.get(attrs, prop);
            prop = prop.split('.').join('.properties.');
            let properties = {type: type.toLowerCase(), analyzer: analyzer};
            const customTypes = {
                LocalizableString: () => {
                    properties = {
                        original: {type: 'string', analyzer: analyzer},
                        es: {type: 'string', analyzer: analyzer},
                        en: {type: 'string', analyzer: analyzer},
                        pt: {type: 'string', analyzer: analyzer},
                        zh: {type: 'string', analyzer: analyzer},
                        de: {type: 'string', analyzer: analyzer},
                        fr: {type: 'string', analyzer: analyzer},
                        it: {type: 'string', analyzer: analyzer},
                    };
                    object.set(map, `${parent}.${prop}.properties`, properties);
                },
                Available: () => {
                    properties = {
                        from: {type: 'date', format: formatDate},
                        until: {type: 'date', format: formatDate},
                    };
                    object.set(map, `${parent}.${prop}.properties`, properties);
                },
                Date: () => {
                    properties = {type: 'date', format: formatDate};
                    object.set(map, `${parent}.${prop}`, properties);
                },
            };
            if (customTypes[type]) customTypes[type]();
            else object.set(map, `${parent}.${prop}`, properties);
        };

    for (let i = props.length - 1; i >= 0; i--)
        buildMapping(mapping, 'properties.innerObject.properties', props[i]);
    return mapping;
};