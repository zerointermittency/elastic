'use strict';

const Bodybuilder = require('bodybuilder'),
    core = {
        errors: require('./../errors.js'),
    };

module.exports = (
    self,
    term,
    {
        page = 1,
        itemsPerPage = 10,
        language = 'original',
        client,
        appgroup,
        apps = [],
        accessgroups = [],
        _bodybuilder,
        fuzziness = 2,
        operator = 'and',
    }
) => new Promise((res, rej) => {
    const {index, type} = self,
        body = new Bodybuilder();
    body.from((page - 1) * itemsPerPage).size(itemsPerPage);
    /* istanbul ignore else */
    if (client) body.filter('term', '__client', client);
    /* istanbul ignore else */
    if (appgroup) body.filter('term', '__appgroup', appgroup);
    for (let i = apps.length - 1; i >= 0; i--)
        body.orFilter('term', '__apps', apps[i]);
    for (let i = accessgroups.length - 1; i >= 0; i--)
        body.orFilter('term', '__accessgroups', accessgroups[i]);
    if (typeof _bodybuilder === 'function') _bodybuilder(body);
    body.query(
        'multi_match',
        {
            query: term,
            fields: self.props.searchables(language),
            fuzziness: fuzziness,
            operator: operator,
            lenient: true, // @n: ignore error cast compareeee!
        }
    );
    self._init()
        .then(() => {
            self.client.search({index, type, body: body.build('v2')}, (err, output) => {
                /* istanbul ignore if */
                if (err) return rej(core.errors.internal(err));
                const items = [];
                for (let i = 0; i < output.hits.hits.length; i++) {
                    const item = output.hits.hits[i]._source;
                    item._score = output.hits.hits[i]._score;
                    items.push(item);
                }
                res({
                    time: output.took / 1000,
                    items: items,
                    pagination: {
                        page: page,
                        itemsPerPage: itemsPerPage,
                        pages: Math.ceil((output.hits.total || 0) / itemsPerPage),
                        total: output.hits.total,
                        offset: (page - 1) * itemsPerPage,
                    },
                });
            });
        })
        .catch(rej);
});
