import { CcApiClientOAuth } from '../src/api/cc-api-client-oauth.js';
import { CcApiClientToken } from '../src/api/cc-api-client-token.js';
import { GetSelfCommand } from '../src/api/commands/get-self-command.js';
import { CcAuthBackendClient } from '../src/auth-backend/cc-auth-backend-client.js';
import { CreateApiTokenCommand } from '../src/auth-backend/commands/create-api-token-command.js';
import { isCcHttpError } from '../src/lib/errors/cc-client-errors.js';
import { prompt } from './lib/prompt.js';

/**
 * @typedef {import('../src/lib/cc-client.js').CcClient} CcClient
 * @typedef {import('../src/types/auth.types.d.ts').OAuthTokens} OAuthTokens
 * @typedef {import('../src/types/request.types.d.ts').CcRequestConfig} CcRequestConfig
 * @typedef {import('../src/types/clever-client.types.d.ts').CcClientHooks} CcClientHooks
 */

/** @type {OAuthTokens} */
const oAuthTokens = {
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

/** @type {CcApiClientOAuth} */
const apiClient = new CcApiClientOAuth({ oAuthTokens, defaultRequestConfig, hooks });
/** @type {CcAuthBackendClient} */
const authBackendClient = new CcAuthBackendClient({ oAuthTokens, defaultRequestConfig, hooks });

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

async function run() {
  let userEmail;

  // -- get connected user email with oAuth v1 authentication method
  try {
    const commandResponse = await apiClient.send(new GetSelfCommand());
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
    const apiClientToken = new CcApiClientToken({ apiToken, defaultRequestConfig, hooks });
    console.log(`You are connected as ${(await apiClientToken.send(new GetSelfCommand())).email}`);
  } catch (e) {
    if (isCcHttpError(e) && e.response.status === 401) {
      console.log(`Invalid or expired api Token. Let's create a new one.`);
      apiToken = await askForNewApiToken(userEmail);
      const apiClientToken = new CcApiClientToken({ apiToken, defaultRequestConfig, hooks });
      console.log(`You are connected as ${(await apiClientToken.send(new GetSelfCommand())).email}`);
    } else {
      throw e;
    }
  }
}

//-- run ------

run()
  .then(() => {
    process.exit(0);
  })
  .catch(() => {
    process.exit(1);
  });
