/**
 * @import { CcApiCompositeCommand, CcApiSimpleCommand } from './lib/cc-api-command.js'
 * @import { CcApiType, CcApiClientConfig } from './types/cc-api.types.js'
 * @import { AddonIdResolve } from './types/resource-id-resolver.types.js';
 * @import { CcAuth } from '../../lib/auth/cc-auth.js'
 * @import { CcRequestConfig } from '../../types/request.types.js'
 */
import { CcAuthApiToken } from '../../lib/auth/cc-auth-api-token.js';
import { CcAuthOauthV1Plaintext } from '../../lib/auth/cc-auth-oauth-v1-plaintext.js';
import { CcClient } from '../../lib/cc-client.js';
import { SimpleCommand } from '../../lib/command/command.js';
import { CcClientError } from '../../lib/error/cc-client-errors.js';
import { omit } from '../../lib/utils.js';
import { ResourceIdResolver } from './lib/resource-id-resolver.js';
import { MemoryStore } from './lib/store/memory-store.js';

/**
 * @extends {CcClient<CcApiType>}
 */
export class CcApiClient extends CcClient {
  /** @type {ResourceIdResolver} */
  #resourceIdResolver;

  /**
   * @param {CcApiClientConfig} [config]
   */
  constructor(config) {
    super(
      {
        baseUrl: getBaseUrl(config),
        ...omit(config ?? {}, 'baseUrl'),
      },
      getAuth(config),
    );

    this.#resourceIdResolver = new ResourceIdResolver(this, config.resourceIdResolverStore ?? new MemoryStore());
  }

  /**
   * @param {CcApiSimpleCommand<?, ?> | CcApiCompositeCommand<?, ?>} command
   * @param {Partial<CcRequestConfig>} [requestConfig]
   * @returns {Promise<any>}
   * @protected
   */
  async _transformCommandParams(command, requestConfig) {
    /** @type {{ownerId?: string, addonId?: string}} */
    const resolvedIds = {};

    const idsToResolve = command.getIdsToResolve();

    if (idsToResolve == null) {
      return command.params;
    }

    if (idsToResolve.ownerId) {
      resolvedIds.ownerId = await this.#resourceIdResolver.resolveOwnerId(command.params, requestConfig);
    }

    if (idsToResolve.addonId != null) {
      /** @type {AddonIdResolve} */
      const addonIdResolve =
        typeof idsToResolve.addonId === 'string'
          ? {
              property: 'addonId',
              type: idsToResolve.addonId,
            }
          : idsToResolve.addonId;

      resolvedIds.addonId = await this.#resourceIdResolver.resolveAddonId(
        command.params[addonIdResolve.property],
        addonIdResolve.type,
        requestConfig,
      );
    }

    return { ...command.params, ...resolvedIds };
  }

  /** @type {CcClient<CcApiType>['send']} */
  async send(command, requestConfig) {
    try {
      return await super.send(command, requestConfig);
    } catch (e) {
      if (command instanceof SimpleCommand && e instanceof CcClientError && e.code === 'CANNOT_RESOLVE_RESOURCE_ID') {
        const emptyResponsePolicy = command.getEmptyResponsePolicy(404);
        if (emptyResponsePolicy?.isEmpty) {
          return emptyResponsePolicy.emptyValue ?? null;
        }
      }
      throw e;
    }
  }
}

/**
 * @param {CcApiClientConfig} config
 * @returns {string}
 */
function getBaseUrl(config) {
  if (config?.baseUrl != null) {
    return config.baseUrl;
  }

  if (config?.authMethod == null || config.authMethod.type === 'oauth-v1-plaintext') {
    return 'https://api.clever-cloud.com';
  }
  if (config.authMethod.type === 'api-token') {
    return 'https://api-bridge.clever-cloud.com';
  }
}

/**
 * @param {CcApiClientConfig} config
 * @returns {CcAuth|null}
 */
function getAuth(config) {
  if (config?.authMethod == null) {
    return null;
  }
  if (config.authMethod.type === 'oauth-v1-plaintext') {
    return new CcAuthOauthV1Plaintext(config.authMethod.oauthTokens);
  }
  if (config.authMethod.type === 'api-token') {
    return new CcAuthApiToken(config.authMethod.apiToken);
  }
}
