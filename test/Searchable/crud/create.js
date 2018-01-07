'use strict';

module.exports = () => {
    describe('create', () => {
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
        it('success', function(done) {
            this.timeout(5000);
            const test = new _Searchable(schema, client);
            test.crud.create({
                _id: 'create',
                name: {
                    original: 'English Name',
                    es: 'Nombre en español',
                },
                description: {
                    original: 'English Name',
                    es: 'Nombre en español',
                },
                images: [{
                    _id: 'create',
                    type: 'backdrop',
                }],
                videos: [{
                    _id: 'create',
                    name: {
                        original: 'English Name',
                        es: 'Nombre en español',
                    },
                    weight: 1,
                }],
                otherPriority: 'otherPriority',
                start: '2017-11-02T19:41:31Z',
                from: '2017-11-02T19:41:31Z',
                client: 'client1',
                appgroup: 'appgroup1',
                apps: ['app1', 'app2', 'app3'],
                accessgroups: ['accessgroups1'],
            })
                .then((response) => {
                    _expect(test.init).to.be.true;
                    _expect(response._id).to.be.equal('create');
                    _expect(response.created).to.be.true;
                    return test._init();
                })
                .then(done)
                .catch(done);
        });
        it('catch', function(done) {
            this.timeout(5000);
            const test = new _Searchable(schema, client);
            test.crud.create({
                _id: '1234567',
                name: 'English Name',
            })
                .then((response) => {
                    _expect(test.init).to.be.true;
                    _expect(response._id).to.be.equal('123457');
                    _expect(response.created).to.be.true;
                    return test._init();
                })
                .catch((err) => {
                    _expect(err.name).to.be.equal('internal');
                    _expect(err.extra.status).to.be.equal(400);
                    _expect(err.extra.message).to.be.equal(
                        '[mapper_parsing_exception] object mapping for [title] tried to parse field [title] as object, but found a concrete value'
                    );
                    done();
                });
        });
    });
};