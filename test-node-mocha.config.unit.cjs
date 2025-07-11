const { defaultConfig } = require('./test/conf/test-node-mocha.config.default.cjs');

module.exports = defaultConfig(['test/unit/**/*.spec.js']);
