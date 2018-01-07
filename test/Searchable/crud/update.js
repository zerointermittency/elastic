'use strict';

module.exports = () => {
    describe('update', () => {
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
            },
            test = new _Searchable(schema, client);
        before((done) => {
            test.crud.create({
                _id: 'update',
                name: {
                    original: 'English Name',
                    es: 'Nombre en español',
                },
                description: {
                    original: 'English Name',
                    es: 'Nombre en español',
                },
                images: [{
                    _id: 'update',
                    type: 'backdrop',
                }],
                videos: [{
                    _id: 'update',
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
                    _expect(response._id).to.be.equal('update');
                    _expect(response.created).to.be.true;
                    return test._init();
                })
                .then(done)
                .catch(done);
        });
        it('success', function(done) {
            this.timeout(5000);
            test.crud.update({_id: 'update', name: {original: 'English'}})
                .then((output) => {
                    // console.log('#output', require('util').inspect(output, 0, 10, 1));
                    _expect(output.result).to.be.equal('updated');
                    return test._init();
                })
                .then(() => test.crud.read('update'))
                .then((output) => {
                    // console.log('#output', require('util').inspect(output, 0, 10, 1));
                    _expect(output._id).to.be.equal('update');
                    _expect(output._source.__id).to.be.equal('update');
                    return test._init();
                })
                .then(done)
                .catch(done);
        });
        it('notFound', function(done) {
            this.timeout(5000);
            test.crud.update({_id: 'foo-bar', name: {original: 'English'}})
                .catch((err) => {
                    _expect(err.name).to.be.equal('notFound');
                    _expect(err.extra.status).to.be.equal(404);
                    _expect(err.extra.path).to.be.equal('/test/test/foo-bar/_update');
                    done();
                });
        });
    });
};