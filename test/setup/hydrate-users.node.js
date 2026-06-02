import { inject } from 'vitest';
import { hydrateE2eUsers } from '../lib/e2e-test-users.js';

/**
 * Node-e2e setup file (`setupFiles`), the worker-side half of the login hand-off.
 *
 * Background: `login()` runs in `./global-setup.node.js`, which executes in a separate module
 * context from the test workers. The oauth/api tokens it produces therefore never reach the
 * workers' own copy of the `e2eTestUsers` map — see the long explanation in that file.
 *
 * This file closes that gap. Because `setupFiles` runs inside EVERY worker, each worker reads
 * the serialized login state that global-setup published via `provide('e2eUsers', ...)`, then
 * `hydrateE2eUsers()` copies those tokens back onto the worker's in-memory user map. From then
 * on the e2e support code can read each user's oauth/api token and send authenticated requests.
 *
 * Without this step the workers' user objects keep their empty tokens and every node-e2e
 * request goes out unauthenticated (401).
 *
 * The `!= null` guard: `inject` returns `undefined` if global-setup never ran (e.g. a misconfig
 * or running this setup file outside the node-e2e project), so we skip hydration rather than
 * crash on a missing payload.
 */
const loginState = inject('e2eUsers');
if (loginState != null) {
  hydrateE2eUsers(loginState);
}
