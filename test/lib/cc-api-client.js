import { CcApiClientOAuth } from '../../src/clients/api/cc-api-client-oauth.js';
import { CcApiClientToken } from '../../src/clients/api/cc-api-client-token.js';
import { CcApiClient } from '../../src/clients/api/cc-api-client.js';

const IS_NODE = globalThis.process != null;

export const DEFAULT_USER_TOKEN = IS_NODE ? globalThis.process.env.CC_TEST_API_TOKEN : null;
export const GITHUB_USER_TOKENS = IS_NODE
  ? {
      consumerKey: globalThis.process.env.OAUTH_CONSUMER_KEY,
      consumerSecret: globalThis.process.env.OAUTH_CONSUMER_SECRET,
      token: globalThis.process.env.CC_GITHUB_OAUTH_TOKEN,
      secret: globalThis.process.env.CC_GITHUB_OAUTH_SECRET,
    }
  : null;
// todo: move this const elsewhere
export const DEFAULT_OWNER_ID = IS_NODE ? globalThis.process.env.CC_TEST_OWNER_ID : null;

/**
 * @param {{debug?: boolean, auth?: 'NONE'|'DEFAULT'|'GITHUB'}} [options]
 * @returns {CcApiClient}
 */
export function getCcApiClient(options) {
  return createCcApiClient(options?.auth ?? 'DEFAULT', options?.debug ?? false);
}

/**
 * @param {'NONE'|'DEFAULT'|'GITHUB'} auth
 * @param {boolean} debug
 * @returns {CcApiClient}
 */
function createCcApiClient(auth, debug) {
  if (IS_NODE) {
    switch (auth) {
      case 'NONE':
        return new CcApiClient({
          defaultRequestConfig: { debug },
        });
      case 'DEFAULT':
        return new CcApiClientToken({
          apiToken: DEFAULT_USER_TOKEN,
          defaultRequestConfig: { debug },
        });
      case 'GITHUB':
        return new CcApiClientOAuth({
          oAuthTokens: GITHUB_USER_TOKENS,
          defaultRequestConfig: { debug },
        });
    }
  }

  switch (auth) {
    case 'NONE':
      return new CcApiClient({
        baseUrl: '/cc-api-none',
        defaultRequestConfig: { debug },
      });
    case 'DEFAULT':
      return new CcApiClient({
        baseUrl: '/cc-api-default',
        defaultRequestConfig: { debug },
      });
    case 'GITHUB':
      return new CcApiClient({
        baseUrl: '/cc-api-github',
        defaultRequestConfig: { debug },
      });
  }
}
