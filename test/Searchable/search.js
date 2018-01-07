'use strict';

module.exports = () => {
    describe('search', () => {
        const test = _elastic._searchables['searchablesearch:searchablesearch'];
        it('empty result', (done) => {
            test.search(
                'asdf',
                {
                    client: 'asdf',
                    appgroup: 'asdf',
                    apps: ['asdf'],
                    accessgroups: ['asdf'],
                    _bodybuilder: (body) => {
                        body.filter('term', '__id', 'asdf');
                        return;
                    },
                }
            )
                .then((result) => {
                    _expect(result.items).to.be.empty;
                    done();
                })
                .catch(done);
        });
        it('filter client', (done) => {
            test.search('Name', {client: 'client1'})
                .then(({items, pagination}) => {
                    // console.log('#items', require('util').inspect(items, 0, 10, 1));
                    _expect(items.length).to.be.equal(3);
                    _expect(pagination.total).to.be.equal(3);
                    done();
                })
                .catch(done);
        });
        it('priority', (done) => {
            test.search('Name')
                .then(({items, pagination}) => {
                    _expect(items[0].__id).to.be.equal('1');
                    _expect(pagination.total).to.be.equal(10);
                    // console.log('#result', require('util').inspect(items, 0, 10, 1));
                    done();
                })
                .catch(done);
        });
        it('operator and/or', (done) => {
            test.search('presidente juanito Perez', {operator: 'or'})
                .then(({items, pagination}) => {
                    _expect(items.length).to.be.equal(2);
                    _expect(pagination.total).to.be.equal(2);
                    // console.log('#result', require('util').inspect(items, 0, 10, 1));
                    return Promise.resolve();
                })
                .then(() => test.search('presidente juanito Perez', {operator: 'and'}))
                .then(({items, pagination}) => {
                    _expect(items[0].__id).to.be.equal('1');
                    _expect(items.length).to.be.equal(1);
                    _expect(pagination.total).to.be.equal(1);
                    // console.log('#result', require('util').inspect(items, 0, 10, 1));
                    done();
                })
                .catch(done);
        });
        it('fuzziness', (done) => {
            test.search('Juanito Prz', {fuzziness: 2})
                .then(({items, pagination}) => {
                    _expect(items[0].__id).to.be.equal('1');
                    _expect(pagination.total).to.be.equal(2);
                    // console.log('#result', require('util').inspect(items, 0, 10, 1));
                    return Promise.resolve();
                })
                .then(() => test.search('Juanito Prz', {fuzziness: 1}))
                .then(({items, pagination}) => {
                    _expect(items.length).to.be.equal(0);
                    _expect(pagination.total).to.be.equal(0);
                    // console.log('#result', require('util').inspect(items, 0, 10, 1));
                    done();
                })
                .catch(done);
        });
    });
};
