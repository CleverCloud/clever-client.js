import { getE2eUsersLoginState } from '../lib/e2e-test-users.js';
import { login, logout } from '../lib/login.js';

/**
 * Vitest global setup for node e2e tests. Replaces the former Mocha root hook
 * (`mochaHooks.beforeAll = login` / `afterAll = logout`).
 *
 * Why `globalSetup` and not `setupFiles`?
 * We want login-once / logout-once for the whole node-e2e run. `globalSetup` runs exactly
 * once, before any worker starts (and `teardown` once, after the last worker finishes).
 * `setupFiles`, by contrast, runs inside every test worker, which would log every test user
 * in (and out) repeatedly — slower, and a good way to trip auth rate limits.
 *
 * The catch: the process boundary.
 * `globalSetup` executes in its OWN module context, isolated from the test workers. Each
 * worker imports its own fresh copy of the `e2eTestUsers` map (see `../lib/e2e-test-users.js`),
 * so the oauth/api tokens that `login()` writes onto the user objects HERE are invisible to
 * the workers — their copy of the map still has empty tokens.
 *
 * The bridge: `provide` / `inject`.
 * Vitest's `provide(key, value)` is the sanctioned way to push data across that boundary, but
 * the value must be serializable. So instead of handing over the whole (non-serializable) user
 * objects, `getE2eUsersLoginState()` extracts just the plain token fields. Each worker then
 * reads them back with `inject('e2eUsers')` and re-hydrates its own user map — see the matching
 * setup file `./hydrate-users.node.js`. Without this hand-off, every node-e2e request would go
 * out unauthenticated (401).
 *
 * @param {{ provide: <K extends keyof import('vitest').ProvidedContext>(key: K, value: import('vitest').ProvidedContext[K]) => void }} ctx
 */
export async function setup({ provide }) {
  // Authenticate all e2e users once; tokens land on the user objects in this module context.
  await login();
  // Serialize just the tokens and hand them to the workers (they can't see the objects above).
  provide('e2eUsers', getE2eUsersLoginState());
}

export async function teardown() {
  // Runs once after the whole node-e2e run: revoke/clean up the sessions opened by `login()`.
  await logout();
}
