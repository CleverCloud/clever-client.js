/**
 * @import { TestRunnerConfig } from '@web/test-runner';
 */
import { defaultReporter, summaryReporter } from '@web/test-runner';

/**
 * @param {Array<string>} include
 * @returns {TestRunnerConfig}
 */
export function defaultConfig(include) {
  return {
    files: [...include, '!test/**/*.node.spec.js'],
    // browsers: [
    //   chromeLauncher({
    //     launchOptions: {
    //       headless: false,
    //       devtools: true,
    //     },
    //   }),
    // ],
    testsFinishTimeout: 1000 * 60 * 20,
    nodeResolve: true,
    concurrency: 1,
    reporters: [
      // mocha like report
      process.env.CI !== 'true' ? summaryReporter({ flatten: false }) : null,
      // report global tests progress
      defaultReporter({ reportTestResults: true, reportTestProgress: true }),
    ].filter((o) => o != null),
  };
}
