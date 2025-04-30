/**
 * @import { CcApiType, CcApiClientConfig } from './types/cc-api.types.js'
 */
import { CcClient } from '../../lib/cc-client.js';
import { CcApiCompositeWithOwnerCommand, CcApiSimpleWithOwnerCommand } from './lib/cc-api-command.js';
import { OwnerIdResolver } from './lib/owner-id-resolver.js';
import { MemoryStore } from './lib/store/memory-store.js';

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

    this.ownerIdResolver = new OwnerIdResolver(this, config.ownerIdResolverStore ?? new MemoryStore());
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
