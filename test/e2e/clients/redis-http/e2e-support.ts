import { CcApiClient } from '../../../../src/clients/cc-api/cc-api-client.js';
import { GetEnvironmentCommand } from '../../../../src/clients/cc-api/commands/environment/get-environment-command.js';
import { CmdSendCommand } from '../../../../src/clients/redis-http/commands/cmd/cmd-send-command.js';
import { RedisHttpClient } from '../../../../src/clients/redis-http/redis-http-client.js';
import { isCcClientError } from '../../../../src/utils/error-utils.js';
import { Polling } from '../../../../src/utils/polling.js';
import { getE2eUser } from '../../../lib/e2e-test-users.js';

const IS_NODE = globalThis.process != null;
const USER = getE2eUser('test-user-without-github');
const USE_LOCAL_HTTP_REDIS = false;

const REDIS_ADDON_ID = 'addon_dc54e2c9-3114-48b4-bdfc-53c34a01935b';

export function e2eSupport(config?: { debug?: boolean }) {
  const conf = {
    ...{ user: USER.userName, debug: false },
    ...(config ?? {}),
  };
  let ccApiClient: CcApiClient;
  let client: RedisHttpClient;

  return {
    isNode: IS_NODE,
    get client() {
      return client;
    },
    async prepare() {
      ccApiClient = new CcApiClient({
        baseUrl: IS_NODE ? null : `/cc-api-${USER.userName}-api-token`,
        authMethod: {
          type: 'api-token',
          apiToken: USER.apiToken,
        },
      });

      const environment = await ccApiClient.send(new GetEnvironmentCommand({ addonId: REDIS_ADDON_ID }));
      const backendUrl = environment.environment.find((e) => e.name === 'REDIS_URL').value;

      client = createRedisHttpClient(backendUrl, conf.debug);

      // make sure redis is ready
      console.log('Waiting for redis addon to be ready...');
      await new Polling(
        async () => {
          try {
            console.log('-> sending PING command to redis...');
            const ping = await client.send(new CmdSendCommand({ command: 'PING' }));
            if (ping.result === 'PONG') {
              console.log('-> ready');
              return { stop: true, value: ping.result };
            } else {
              console.log(`-> not ready yet (PING result: ${String(ping.result)})`);
              return { stop: false };
            }
          } catch (e) {
            if (isCcClientError(e)) {
              console.log(`-> not ready yet (error: ${e.message})`);
            } else {
              console.log(`-> not ready yet (error)`, e);
            }
            return { stop: false };
          }
        },
        1000,
        5000,
      ).start();
    },
    async cleanup() {
      await client.send(new CmdSendCommand({ command: 'FLUSHDB', args: ['SYNC'] }));
    },
  };
}

function createRedisHttpClient(backendUrl: string, debug: boolean): RedisHttpClient {
  const defaultRequestConfig = { debug };

  return new RedisHttpClient({
    defaultRequestConfig,
    baseUrl: getBaseUrl(),
    backendUrl,
  });
}

function getBaseUrl(): string | null {
  if (IS_NODE) {
    if (USE_LOCAL_HTTP_REDIS) {
      return 'http://localhost:8080';
    }
    return null;
  }
  // if running in browser, we use the proxified URLs
  return `/redis-http`;
}
