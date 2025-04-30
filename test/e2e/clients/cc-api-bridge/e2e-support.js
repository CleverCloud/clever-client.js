/**
 * @import {OauthTokens} from '../../../../src/types/auth.types.js'
 */
import { use } from 'chai';
import { CcApiBridgeClient } from '../../../../src/clients/cc-api-bridge/cc-api-bridge-client.js';
import { deepEqualInAnyOrder } from '../../../lib/deep-equal-in-any-order/deep-equal-in-any-order.js';
import { getE2eUser } from '../../../lib/e2e-test-users.js';

/**
 * @typedef Auth
 * @type {'none'|'oauth-v1'}
 */

const IS_NODE = globalThis.process != null;
const USER = getE2eUser('test-user-with-github');
const USE_LOCAL_API_BRIDGE = false;

use(deepEqualInAnyOrder);

/**
 * @param {{debug?: boolean }} [config]
 */
export function e2eSupport(config) {
  const conf = {
    ...{ user: USER.userName, debug: false },
    ...(config ?? {}),
  };
  const clientForCreate = createApiBridgeClient('none', conf.debug);
  const client = createApiBridgeClient('oauth-v1', conf.debug);

  return {
    isNode: IS_NODE,
    get client() {
      return client;
    },
    get clientForCreate() {
      return clientForCreate;
    },
    get email() {
      return USER.email;
    },
    get password() {
      return USER.password;
    },
    async prepare() {},
    async cleanup() {},
  };
}

/**
 * @param {Auth} auth
 * @param {boolean} debug
 * @returns {CcApiBridgeClient}
 */
function createApiBridgeClient(auth, debug) {
  const defaultRequestConfig = { debug };

  return new CcApiBridgeClient({
    defaultRequestConfig,
    baseUrl: getBaseUrl(auth),
    oauthTokens: getAuth(auth),
  });
}

/**
 * @param {Auth} auth
 * @returns {string|null}
 */
function getBaseUrl(auth) {
  if (IS_NODE) {
    if (USE_LOCAL_API_BRIDGE) {
      return 'http://localhost:8080';
    }
    return null;
  }
  // if running in browser, we use the proxified URLs
  return `/cc-api-bridge-${USER.userName}-${auth}`;
}

/**
 * @param {Auth} auth
 * @returns {OauthTokens}
 */
function getAuth(auth) {
  // if running in browser, no auth (authentication will be done by the proxy)
  if (!IS_NODE || auth === 'none') {
    return null;
  }

  return USER.oauthTokens;
}
