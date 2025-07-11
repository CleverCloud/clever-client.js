import { defaultConfig } from './test/conf/test-browser-wtr.config.default.js';

export default {
  ...defaultConfig(['test/e2e/**/*.spec.js']),
  testFramework: {
    config: {
      ui: 'bdd',
      timeout: 10000,
      slow: 2000,
    },
  },
  testsFinishTimeout: 1000 * 60 * 10,
  middleware: [],
};
