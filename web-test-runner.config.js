import { defaultReporter, summaryReporter } from '@web/test-runner';

export default {
  files: [
    'test/**/*.spec.js',
    '!test/application-logs.spec.js',
  ],
  nodeResolve: true,
  reporters: [
    // mocha like report
    process.env.CI !== 'true' ? summaryReporter({ flatten: false }) : [],
    // report global tests progress
    defaultReporter({ reportTestResults: true, reportTestProgress: true }),
  ],
};
