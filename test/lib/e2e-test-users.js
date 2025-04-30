const TEST_USER_WITHOUT_GITHUB = {
  apiToken: globalThis.process?.env.TEST_USER_WITHOUT_GITHUB_API_TOKEN,
  oauthTokens: {
    consumerKey: globalThis.process?.env.OAUTH_CONSUMER_KEY,
    consumerSecret: globalThis.process?.env.OAUTH_CONSUMER_SECRET,
    token: globalThis.process?.env.TEST_USER_WITHOUT_GITHUB_OAUTH_TOKEN,
    secret: globalThis.process?.env.TEST_USER_WITHOUT_GITHUB_OAUTH_SECRET,
  },
};

const TEST_USER_WITH_GITHUB = {
  apiToken: globalThis.process?.env.TEST_USER_WITH_GITHUB_API_TOKEN,
  oauthTokens: {
    consumerKey: globalThis.process?.env.OAUTH_CONSUMER_KEY,
    consumerSecret: globalThis.process?.env.OAUTH_CONSUMER_SECRET,
    token: globalThis.process?.env.TEST_USER_WITH_GITHUB_OAUTH_TOKEN,
    secret: globalThis.process?.env.TEST_USER_WITH_GITHUB_OAUTH_SECRET,
  },
};

export const e2eTestUsers = new Map();
e2eTestUsers.set('test-user-without-github', TEST_USER_WITHOUT_GITHUB);
e2eTestUsers.set('test-user-with-github', TEST_USER_WITH_GITHUB);
