'use strict';

const core = {
        errors: require('./errors.js'),
    },
    object = {
        get: require('@zerointermittency/utils/object/get.js'),
    };

module.exports = (self) => new Promise((res, rej) => {
    if (self.checkVersion) return res();
    self.client.info((err, info) => {
        /* istanbul ignore if */
        if (err) return rej(core.errors.internal(err));
        const version = object.get(info, 'version.number');
        /* istanbul ignore else */
        if (version.startsWith('5.6')) {
            self.checkVersion = true;
            return res();
        }
        /* istanbul ignore next */
        throw core.errors.unsuportedVersion(version);
    });
});