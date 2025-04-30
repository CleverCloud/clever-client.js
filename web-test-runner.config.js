import { defaultReporter, summaryReporter } from '@web/test-runner';
import { mockApiPlugin } from './test/lib/mock-api/support/mock-web-test-runner-plugin.js';

export default {
  files: ['test/**/*.spec.js', '!test/node/**/*.spec.js'],
  nodeResolve: true,
  reporters: [
    // mocha like report
    process.env.CI !== 'true' ? summaryReporter({ flatten: false }) : [],
    // report global tests progress
    defaultReporter({ reportTestResults: true, reportTestProgress: true }),
  ],
  plugins: [mockApiPlugin],
};
