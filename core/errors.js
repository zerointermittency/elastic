'use strict';

const ZIError = require('@zerointermittency/error');

class ElasticError extends ZIError {

    constructor(opts) {
        opts.prefix = 'zi-elastic';
        super(opts);
    }

}

module.exports = {
    internal: (extra) => new ElasticError({
        code: 100,
        name: 'internal',
        message: 'Internal error',
        level: ZIError.level.fatal,
        extra: extra,
    }),
    validation: (extra) => new ElasticError({
        code: 101,
        name: 'validation',
        message: 'Validation error',
        level: ZIError.level.error,
        extra: extra,
    }),
    unsuportedVersion: (version) => new ElasticError({
        code: 102,
        name: 'unsuportedVersion',
        message: `unsuported version ${version}`,
        level: ZIError.level.fatal,
    }),
    notFound: (path, extra) => new ElasticError({
        code: 103,
        name: 'notFound',
        message: `Not found ${path}`,
        level: ZIError.level.fatal,
        extra: extra,
    }),
};