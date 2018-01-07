'use strict';

const Bodybuilder = require('bodybuilder'),
    core = {
        errors: require('./errors.js'),
    };

module.exports = (
    self,
    term,
    {
        items = 10,
        language = 'original',
        client,
        appgroup,
        apps,
        accessgroups,
        _bodybuilder = {},
        fuzziness = 2,
        operator = 'and',
    }
) => new Promise((res, rej) => {
    const keys = Object.keys(self._searchables),
        queries = [],
        indexes = [],
        inits = [];
    for (let i = keys.length - 1; i >= 0; i--) {
        const searchable = self._searchables[keys[i]],
            {index, type} = searchable,
            body = new Bodybuilder();
        inits.push(searchable._init());
        indexes.push(index);
        body.from(0).size(items);
        /* istanbul ignore else */
        if (client) body.filter('term', '__client', client);
        /* istanbul ignore else */
        if (appgroup) body.filter('term', '__appgroup', appgroup);
        if (apps)
            for (let i = apps.length - 1; i >= 0; i--)
                body.orFilter('term', '__apps', apps[i]);
        if (accessgroups)
            for (let i = accessgroups.length - 1; i >= 0; i--)
                body.orFilter('term', '__accessgroups', accessgroups[i]);
        if (_bodybuilder[`${index}:${type}`])
            _bodybuilder[`${index}:${type}`](body);
        body.query(
            'multi_match',
            {
                query: term,
                fields: searchable.props.searchables(language),
                fuzziness: fuzziness,
                operator: operator,
                lenient: true, // ignore error cast compareeee!
            }
        );
        queries.push({'types': type});
        queries.push(body.build('v2'));
    }
    Promise.all(inits)
        .then(() => {
            self.client.msearch({index: indexes, body: queries}, (err, output) => {
                /* istanbul ignore if */
                if (err) return rej(core.errors.internal(err));
                const result = {items: [], sections: [], errors: []};
                output.responses.sort((a, b) => b.hits.max_score - a.hits.max_score);
                for (let i = 0; i < output.responses.length; i++) {
                    const response = output.responses[i];
                    /* istanbul ignore if */
                    if (response.error) {
                        result.errors.push(response.error);
                        continue;
                    }
                    if (response.hits && response.hits.total > 0) {
                        result.sections.push({
                            title: response.hits.hits[0]._source.displayName,
                            index: result.items.length,
                            extra: {
                                // @n: took indica el tiempo en segundos para la busqueda
                                time: response.took / 1000,
                                searchable: response.hits.hits[0]._source.searchable,
                            },
                        });
                        for (let i = 0; i < response.hits.hits.length; i++) {
                            const item = response.hits.hits[i]._source;
                            item._score = response.hits.hits[i]._score;
                            result.items.push(item);
                        }
                    }
                }
                res(result);
            });
        }).catch(rej);

});