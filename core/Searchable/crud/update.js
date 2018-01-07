'use strict';

const core = {
    errors: require('./../../errors.js'),
};

module.exports = (self, obj) => new Promise((res, rej) => {
    const {index, type} = self;
    self._init().then(() => {
        obj = self._build(obj);
        self.client.update({
            index: index, type: type,
            id: obj.__id, body: {doc: obj},
        }, (err, response) => {
            if (err) {
                /* istanbul ignore else */
                if (err.displayName === 'NotFound')
                    return rej(core.errors.notFound(err.path, err));
                /* istanbul ignore next */
                return rej(core.errors.internal(err));
            }
            res(response);
        });
    }).catch(rej);
});