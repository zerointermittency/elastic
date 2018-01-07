'use strict';

const Mocha = require('mocha'),
    mocha = new Mocha({reporter: process.env.REPORTER || 'spec'}),
    Path = require('wrapper-path'),
    path = new Path(`${__dirname}/../`),
    seed = require('./seed.js'),
    schemas = require('./schemas.js'),
    waterfall = require('@zerointermittency/utils/flow/waterfall.js');

global._path = path;
global._expect = require('chai').expect;
global._assert = require('chai').assert;
global._stdout = require('test-console').stdout;
global._ZIDate = require('@zerointermittency/date');
global._ZIMongo = require('@zerointermittency/mongo');
global._elasticsearch = require('elasticsearch');
global._ZIElastic = require('../ZIElastic.js');
global._Searchable = require('../core/Searchable');
global._elastic = new _ZIElastic({
    host: 'http://localhost:9200',
});
_elastic.searchable(schemas.elasticsearch1);
_elastic.searchable(schemas.elasticsearch2);
_elastic.searchable(schemas.searchablesearch);

const functions = [
    (cb) => {
        _elastic.client.indices.delete({index: 'elasticsearch1'}, (err) => {
            if (err && err.status !== 404) return cb(err);
            _elastic.client.indices.delete({index: 'elasticsearch2'}, (err) => {
                if (err && err.status !== 404) return cb(err);
                cb(null);
            });
        });
    },
    (cb) => {
        const test = _elastic._searchables['elasticsearch1:elasticsearch1'];
        _expect(test.init).to.be.false;
        test._init().then(() => {
            _expect(test.init).to.be.true;
            const {index, type} = test,
                add = [],
                seedTest = [].concat(seed);
            for (let i = seedTest.length - 1; i >= 0; i--) {
                seedTest[i] = test._build(seedTest[i]);
                add.push({index: {_index: index, _type: type, _id: seedTest[i].__id}});
                add.push(seedTest[i]);
            }
            _elastic.client.bulk({body: add}, (err) => {
                if (err) return cb(err);
                setTimeout(function() {cb(null);}, 3000);

            });
        }).catch(cb);
    },
    (cb) => {
        const test = _elastic._searchables['elasticsearch2:elasticsearch2'];
        _expect(test.init).to.be.false;
        test._init().then(() => {
            _expect(test.init).to.be.true;
            const {index, type} = test,
                add = [],
                seedTest = [].concat(seed);
            for (let i = seedTest.length - 1; i >= 0; i--) {
                seedTest[i] = test._build(seedTest[i]);
                add.push({index: {_index: index, _type: type, _id: seedTest[i].__id}});
                add.push(seedTest[i]);
            }
            _elastic.client.bulk({body: add}, (err) => {
                if (err) return cb(err);
                setTimeout(function() {cb(null);}, 3000);
            });
        }).catch(cb);
    },
    (cb) => {
        const test = _elastic._searchables['searchablesearch:searchablesearch'];
        _expect(test.init).to.be.false;
        test._init().then(() => {
            _expect(test.init).to.be.true;
            const {index, type} = test,
                add = [],
                seedTest = [].concat(seed);
            for (let i = seedTest.length - 1; i >= 0; i--) {
                seedTest[i] = test._build(seedTest[i]);
                add.push({index: {_index: index, _type: type, _id: seedTest[i].__id}});
                add.push(seedTest[i]);
            }
            _elastic.client.bulk({body: add}, (err) => {
                if (err) return cb(err);
                setTimeout(function() {cb(null);}, 3000);
            });
        }).catch(cb);
    },
];

waterfall(functions, (err) => {
    /* istanbul ignore if */
    if (err) throw err;
    // @n: para que se encuentren los elementos y haya terminado de indexar elastic
    setTimeout(() => {
        const files = path.recursive.files('/test/', {exclude: /test\/index.js$/g});
        for (let i = files.length - 1; i >= 0; i--)  mocha.addFile(files[i]);
        mocha.run(() => process.exit());
    }, 3000);
});