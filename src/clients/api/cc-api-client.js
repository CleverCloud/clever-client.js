import { CcClient } from '../../lib/cc-client.js';
import { CcApiCompositeWithOwnerCommand, CcApiSimpleWithOwnerCommand } from './lib/cc-api-command.js';
import { MemoryIndexStore } from './lib/owner-id-index-store.js';
import { OwnerIdResolver } from './lib/owner-id-resolver.js';

/**
 * @typedef {import('./types/cc-api.types.js').CcApiType} CcApiType
 * @typedef {import('./types/cc-api.types.js').CcApiClientConfig} CcApiClientConfig
 */

/**
 * @extends {CcClient<CcApiType>}
 */
export class CcApiClient extends CcClient {
  /**
   * @param {CcApiClientConfig} config
   */
  constructor(config) {
    super({
      baseUrl: 'https://api.clever-cloud.com',
      ...config,
    });

    this.ownerIdResolver = new OwnerIdResolver(this, config.ownerIdResolverStore ?? new MemoryIndexStore());
  }

  /** @type {CcClient<?>['_transformCommandParams']} */
  async _transformCommandParams(command, requestConfig) {
    if (command instanceof CcApiCompositeWithOwnerCommand || command instanceof CcApiSimpleWithOwnerCommand) {
      const ownerId = await this.ownerIdResolver.resolve(command.params, requestConfig);
      return { ...command.params, ownerId };
    }
    return super._transformCommandParams(command, requestConfig);
  }
}
