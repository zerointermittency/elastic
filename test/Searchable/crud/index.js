'use strict';

module.exports = () => {
    describe('crud', () => {
        require('./create.js')();
        require('./read.js')();
        require('./update.js')();
        require('./delete.js')();
    });
};