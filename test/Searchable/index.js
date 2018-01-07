'use strict';

describe('Searchable', () => {
    it('instanceof', () => {
        const test = new _Searchable({
            index: 'test',
            type: 'test',
            displayName: {original: 'Test'},
            attrs: {
                _id: {type: 'String', common: '__id'},
                name: {type: 'String', analyzer: 'standard'},
            },
        });
        _expect(test.index).to.be.equal('test');
        _expect(test.type).to.be.equal('test');
        _expect(test.deepLink).to.be.equal('/test/{{_id}}');
        _expect(test instanceof _Searchable).to.be.true;
    });
    it('mapping', () => {
        const test = new _Searchable({
                index: 'test',
                type: 'test',
                displayName: {original: 'Test'},
                attrs: {
                    _id: {common: '__id'},
                    name: {type: 'LocalizableString', analyzer: 'standard'},
                    available: {type: 'Available'},
                    other: {
                        create: {type: 'Date'},
                    },
                },
            }),
            mapping = test.mapping;
        _expect(mapping.properties.__id).to.be.include({type: 'string', index: 'not_analyzed'});
        _expect(mapping.properties.__client).to.be.include({type: 'string', index: 'not_analyzed'});
        _expect(mapping.properties.innerObject.properties._id)
            .to.be.include({type: 'string'});
        _expect(mapping.properties.innerObject.properties.name.properties.original)
            .to.be.include({type: 'string', analyzer: 'standard'});
        _expect(mapping.properties.innerObject.properties.available.properties.from)
            .to.be.include({type: 'date', format: 'yyyy-MM-dd\'T\'HH:mm:ss\'Z\'||epoch_millis'});
        _expect(mapping.properties.innerObject.properties.other.properties.create)
            .to.be.include({type: 'date', format: 'yyyy-MM-dd\'T\'HH:mm:ss\'Z\'||epoch_millis'});
    });
    it('props', () => {
        const test = new _Searchable({
                index: 'test',
                type: 'test',
                displayName: {original: 'Test'},
                attrs: {
                    _id: {type: 'String', common: '__id'},
                    name: {
                        type: 'LocalizableString', common: 'title',
                        analyzer: 'standard', priority: 1,
                    },
                    otherPriority: {type: 'String', analyzer: 'standard', priority: 2},
                    otherNotPriority: {type: 'String', analyzer: 'standard', nil: 'otherNotPriority'},
                },
            }),
            props = test.props;
        _expect(props.nil[0][0]).to.be.equal('otherNotPriority');
        _expect(props.nil[0][1]).to.be.equal('otherNotPriority');
        _expect(props.commons.__id).to.be.equal('_id');
        _expect(props.commons.title).to.be.equal('name');
        _expect(props.searchables()).to.include.members([
            'innerObject.otherNotPriority', 'innerObject.otherPriority^2',
            'innerObject.name.original^1',
        ]);
        _expect(props.searchables('zn')).to.include.members([
            'innerObject.otherNotPriority', 'innerObject.otherPriority^2',
            'innerObject.name.zn^1',
        ]);
    });
    require('./_build.js')();
    require('./_init.js')();
    require('./crud')();
    require('./search.js')();
});