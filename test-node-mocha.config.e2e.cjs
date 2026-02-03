const { defaultConfig } = require('./test/conf/test-node-mocha.config.default.cjs');

module.exports = {
  ...defaultConfig(['test/e2e/**/*.spec.js']),
  timeout: 30000,
  slow: 2000,
  require: 'test/e2e/mocha.hook.js',
};
