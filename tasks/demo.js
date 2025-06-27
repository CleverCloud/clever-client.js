import { CcApiClient } from '../src/clients/api/cc-api-client.js';
import { GetProfileCommand } from '../src/clients/api/commands/profile/get-profile-command.js';
import { CcAuthBackendClient } from '../src/clients/auth-backend/cc-auth-backend-client.js';
import { CreateApiTokenCommand } from '../src/clients/auth-backend/commands/api-token/create-api-token-command.js';
import { isCcHttpError } from '../src/lib/error/cc-client-errors.js';
import { prompt } from './lib/prompt.js';

/**
 * @import { OauthTokens } from '../src/types/auth.types.js'
 * @import { CcRequestConfig } from '../src/types/request.types.js'
 * @import { CcClientHooks } from '../src/types/client.types.js'
 */

/** @type {OauthTokens} */
const oauthTokens = {
  consumerKey: process.env.OAUTH_CONSUMER_KEY,
  consumerSecret: process.env.OAUTH_CONSUMER_SECRET,
  token: process.env.API_OAUTH_TOKEN,
  secret: process.env.API_OAUTH_TOKEN_SECRET,
};

const apiTokenFromEnv = process.env.CC_API_TOKEN;

/**
 * @type {Partial<CcRequestConfig>}
 */
const defaultRequestConfig = {
  debug: false,
  timeout: 10_000,
  cacheDelay: 5_000,
};

/**
 * @type {CcClientHooks}
 */
const hooks = {
  onResponse: (response) => {
    if (response.status === 401) {
      console.error('UNAUTHORIZED !!!');
      // logout!!
    }
  },
  onError: (error) => {
    if (!isCcHttpError(error)) {
      console.log('Something went wrong', error);
    }
  },
};

/** @type {CcApiClient} */
const apiClient = new CcApiClient({
  defaultRequestConfig,
  hooks,
  authMethod: { type: 'oauth-v1-plaintext', oauthTokens },
});
/** @type {CcAuthBackendClient} */
const authBackendClient = new CcAuthBackendClient({
  // baseUrl: 'https://api-bridge.cleverapps.io',
  baseUrl: 'http://localhost:8080',
  oauthTokens,
  defaultRequestConfig,
  hooks,
});

/**
 * @param {string} [userEmail]
 * @returns {Promise<*>}
 */
async function askForNewApiToken(userEmail) {
  const email = userEmail ?? (await prompt('Email: '));
  const password = await prompt('Password: ', true);
  const mfaCode = await prompt('MFA: ', true);
  const token = await authBackendClient.send(
    new CreateApiTokenCommand({
      email,
      expirationDate: new Date(new Date().getTime() + 1000 * 60 * 60 * 24),
      name: 'Test token',
      password,
      mfaCode,
    }),
  );

  console.log(`New API token created: "${token.apiToken}"`);
  console.log('> Token will expire in 24 hours.');
  console.log(
    `> This is the last time we show it to you! Don't forget to store it into CC_API_TOKEN env var for later use.`,
  );

  return token.apiToken;
}

async function tokenDemo() {
  let userEmail;

  // -- get connected user email with oAuth v1 authentication method
  try {
    const commandResponse = await apiClient.send(new GetProfileCommand());
    userEmail = commandResponse.email;
    console.log(`You are connected as ${userEmail}`);
    console.log(`=> Let's switch to Clever Cloud APIs with API token instead of Oauth v1 ...`);
  } catch (e) {
    if (isCcHttpError(e) && e.response.status === 401) {
      console.log(`You are not connected`);
      console.log(`=> Let's try with API token instead ...`);
    } else {
      throw e;
    }
  }

  // -- get api token from env var or create it if needed
  let apiToken;
  if (apiTokenFromEnv?.length) {
    apiToken = apiTokenFromEnv;
    console.log(`I have found an API token in CC_API_TOKEN env var. Let's use it.`);
  } else {
    console.log(`No API token found  in CC_API_TOKEN env var. Let's create one.`);
    apiToken = await askForNewApiToken(userEmail);
  }

  // -- get connected user email with api token authentication method
  try {
    const apiClientToken = new CcApiClient({
      defaultRequestConfig,
      hooks,
      authMethod: { type: 'api-token', apiToken },
    });
    console.log(`You are connected as ${(await apiClientToken.send(new GetProfileCommand())).email}`);
  } catch (e) {
    if (isCcHttpError(e) && e.response.status === 401) {
      console.log(`Invalid or expired api Token. Let's create a new one.`);
      apiToken = await askForNewApiToken(userEmail);
      const apiClientToken = new CcApiClient({
        defaultRequestConfig,
        hooks,
        authMethod: { type: 'api-token', apiToken },
      });
      console.log(`You are connected as ${(await apiClientToken.send(new GetProfileCommand())).email}`);
    } else {
      throw e;
    }
  }
}

async function run() {
  await askForNewApiToken('frontend-ci+github@clever-cloud.com');
  // await tokenDemo();
}

//-- run ------

run()
  .then(() => {
    process.exit(0);
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
