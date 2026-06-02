/**
 * @import { E2eUserName, E2eUser } from './e2e.types.js'
 */

/** @type {E2eUser} */
const TEST_USER_WITHOUT_GITHUB = {
  userName: 'test-user-without-github',
  email: globalThis.process?.env.TEST_USER_WITHOUT_GITHUB_EMAIL,
  password: globalThis.process?.env.TEST_USER_WITHOUT_GITHUB_PASSWORD,
  totpSecret: globalThis.process?.env.TEST_USER_WITHOUT_GITHUB_TOTP_SECRET,
};

/** @type {E2eUser} */
const TEST_USER_WITH_GITHUB = {
  userName: 'test-user-with-github',
  email: globalThis.process?.env.TEST_USER_WITH_GITHUB_EMAIL,
  password: globalThis.process?.env.TEST_USER_WITH_GITHUB_PASSWORD,
  newTemporaryPassword: 'Y2aTev3JUiAdFx_Nk9eP!4UQiXdtvpr_oFa!Eahm',
};

/** @type {Map<E2eUserName, E2eUser>} */
const e2eTestUsers = new Map();
e2eTestUsers.set('test-user-without-github', TEST_USER_WITHOUT_GITHUB);
e2eTestUsers.set('test-user-with-github', TEST_USER_WITH_GITHUB);

/**
 * @param {E2eUserName} userName
 * @returns {E2eUser}
 */
export function getE2eUser(userName) {
  return e2eTestUsers.get(userName);
}

/**
 * @returns {E2eUser[]}
 */
export function getAllE2eUsers() {
  return Array.from(e2eTestUsers.values());
}

/**
 * Hydrates the in-memory user map with the login state (oauth tokens / api token).
 *
 * Needed for Vitest node-e2e: `login()` runs in the `globalSetup` context, which is a
 * separate module graph from the test workers. The tokens it sets on the user objects are
 * passed to the workers via Vitest's `provide`/`inject`, and this function copies them
 * back onto the shared user objects so the e2e support code can read them lazily.
 *
 * @param {Record<E2eUserName, Partial<E2eUser>>} loginState
 */
export function hydrateE2eUsers(loginState) {
  for (const [userName, state] of Object.entries(loginState)) {
    const user = e2eTestUsers.get(/** @type {E2eUserName} */ (userName));
    if (user != null) {
      Object.assign(user, state);
    }
  }
}

/**
 * Extracts the serializable login state of all users (tokens set by `login()`), suitable
 * for passing across Vitest's `provide`/`inject` boundary.
 *
 * @returns {Record<string, Partial<E2eUser>>}
 */
export function getE2eUsersLoginState() {
  /** @type {Record<string, Partial<E2eUser>>} */
  const state = {};
  for (const user of getAllE2eUsers()) {
    state[user.userName] = {
      oauthTokens: user.oauthTokens,
      apiToken: user.apiToken,
      apiTokenId: user.apiTokenId,
    };
  }
  return state;
}
