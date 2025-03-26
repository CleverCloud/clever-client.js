import { CcClient } from '../common/lib/cc-client.js';
import { CcApiCompositeWithAutoOwnerCommand, CcApiSimpleWithAutoOwnerCommand } from './common/cc-api-commands.js';
import { MemoryIndexStore, OwnerIdResolver } from './common/owner-id-resolver.js';

/**
 * @typedef {import('./types/cc-api.types.js').ApplicationOrAddonId} ApplicationOrAddonId
 * @typedef {import('../common/types/clever-client.types.js').CcApiClientConfig} CcApiClientConfig
 * @typedef {import('../common/types/request.types.js').CcRequestConfig} CcRequestConfig
 * @typedef {import('../common/types/request.types.js').CcRequestParams} CcRequestParams
 */

/**
 *
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

    this.ownerIdResolver = new OwnerIdResolver(this, new MemoryIndexStore());
  }

  /**
   * @param {import('./types/cc-api.types.js').CcApiCommand<ResponseBody>} command
   * @param {Partial<CcRequestConfig>} [requestConfig]
   * @returns {Promise<ResponseBody>}
   * @template ResponseBody
   */
  async send(command, requestConfig) {
    return super.send(command, requestConfig);
  }

  /**
   * @param {import('./common/cc-api-commands.js').CcApiCompositeCommand<ResponseBody>} command
   * @param {Partial<CcRequestConfig>} [requestConfig]
   * @returns {Promise<ResponseBody>}
   * @template ResponseBody
   * @protected
   */
  async _compose(command, requestConfig) {
    if (command instanceof CcApiCompositeWithAutoOwnerCommand) {
      const ownerId = await this.ownerIdResolver.resolve(command.params);
      return command.composeWithOwnerId(
        {
          send: (command, rc) => this.send(command, { ...(requestConfig ?? {}), ...(rc ?? {}) }),
        },
        ownerId,
      );
    }
    return super._compose(command, requestConfig);
  }

  /**
   * @param {import('./common/cc-api-commands.js').CcApiSimpleCommand<ResponseBody>} command
   * @returns {Promise<Partial<CcRequestParams>>}
   * @template ResponseBody
   * @protected
   */
  async _getCommandRequestParams(command) {
    if (command instanceof CcApiSimpleWithAutoOwnerCommand) {
      const ownerId = await this.ownerIdResolver.resolve(command.params);
      return command.toRequestParamsWithOwnerId(ownerId);
    }
    return super._getCommandRequestParams(command);
  }
}
