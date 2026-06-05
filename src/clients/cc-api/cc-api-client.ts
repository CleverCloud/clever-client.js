import { CcAuthApiToken } from '../../lib/auth/cc-auth-api-token.js';
import { CcAuthOauthV1Plaintext } from '../../lib/auth/cc-auth-oauth-v1-plaintext.js';
import type { CcAuth } from '../../lib/auth/cc-auth.js';
import { CcClient } from '../../lib/cc-client.js';
import { SimpleCommand } from '../../lib/command/command.js';
import { CcClientError } from '../../lib/error/cc-client-errors.js';
import type { CcStream } from '../../lib/stream/cc-stream.js';
import { merge } from '../../lib/utils.js';
import type { Command } from '../../types/command.types.js';
import type { CcRequestConfigPartial } from '../../types/request.types.js';
import type { CcApiCompositeCommand, CcApiSimpleCommand, CcApiStreamCommand } from './lib/cc-api-command.js';
import { ResourceIdResolver } from './lib/resource-id-resolver.js';
import { MemoryStore } from './lib/store/memory-store.js';
import type { CcApiClientConfig, CcApiType, ResourceId } from './types/cc-api.types.js';
import type { AddonIdResolve, IdResolve, ResourceIdIndex } from './types/resource-id-resolver.types.js';

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
    super(merge({ baseUrl: getBaseUrl(config) }, config), getAuth(config));

    this.#resourceIdResolver = new ResourceIdResolver(
      this,
      config?.resourceIdResolverStore ?? new MemoryStore<ResourceIdIndex>(),
    );
  }

  /**
   * Resource ID resolver used by this client.
   * Exposes helpers to resolve owner IDs and translate between addonId and realAddonId.
   */
  get resourceIdResolver(): ResourceIdResolver {
    return this.#resourceIdResolver;
  }

  /**
   * Transforms command parameters by resolving resource IDs.
   * This method is called before sending a command to resolve any resource IDs
   * (owner IDs, addon IDs) to their proper format.
   *
   * @param command - The command being sent
   * @param requestConfig - Optional request configuration
   * @returns The transformed command parameters
   */
  protected _transformCommandParams(
    command: CcApiSimpleCommand<unknown, unknown> | CcApiCompositeCommand<unknown, unknown>,
    requestConfig?: CcRequestConfigPartial,
  ): Promise<unknown> {
    return this.#transformParams(command.params, command.getIdsToResolve(), requestConfig);
  }

  /**
   * Transforms command parameters by resolving resource IDs.
   * This method is called before sending a stream command to resolve any resource IDs
   * (owner IDs, addon IDs) to their proper format.
   *
   * @param command - The command being sent
   * @param requestConfig - Optional request configuration
   * @returns The transformed command parameters
   */
  protected _transformStreamParams(
    command: CcApiStreamCommand<unknown, CcStream>,
    requestConfig?: CcRequestConfigPartial,
  ): Promise<unknown> {
    return this.#transformParams(command.params, command.getIdsToResolve(), requestConfig);
  }

  /**
   * Sends a command to the API with special handling for resource resolution errors.
   * If a command fails due to resource ID resolution but defines a 404 empty response policy,
   * returns the empty value instead of throwing.
   *
   * @example
   * // Command with empty response policy for 404
   * const result = await client.send(new GetApplicationCommand('app_123'));
   * // Returns null if app doesn't exist, instead of throwing
   */
  async send<CommandInput, CommandOutput>(
    command: Command<CcApiType, CommandInput, CommandOutput>,
    requestConfig?: CcRequestConfigPartial,
  ): Promise<CommandOutput> {
    try {
      return await super.send(command, requestConfig);
    } catch (e: unknown) {
      if (command instanceof SimpleCommand && e instanceof CcClientError && e.code === 'CANNOT_RESOLVE_RESOURCE_ID') {
        const emptyResponsePolicy = command.getEmptyResponsePolicy(404);
        if (emptyResponsePolicy?.isEmpty) {
          return (emptyResponsePolicy.emptyValue ?? null) as CommandOutput;
        }
      }
      throw e;
    }
  }

  async #transformParams(
    params: unknown,
    idsToResolve: IdResolve | null,
    requestConfig?: CcRequestConfigPartial,
  ): Promise<unknown> {
    if (idsToResolve == null) {
      return params;
    }

    const resolvedIds: { ownerId?: string; addonId?: string } = {};

    if (idsToResolve.ownerId) {
      resolvedIds.ownerId = await this.#resourceIdResolver.resolveOwnerId(params as ResourceId, requestConfig);
    }

    if (idsToResolve.addonId != null) {
      const addonIdResolve: AddonIdResolve =
        typeof idsToResolve.addonId === 'string'
          ? {
              property: 'addonId',
              type: idsToResolve.addonId,
            }
          : idsToResolve.addonId;

      resolvedIds.addonId = await this.#resourceIdResolver.resolveAddonId(
        (params as Record<string, string>)[addonIdResolve.property],
        addonIdResolve.type,
        requestConfig,
      );
    }

    return { ...(params as Record<string, unknown>), ...resolvedIds };
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
