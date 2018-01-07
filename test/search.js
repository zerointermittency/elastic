'use strict';

module.exports = () => {
    describe('search', () => {
        it('empty result', (done) => {
            _elastic.search(
                'asdf',
                {
                    client: 'asdf',
                    appgroup: 'asdf',
                    apps: ['asdf'],
                    accessgroups: ['asdf'],
                    _bodybuilder: {
                        'elasticsearch1:elasticsearch1': (body) => {
                            body.filter('term', '__id', 'asdf');
                            return;
                        },
                    },
                }
            )
                .then((result) => {
                    // console.log('#result', require('util').inspect(result, 0, 10, 1));
                    _expect(result.items).to.be.empty;
                    done();
                })
                .catch(done);
        });
        it('filter client', (done) => {
            _elastic.search('Name', {client: 'client1'})
                .then((result) => {
                    // console.log('#result', require('util').inspect(result, 0, 10, 1));
                    _expect(result.items.length).to.be.equal(9);
                    _expect(result.sections.length).to.be.equal(3);
                    done();
                })
                .catch(done);
        });
        it('priority', (done) => {
            _elastic.search('Name')
                .then((result) => {
                    // console.log('#result', require('util').inspect(result, 0, 10, 1));
                    _expect(result.items.length).to.be.equal(30);
                    _expect(result.sections.length).to.be.equal(3);
                    done();
                })
                .catch(done);
        });
        it('operator and/or', (done) => {
            _elastic.search('presidente juanito Perez', {operator: 'or'})
                .then((result) => {
                    // console.log('#result', require('util').inspect(result, 0, 10, 1));
                    _expect(result.items.length).to.be.equal(6);
                    _expect(result.sections.length).to.be.equal(3);
                    return Promise.resolve();
                })
                .then(() => _elastic.search('presidente juanito Perez', {operator: 'and'}))
                .then((result) => {
                    // console.log('#result', require('util').inspect(result, 0, 10, 1));
                    _expect(result.items.length).to.be.equal(3);
                    _expect(result.sections.length).to.be.equal(3);
                    done();
                })
                .catch(done);
        });
        it('fuzziness', (done) => {
            _elastic.search('Juanito Prz', {fuzziness: 2})
                .then((result) => {
                    // console.log('#result', require('util').inspect(items, 0, 10, 1));
                    _expect(result.items[0].__id).to.be.equal('1');
                    _expect(result.sections.length).to.be.equal(3);
                    return Promise.resolve();
                })
                .then(() => _elastic.search('Juanito Prz', {fuzziness: 1}))
                .then((result) => {
                    // console.log('#result', require('util').inspect(items, 0, 10, 1));
                    _expect(result.items.length).to.be.equal(0);
                    _expect(result.sections.length).to.be.equal(0);
                    done();
                })
                .catch(done);
        });
    });
};
