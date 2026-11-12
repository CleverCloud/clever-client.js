import { CcAuthApiToken } from '../../lib/auth/cc-auth-api-token.js';
import { CcAuthOauthV1Plaintext } from '../../lib/auth/cc-auth-oauth-v1-plaintext.js';
import type { CcAuth } from '../../lib/auth/cc-auth.js';
import { CcClient } from '../../lib/cc-client.js';
import { getRequestSignal, merge } from '../../lib/utils.js';
import { CcApiParamsTransformer } from './lib/cc-api-params-transformer.js';
import { ResourceIdResolver } from './lib/resource-id-resolver.js';
import { MemoryStore } from './lib/store/memory-store.js';
import type { CcApiClientConfig, CcApiType } from './types/cc-api.types.js';
import type { ResourceIdIndex } from './types/resource-id-resolver.types.js';

/**
 * Clever Cloud API client implementation.
 * Extends the base CcClient with specific handling for resource ID resolution
 * and authentication methods (OAuth v1 PLAINTEXT and API tokens).
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
export class CcApiClient extends CcClient<CcApiType> {
  /**
   * Resource ID resolver for translating between different ID formats
   */
  #resourceIdResolver: ResourceIdResolver;

  /**
   * Creates a new Clever Cloud API client instance
   *
   * @param config - Client configuration including auth method and optional settings
   */
  constructor(config?: CcApiClientConfig) {
    super(
      merge({ baseUrl: getBaseUrl(config) }, config),
      getAuth(config),
      // the resolver needs the client to fetch ids, so it only exists once `super()` returned: the
      // transformer reads it when a command is sent, not before
      new CcApiParamsTransformer(() => this.#resourceIdResolver),
    );

    this.#resourceIdResolver = new ResourceIdResolver(
      this,
      config?.resourceIdResolverStore ?? new MemoryStore<ResourceIdIndex>(),
      (requestConfig) => getRequestSignal(requestConfig, config?.defaultRequestConfig),
    );
  }

  /**
   * Resource ID resolver used by this client.
   * Exposes helpers to resolve owner IDs and translate between addonId and realAddonId.
   */
  get resourceIdResolver(): ResourceIdResolver {
    return this.#resourceIdResolver;
  }
}

/**
 * Determines the API base URL based on the authentication method.
 * Uses the bridge URL for API token auth and the main API URL for OAuth.
 *
 * @param config - Client configuration
 * @returns The base URL for API requests
 */
function getBaseUrl(config?: CcApiClientConfig): string {
  if (config?.authMethod == null || config.authMethod.type === 'oauth-v1') {
    return 'https://api.clever-cloud.com';
  }
  return 'https://api-bridge.clever-cloud.com';
}

/**
 * Creates the appropriate authentication handler based on the config.
 * Supports OAuth v1 PLAINTEXT and API token authentication methods.
 *
 * @param config - Client configuration
 * @returns Authentication handler or undefined if no auth method specified
 */
function getAuth(config?: CcApiClientConfig): CcAuth | undefined {
  if (config?.authMethod == null) {
    return undefined;
  }
  if (config.authMethod.type === 'oauth-v1') {
    return new CcAuthOauthV1Plaintext(config.authMethod.oauthTokens);
  }
  if (config.authMethod.type === 'api-token') {
    return new CcAuthApiToken(config.authMethod.apiToken);
  }
  return undefined;
}
