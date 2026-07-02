import type { E2eUser, E2eUserName } from './e2e.types.js';

const env: Record<string, string | undefined> = globalThis.process?.env ?? {};

const TEST_USER_WITHOUT_GITHUB: E2eUser = {
  userName: 'test-user-without-github',
  email: env.TEST_USER_WITHOUT_GITHUB_EMAIL!,
  password: env.TEST_USER_WITHOUT_GITHUB_PASSWORD!,
  totpSecret: env.TEST_USER_WITHOUT_GITHUB_TOTP_SECRET,
};

const TEST_USER_WITH_GITHUB: E2eUser = {
  userName: 'test-user-with-github',
  email: env.TEST_USER_WITH_GITHUB_EMAIL!,
  password: env.TEST_USER_WITH_GITHUB_PASSWORD!,
  newTemporaryPassword: 'Y2aTev3JUiAdFx_Nk9eP!4UQiXdtvpr_oFa!Eahm',
};

const e2eTestUsers = new Map<E2eUserName, E2eUser>();
e2eTestUsers.set('test-user-without-github', TEST_USER_WITHOUT_GITHUB);
e2eTestUsers.set('test-user-with-github', TEST_USER_WITH_GITHUB);

export function getE2eUser(userName: E2eUserName): E2eUser {
  return e2eTestUsers.get(userName)!;
}

export function getAllE2eUsers(): Array<E2eUser> {
  return Array.from(e2eTestUsers.values());
}

/**
 * Hydrates the in-memory user map with the login state (oauth tokens / api token).
 *
 * Needed for Vitest node-e2e: `login()` runs in the `globalSetup` context, which is a
 * separate module graph from the test workers. The tokens it sets on the user objects are
 * passed to the workers via Vitest's `provide`/`inject`, and this function copies them
 * back onto the shared user objects so the e2e support code can read them lazily.
 */
export function hydrateE2eUsers(loginState: Record<E2eUserName, Partial<E2eUser>>): void {
  for (const [userName, state] of Object.entries(loginState)) {
    const user = e2eTestUsers.get(userName as E2eUserName);
    if (user != null) {
      Object.assign(user, state);
    }
  }
}

/**
 * Extracts the serializable login state of all users (tokens set by `login()`), suitable
 * for passing across Vitest's `provide`/`inject` boundary.
 */
export function getE2eUsersLoginState(): Record<string, Partial<E2eUser>> {
  const state: Record<string, Partial<E2eUser>> = {};
  for (const user of getAllE2eUsers()) {
    state[user.userName] = {
      oauthTokens: user.oauthTokens,
      apiToken: user.apiToken,
      apiTokenId: user.apiTokenId,
    };
  }
  return state;
}
