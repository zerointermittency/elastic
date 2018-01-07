'use strict';

const elasticsearch = require('elasticsearch'),
    core = {
        Searchable: require('./core/Searchable'),
        _checkVersion: require('./core/_checkVersion'),
        search: require('./core/search.js'),
    };

class ZIElastic {

    constructor(opts = {}) {
        this.client = new elasticsearch.Client(
            Object.assign(opts, {apiVersion: '5.6'})
        );
        this._searchables = {};
        this.checkVersion = false;
    }

    _checkVersion() {
        return core._checkVersion(this);
    }

    // crea o devuelve el objeto searchable listo para realizar las operaciones correspondientes
    searchable({index, type, displayName, attrs, deepLink}) {
        const self = this,
            prop = `${index}:${type}`;
        if (self._searchables[prop]) return self._searchables[prop];
        return self._searchables[prop] = new core.Searchable(
            {index, type, displayName, attrs, deepLink}, self.client
        );
    }

    search(term, opts = {}) {
        return core.search(this, term, opts);
    }

}

module.exports = ZIElastic;