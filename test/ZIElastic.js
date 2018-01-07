'use strict';

describe('ZIElastic', () => {
    const elastic = new _ZIElastic();
    it('_checkVersion', (done) => {
        _expect(elastic.checkVersion).to.be.false;
        elastic._checkVersion()
            .then(() => {
                _expect(elastic.checkVersion).to.be.true;
                return elastic._checkVersion();
            })
            .then(done)
            .catch(done);
    });
    it('searchable', (done) => {
        const schema = {
                index: 'test',
                type: 'test',
                displayName: {original: 'Test'},
                attrs: {
                    _id: {type: 'String', common: '__id'},
                    name: {type: 'String', analyzer: 'standard'},
                },
            },
            test1 = elastic.searchable(schema),
            test2 = elastic.searchable(schema);
        _expect(test1 instanceof _Searchable).to.be.true;
        _expect(test2 instanceof _Searchable).to.be.true;
        done();
    });
    require('./search.js')();
});