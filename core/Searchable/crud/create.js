'use strict';

const core = {
    errors: require('./../../errors.js'),
};

module.exports = (self, obj) => new Promise((res, rej) => {
    const {index, type} = self;
    self._init()
        .then(() => {
            obj = self._build(obj);
            self.client.create({
                index: index, type: type,
                id: obj.__id, body: obj,
            }, (err, response) => {
                if (err) return rej(core.errors.internal(err));
                res(response);
            });
        })
        .catch(rej);
});