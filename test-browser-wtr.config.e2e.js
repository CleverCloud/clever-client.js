import { defaultConfig } from './test/conf/test-browser-wtr.config.default.js';

export default {
  ...defaultConfig(['test/e2e/**/*.spec.js']),
  middleware: [],
};
