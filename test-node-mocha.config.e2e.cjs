const { defaultConfig } = require('./test/conf/test-node-mocha.config.default.cjs');

module.exports = {
  ...defaultConfig(['test/e2e/**/*.spec.js']),
  timeout: 10000,
  slow: 2000,
};
