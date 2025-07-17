import { use } from 'chai';
import { CcApiClient } from '../../../../src/clients/cc-api/cc-api-client.js';
import { CreateAddonCommand } from '../../../../src/clients/cc-api/commands/addon/create-addon-command.js';
import { DeleteAddonCommand } from '../../../../src/clients/cc-api/commands/addon/delete-addon-command.js';
import { GetEnvironmentCommand } from '../../../../src/clients/cc-api/commands/environment/get-environment-command.js';
import { GetProfileCommand } from '../../../../src/clients/cc-api/commands/profile/get-profile-command.js';
import { CmdSendCommand } from '../../../../src/clients/redis-http/commands/cmd/cmd-send-command.js';
import { RedisHttpClient } from '../../../../src/clients/redis-http/redis-http-client.js';
import { Polling } from '../../../../src/lib/polling.js';
import { isCcClientError } from '../../../../src/utils/errors.js';
import { deepEqualInAnyOrder } from '../../../lib/deep-equal-in-any-order/deep-equal-in-any-order.js';
import { getE2eUser } from '../../../lib/e2e-test-users.js';

/**
 * @typedef Auth
 * @type {'none'|'oauth-v1'}
 */

const IS_NODE = globalThis.process != null;
const USER = getE2eUser('test-user-with-github');
const USE_LOCAL_HTTP_REDIS = false;

use(deepEqualInAnyOrder);

/**
 * @param {{debug?: boolean }} [config]
 */
export function e2eSupport(config) {
  const conf = {
    ...{ user: 'test-user-with-github', debug: false },
    ...(config ?? {}),
  };
  /** @type {CcApiClient} */
  let ccApiClient;
  /** @type {string} */
  let userId;
  /** @type {string} */
  let addonId;
  /** @type {RedisHttpClient} */
  let client;

  return {
    isNode: IS_NODE,
    get client() {
      return client;
    },
    async prepare() {
      ccApiClient = new CcApiClient({
        baseUrl: IS_NODE ? null : `/cc-api-test-user-with-github-api-token`,
        authMethod: {
          type: 'api-token',
          apiToken: USER.apiToken,
        },
      });

      const self = await ccApiClient.send(new GetProfileCommand());
      userId = self.id;

      const addon = await ccApiClient.send(
        new CreateAddonCommand({
          ownerId: userId,
          name: 'test-redis-addon',
          providerId: 'redis-addon',
          planId: 'plan_c62dd71e-15c3-483e-879d-75e4c836e21e',
          zone: 'par',
        }),
      );
      addonId = addon.id;

      const environment = await ccApiClient.send(
        new GetEnvironmentCommand({
          ownerId: userId,
          addonId: addon.id,
        }),
      );
      const backendUrl = environment.environment.find((e) => e.name === 'REDIS_URL').value;

      client = createRedisHttpClient(backendUrl, conf.debug);

      // make sure redis is ready
      console.log('waiting for redis addon to be ready...');
      await new Polling(
        async () => {
          try {
            console.log('-> checking');
            const ping = await client.send(new CmdSendCommand({ command: 'PING' }));
            if (ping.result === 'PONG') {
              console.log('-> ready');
              return { stop: true, value: ping.result };
            } else {
              console.log(`-> not ready yet (ping result: ${ping.result})`);
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
        30000,
      ).start();
    },
    async cleanup() {
      await ccApiClient.send(new DeleteAddonCommand({ ownerId: userId, addonId: addonId }));
    },
  };
}

/**
 * @param {string} backendUrl
 * @param {boolean} debug
 * @returns {RedisHttpClient}
 */
function createRedisHttpClient(backendUrl, debug) {
  const defaultRequestConfig = { debug };

  return new RedisHttpClient({
    defaultRequestConfig,
    baseUrl: getBaseUrl(),
    backendUrl,
  });
}

/**
 * @returns {string|null}
 */
function getBaseUrl() {
  if (IS_NODE) {
    if (USE_LOCAL_HTTP_REDIS) {
      return 'http://localhost:8080';
    }
    return null;
  }
  // if running in browser, we use the proxified URLs
  return `/redis-http`;
}
