import { defaultConfig } from './test/conf/test-browser-wtr.config.default.js';
import { mockApiPlugin } from './test/lib/mock-api/support/mock-web-test-runner-plugin.js';

export default {
  ...defaultConfig(['test/unit/**/*.spec.js']),
  plugins: [mockApiPlugin],
};
