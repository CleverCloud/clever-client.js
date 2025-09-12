/**
 * @import { CcApiCompositeCommand, CcApiSimpleCommand, CcApiStreamCommand } from './lib/cc-api-command.js'
 * @import { CcApiType, CcApiClientConfig } from './types/cc-api.types.js'
 * @import { IdResolve, AddonIdResolve } from './types/resource-id-resolver.types.js';
 * @import { CcAuth } from '../../lib/auth/cc-auth.js'
 * @import { CcRequestConfigPartial } from '../../types/request.types.js'
 */
import { CcAuthApiToken } from '../../lib/auth/cc-auth-api-token.js';
import { CcAuthOauthV1Plaintext } from '../../lib/auth/cc-auth-oauth-v1-plaintext.js';
import { CcClient } from '../../lib/cc-client.js';
import { SimpleCommand } from '../../lib/command/command.js';
import { CcClientError } from '../../lib/error/cc-client-errors.js';
import { merge } from '../../lib/utils.js';
import { ResourceIdResolver } from './lib/resource-id-resolver.js';
import { MemoryStore } from './lib/store/memory-store.js';

/**
 * Clever Cloud API client implementation.
 * Extends the base CcClient with specific handling for resource ID resolution
 * and authentication methods (OAuth v1 PLAINTEXT and API tokens).
 *
 * @extends {CcClient<CcApiType>}
 *
 * @example
 * // Create client with OAuth authentication
 * const client = new CcApiClient({
 *   authMethod: {
 *     type: 'oauth-v1',
 *     oauthTokens: { consumerKey: 'key', consumerSecret: 'secret' }
 *   }
 * });
 *
 * // Create client with API token authentication
 * const client = new CcApiClient({
 *   authMethod: {
 *     type: 'api-token',
 *     apiToken: 'your-token'
 *   }
 * });
 *
 * // Send a command
 * const result = await client.send(new GetApplicationCommand('app_123'));
 */
export class CcApiClient extends CcClient {
  /**
   * Resource ID resolver for translating between different ID formats
   * @type {ResourceIdResolver}
   */
  #resourceIdResolver;

  /**
   * Creates a new Clever Cloud API client instance
   *
   * @param {CcApiClientConfig} [config] - Client configuration including auth method and optional settings
   */
  constructor(config) {
    super(merge({ baseUrl: getBaseUrl(config) }, config), getAuth(config));

    this.#resourceIdResolver = new ResourceIdResolver(this, config.resourceIdResolverStore ?? new MemoryStore());
  }

  /**
   * Transforms command parameters by resolving resource IDs.
   * This method is called before sending a command to resolve any resource IDs
   * (owner IDs, addon IDs) to their proper format.
   *
   * @param {CcApiSimpleCommand<?, ?> | CcApiCompositeCommand<?, ?>} command - The command being sent
   * @param {CcRequestConfigPartial} [requestConfig] - Optional request configuration
   * @returns {Promise<any>} The transformed command parameters
   * @protected
   */
  async _transformCommandParams(command, requestConfig) {
    return this.#transformParams(command.params, command.getIdsToResolve(), requestConfig);
  }

  /**
   * Transforms command parameters by resolving resource IDs.
   * This method is called before sending a stream command to resolve any resource IDs
   * (owner IDs, addon IDs) to their proper format.
   *
   * @param {CcApiStreamCommand<?, ?>} command - The command being sent
   * @param {CcRequestConfigPartial} [requestConfig] - Optional request configuration
   * @returns {Promise<any>} The transformed command parameters
   * @protected
   */
  async _transformStreamParams(command, requestConfig) {
    return this.#transformParams(command.params, command.getIdsToResolve(), requestConfig);
  }

  /**
   * Sends a command to the API with special handling for resource resolution errors.
   * If a command fails due to resource ID resolution but defines a 404 empty response policy,
   * returns the empty value instead of throwing.
   *
   * @type {CcClient<CcApiType>['send']}
   *
   * @example
   * // Command with empty response policy for 404
   * const result = await client.send(new GetApplicationCommand('app_123'));
   * // Returns null if app doesn't exist, instead of throwing
   */
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

  /**
   *
   * @param {any} params
   * @param {IdResolve} idsToResolve
   * @param {CcRequestConfigPartial} [requestConfig] - Optional request configuration
   * @returns {Promise<any>}
   */
  async #transformParams(params, idsToResolve, requestConfig) {
    if (idsToResolve == null) {
      return params;
    }

    /** @type {{ownerId?: string, addonId?: string}} */
    const resolvedIds = {};

    if (idsToResolve.ownerId) {
      resolvedIds.ownerId = await this.#resourceIdResolver.resolveOwnerId(params, requestConfig);
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
        params[addonIdResolve.property],
        addonIdResolve.type,
        requestConfig,
      );
    }

    return { ...params, ...resolvedIds };
  }
}

/**
 * Determines the API base URL based on the authentication method.
 * Uses the bridge URL for API token auth and the main API URL for OAuth.
 *
 * @param {CcApiClientConfig} config - Client configuration
 * @returns {string} The base URL for API requests
 */
function getBaseUrl(config) {
  if (config?.authMethod == null || config.authMethod.type === 'oauth-v1') {
    return 'https://api.clever-cloud.com';
  }
  if (config.authMethod.type === 'api-token') {
    return 'https://api-bridge.clever-cloud.com';
  }
}

/**
 * Creates the appropriate authentication handler based on the config.
 * Supports OAuth v1 PLAINTEXT and API token authentication methods.
 *
 * @param {CcApiClientConfig} config - Client configuration
 * @returns {CcAuth|null} Authentication handler or null if no auth method specified
 */
function getAuth(config) {
  if (config?.authMethod == null) {
    return null;
  }
  if (config.authMethod.type === 'oauth-v1') {
    return new CcAuthOauthV1Plaintext(config.authMethod.oauthTokens);
  }
  if (config.authMethod.type === 'api-token') {
    return new CcAuthApiToken(config.authMethod.apiToken);
  }
}
