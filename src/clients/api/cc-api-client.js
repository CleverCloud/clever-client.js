/**
 * @import { CcApiCompositeCommand, CcApiSimpleCommand } from './lib/cc-api-command.js'
 * @import { CcApiType, CcApiClientConfig } from './types/cc-api.types.js'
 * @import { AddonIdResolve } from './types/resource-id-resolver.types.js';
 * @import { CcRequestConfig } from '../../types/request.types.js'
 */
import { CcClient } from '../../lib/cc-client.js';
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
    super({
      baseUrl: 'https://api.clever-cloud.com',
      ...(config ?? {}),
    });

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
}
