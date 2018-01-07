'use strict';

const _mapping = require('./_mapping.js'),
    _props = {
        searchables: require('./_props/searchables.js'),
        commons: require('./_props/commons.js'),
        nil: require('./_props/nil.js'),
    },
    _init = require('./_init.js'),
    _build = require('./_build.js'),
    crud = {
        create: require('./crud/create.js'),
        read: require('./crud/read.js'),
        update: require('./crud/update.js'),
        delete: require('./crud/delete.js'),
    },
    search = require('./search.js');

class Searchable {

    constructor({index, type, displayName, attrs, deepLink}, client) {
        this.index = index;
        this.type = type;
        this.displayName = displayName;
        this.deepLink = deepLink || `/${type.toLowerCase()}/{{_id}}`;
        this.attrs = attrs;
        this._props = {
            searchables: {
                original: _props.searchables(attrs),
                en: _props.searchables(attrs, 'en'),
                es: _props.searchables(attrs, 'es'),
                pt: _props.searchables(attrs, 'pt'),
            },
            commons: _props.commons(attrs),
            nil: _props.nil(attrs),
        };
        this.mapping = _mapping(attrs);
        this.client = client;
        this.init = false;
    }

    _build(obj) {
        return _build(this, obj);
    }

    _init() {
        const self = this;
        return _init(self);
    }

    get crud() {
        const self = this;
        return {
            create: (obj) => crud.create(self, obj),
            read: (__id) => crud.read(self, __id),
            update: (obj) => crud.update(self, obj),
            delete: (__id) => crud.delete(self, __id),
        };
    }

    get props() {
        const self = this;
        return {
            searchables: (language = 'original') => {
                if (!self._props.searchables[language])
                    self._props.searchables[language] = _props.searchables(self.attrs, language);
                return self._props.searchables[language];
            },
            commons: self._props.commons,
            nil: self._props.nil,
            omit: self._props.omit,
        };
    }

    search(term, opts = {}) {
        return search(this, term, opts);
    }
}

module.exports = Searchable;