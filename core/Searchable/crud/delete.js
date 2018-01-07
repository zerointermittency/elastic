'use strict';

const core = {
    errors: require('./../../errors.js'),
};

module.exports = (self, __id) => new Promise((res, rej) => {
    const {index, type} = self;
    self._init().then(() => {
        self.client.delete({
            index: index, type: type, id: __id,
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