'use strict';

const core = {
        errors: require('../errors.js'),
    },
    waterfall = require('@zerointermittency/utils/flow/waterfall.js');

module.exports = (self) => new Promise((res, rej) => {
    if (self.init) return res();
    const {index, type} = self,
        functions = [
            (cb) => {
                self.client.indices.exists({index: index}, (err, exists) => {
                    /* istanbul ignore if */
                    if (err) return cb(err);
                    if (exists) return cb(null);
                    self.client.indices.create({index: index}, (err) => {
                        /* istanbul ignore if */
                        if (err) return cb(err);
                        cb(null);
                    });
                });
            },
            (cb) => {
                self.client.indices.existsType(
                    {index: index, type: type},
                    (err, exists) => {
                        /* istanbul ignore if */
                        if (err) return rej(err);
                        if (!exists) {
                            self.client.indices.putMapping(
                                {
                                    index: index, type: type,
                                    body: self.mapping,
                                },
                                (err) => {
                                    /* istanbul ignore if */
                                    if (err) return cb(err);
                                    cb(null);
                                }
                            );
                        } else cb(null);
                    }
                );
            },
        ];
    waterfall(functions, (err) => {
        /* istanbul ignore if */
        if (err) return rej(core.errors.internal(err));
        self.init = true;
        res();
    });
});