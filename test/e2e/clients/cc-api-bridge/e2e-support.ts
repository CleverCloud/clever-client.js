import { CcApiBridgeClient } from '../../../../src/clients/cc-api-bridge/cc-api-bridge-client.js';
import type { OauthTokens } from '../../../../src/types/auth.types.js';
import { getE2eUser } from '../../../lib/e2e-test-users.js';

type Auth = 'none' | 'oauth-v1';

const IS_NODE = globalThis.process != null;
const USER = getE2eUser('test-user-with-github');
const USE_LOCAL_API_BRIDGE = false;

export function e2eSupport(config?: { debug?: boolean }) {
  const conf = {
    ...{ user: USER.userName, debug: false },
    ...(config ?? {}),
  };
  const clientForCreate = createApiBridgeClient('none', conf.debug);
  let client: CcApiBridgeClient;

  return {
    isNode: IS_NODE,
    get client() {
      if (client == null) {
        client = createApiBridgeClient('oauth-v1', conf.debug);
      }
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

function createApiBridgeClient(auth: Auth, debug: boolean): CcApiBridgeClient {
  const defaultRequestConfig = { debug };

  return new CcApiBridgeClient({
    defaultRequestConfig,
    baseUrl: getBaseUrl(auth),
    oauthTokens: getAuth(auth),
  });
}

function getBaseUrl(auth: Auth): string | null {
  if (IS_NODE) {
    if (USE_LOCAL_API_BRIDGE) {
      return 'http://localhost:8080';
    }
    return null;
  }
  // if running in browser, we use the proxified URLs
  return `/cc-api-bridge-${USER.userName}-${auth}`;
}

function getAuth(auth: Auth): OauthTokens {
  // if running in browser, no auth (authentication will be done by the proxy)
  if (!IS_NODE || auth === 'none') {
    return null;
  }

  return USER.oauthTokens;
}
