'use strict';

module.exports = () => {
    it('_build', () => {
        const test = new _Searchable({
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
            }),
            obj = test._build({
                _id: '11',
                name: {
                    original: 'English Name',
                    es: 'Nombre en español',
                },
                otherPriority: 'otherPriority',
                start: '2017-11-02T19:41:31Z',
                client: 'client1',
                appgroup: 'appgroup1',
                apps: ['app1', 'app2', 'app3'],
                accessgroups: ['accessgroups1'],
            });
        _expect(obj.__id).to.be.equal('11');
        _expect(obj.__client).to.be.equal('client1');
        _expect(obj.__appgroup).to.be.equal('appgroup1');
        _expect(obj.__apps).to.include.members(['app1', 'app2', 'app3']);
        _expect(obj.__accessgroups).to.include.members(['accessgroups1']);
        _expect(obj.displayName.original).to.be.equal('Test');
        _expect(obj.deepLink).to.be.equal('/asdf/11');
        _expect(obj.innerObject.otherNotPriority).to.be.equal('otherNotPriority');
    });
};
