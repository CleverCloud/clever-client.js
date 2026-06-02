/**
 * @import {TestProjectConfiguration} from 'vitest/config'
 */

import { vitestPlugin as mockApiPlugin } from '@clevercloud/doublure/vitest';
import { playwright } from '@vitest/browser-playwright';
import { defaultExclude, defineConfig } from 'vitest/config';
// NB: this `import` keeps the `.js` specifier (NodeNext maps it to the `.ts` source when this
// config is loaded in Node). The `setupFiles` / `globalSetup` paths below, by contrast, must use
// `.ts` — they are served to the browser as literal URLs and browser mode does not remap `.js`→`.ts`.
import { e2eProxyPlugin } from './test/setup/e2e-proxy.browser.js';

/**
 * The same `*.spec.js` files run in both Node and the browser. `*.node.spec.js` and
 * `*.browser.spec.js` are escape hatches to restrict a spec to a single environment.
 */
const excludeForNode = [...defaultExclude, '**/*.browser.spec.{js,ts}'];
const excludeForBrowser = [...defaultExclude, '**/*.node.spec.{js,ts}'];

/**
 * Local-only escape hatch (can be set via mise) to run a single environment, e.g. from the WebStorm
 * gutter where Vitest runs every matching project with no `--project` flag — logging the e2e
 * users in once per environment. Unset => all projects, so CI and the `npm run test:*` scripts
 * (which pass explicit `--project` flags) are unaffected.
 *
 * @type {'browser' | 'node' | undefined}
 */
const TEST_RUNTIME = /** @type {'browser' | 'node' | undefined} */ (process.env.TEST_RUNTIME);
if (TEST_RUNTIME != null && TEST_RUNTIME !== 'node' && TEST_RUNTIME !== 'browser') {
  throw new Error(`Invalid env TEST_RUNTIME="${TEST_RUNTIME}": expected "node" or "browser" (or unset to run both).`);
}

/** @type {TestProjectConfiguration[]} */
const allProjects = [
  // ---------- UNIT ----------
  {
    test: {
      name: 'node-unit',
      environment: 'node',
      globals: true,
      setupFiles: ['./test/setup/vite-matchers.ts'],
      include: ['test/unit/**/*.spec.{js,ts}'],
      exclude: excludeForNode,
      // The browser-unit mock server / node mock servers are shared per run
      fileParallelism: false,
      maxConcurrency: 1,
    },
  },
  {
    plugins: [mockApiPlugin()],
    test: {
      name: 'browser-unit',
      globals: true,
      setupFiles: ['./test/setup/vite-matchers.ts'],
      include: ['test/unit/**/*.spec.{js,ts}'],
      exclude: excludeForBrowser,
      fileParallelism: false,
      maxConcurrency: 1,
      browser: { enabled: true, provider: playwright(), headless: true, instances: [{ browser: 'chromium' }] },
    },
  },
  // ---------- E2E ----------
  {
    test: {
      name: 'node-e2e',
      environment: 'node',
      globals: true,
      setupFiles: ['./test/setup/vite-matchers.ts', './test/setup/hydrate-users.node.ts'],
      globalSetup: ['./test/setup/global-setup.node.ts'],
      include: ['test/e2e/**/*.spec.{js,ts}'],
      exclude: excludeForNode,
      testTimeout: 30000,
      hookTimeout: 30000,
      fileParallelism: false,
      maxConcurrency: 1,
    },
  },
  {
    plugins: [e2eProxyPlugin()],
    test: {
      name: 'browser-e2e',
      globals: true,
      setupFiles: ['./test/setup/vite-matchers.ts'],
      include: ['test/e2e/**/*.spec.{js,ts}'],
      exclude: excludeForBrowser,
      testTimeout: 30000,
      hookTimeout: 30000,
      fileParallelism: false,
      maxConcurrency: 1,
      browser: { enabled: true, provider: playwright(), headless: true, instances: [{ browser: 'chromium' }] },
    },
  },
];

// When `TEST_RUNTIME` is set, keep only that runtime's projects (names start with the runtime,
// e.g. `node-e2e` / `browser-unit`). Unset => all projects.
const projects =
  TEST_RUNTIME == null
    ? allProjects
    : allProjects.filter(
        (project) =>
          typeof project === 'object' &&
          'test' in project &&
          typeof project.test?.name === 'string' &&
          project.test.name.startsWith(`${TEST_RUNTIME}-`),
      );

export default defineConfig({
  test: {
    projects,
  },
});
