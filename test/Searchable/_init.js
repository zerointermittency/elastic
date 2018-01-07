'use strict';

module.exports = () => {
    describe('_init', () => {
        const client = new _elasticsearch.Client({
                host: 'http://localhost:9200',
                apiVersion: '5.6',
            }),
            schema = {
                index: 'test',
                type: 'test',
                displayName: {original: 'Test'},
                deepLink: '/asdf/{{_id}}',
                attrs: {
                    _id: {type: 'String', common: '__id'},
                    name: {
                        type: 'LocalizableString', common: 'title',
                        analyzer: 'standard', priority: 1,
                    },
                    description: {
                        type: 'LocalizableString', common: 'description',
                        analyzer: 'standard', priority: 1,
                    },
                    images: {type: 'LocalizableString', common: 'images'},
                    videos: {type: 'LocalizableString', common: 'videos'},
                    otherPriority: {type: 'String', analyzer: 'standard', priority: 2},
                    otherNotPriority: {type: 'String', analyzer: 'standard', nil: 'otherNotPriority'},
                    start: {type: 'Date'},
                    from: {type: 'Date', common: 'from'},
                    client: {type: 'String', common: '__client'},
                    appgroup: {type: 'String', common: '__appgroup'},
                    apps: {type: 'String', common: '__apps'},
                    accessgroups: {type: 'String', common: '__accessgroups'},
                },
            };
        it('not Exist', function(done) {
            this.timeout(50000);
            client.indices.delete({index: schema.index}, (err) => {
                if (err) _expect(err.status).to.be.equal(404);
                const test = new _Searchable(schema, client);
                _expect(test.init).to.be.false;
                test._init()
                    .then(() => {
                        _expect(test.init).to.be.true;
                        return test._init();
                    })
                    .then(done)
                    .catch((err) => {
                        console.log('#err', require('util').inspect(err, 0, 10, 1));
                        done();
                    });
            });
        });
        it('already exist', function(done) {
            this.timeout(50000);
            const test = new _Searchable(schema, client);
            _expect(test.init).to.be.false;
            test._init()
                .then(() => {
                    _expect(test.init).to.be.true;
                    return test._init();
                })
                .then(done)
                .catch(done);
        });
    });
};
