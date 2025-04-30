/**
 * @import { E2eUserName, E2eUser } from './e2e.types.js'
 */

/** @type {E2eUser} */
const TEST_USER_WITHOUT_GITHUB = {
  userName: 'test-user-without-github',
  apiToken: globalThis.process?.env.TEST_USER_WITHOUT_GITHUB_API_TOKEN,
  oauthTokens: {
    consumerKey: globalThis.process?.env.OAUTH_CONSUMER_KEY,
    consumerSecret: globalThis.process?.env.OAUTH_CONSUMER_SECRET,
    token: globalThis.process?.env.TEST_USER_WITHOUT_GITHUB_OAUTH_TOKEN,
    secret: globalThis.process?.env.TEST_USER_WITHOUT_GITHUB_OAUTH_SECRET,
  },
};

/** @type {E2eUser} */
const TEST_USER_WITH_GITHUB = {
  userName: 'test-user-with-github',
  apiToken: globalThis.process?.env.TEST_USER_WITH_GITHUB_API_TOKEN,
  oauthTokens: {
    consumerKey: globalThis.process?.env.OAUTH_CONSUMER_KEY,
    consumerSecret: globalThis.process?.env.OAUTH_CONSUMER_SECRET,
    token: globalThis.process?.env.TEST_USER_WITH_GITHUB_OAUTH_TOKEN,
    secret: globalThis.process?.env.TEST_USER_WITH_GITHUB_OAUTH_SECRET,
  },
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
