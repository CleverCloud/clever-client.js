const { defaultConfig } = require('./test/conf/test-node-mocha.config.default.cjs');

module.exports = defaultConfig(['test/e2e/**/*.spec.js']);
