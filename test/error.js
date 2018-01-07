'use strict';

describe('errors', () => {
    const errors = require('../core/errors.js');
    it('internal', () => {
        const e = errors.internal({msg: 'foo:bar'});
        _expect(e.code).to.be.equal(100);
        _expect(e.name).to.be.equal('internal');
        _expect(e.extra.msg).to.be.equal('foo:bar');
    });
    it('validation', () => {
        const e = errors.validation({msg: 'foo:bar'});
        _expect(e.code).to.be.equal(101);
        _expect(e.name).to.be.equal('validation');
        _expect(e.extra.msg).to.be.equal('foo:bar');
    });
    it('unsuportedVersion', () => {
        const e = errors.unsuportedVersion('6.0.0');
        // console.log('#e', require('util').inspect(e, 0, 10, 1));
        _expect(e.code).to.be.equal(102);
        _expect(e.name).to.be.equal('unsuportedVersion');
    });
});