import { CompositeCommand, SimpleCommand } from '../../../lib/command/command.js';

/**
 * @typedef {import('../cc-api-client.js').CcApiClient} CcApiClient
 * @typedef {import('../types/cc-api.types.js').CcApiType} CcApiType
 * @typedef {import('../types/cc-api.types.js').ApplicationOrAddonId} ApplicationOrAddonId
 * @typedef {import('../types/cc-api.types.js').CcApiComposeClient} CcApiComposeClient
 * @typedef {import('../../../types/request.types.js').CcRequestParams} CcRequestParams
 */

/**
 * @extends {SimpleCommand<CcApiType, CommandInput, CommandOutput>}
 * @template CommandInput
 * @template CommandOutput
 * @abstract
 */
export class CcApiSimpleCommand extends SimpleCommand {
  isAuthRequired() {
    return true;
  }
}

/**
 * @extends {CcApiSimpleCommand<CommandInput, CommandOutput>}
 * @template {ApplicationOrAddonId} CommandInput
 * @template CommandOutput
 * @abstract
 */
export class CcApiSimpleWithOwnerCommand extends CcApiSimpleCommand {
  /**
   * @param {import('../types/cc-api.types.js').WithOwnerId<CommandInput>} _params
   * @returns {Partial<CcRequestParams>}
   * @abstract
   */
  toRequestParams(_params) {
    throw new Error('Method not implemented');
  }
}

/**
 * @extends {CompositeCommand<CcApiType, CommandInput, CommandOutput>}
 * @template CommandInput
 * @template CommandOutput
 * @abstract
 */
export class CcApiCompositeCommand extends CompositeCommand {}

/**
 * @extends {CcApiCompositeCommand<CommandInput, CommandOutput>}
 * @template {ApplicationOrAddonId} CommandInput
 * @template CommandOutput
 * @abstract
 */
export class CcApiCompositeWithOwnerCommand extends CcApiCompositeCommand {
  /**
   * @param {import('../types/cc-api.types.js').WithOwnerId<CommandInput>} _params
   * @param {CcApiComposeClient} _client
   * @returns {Promise<CommandOutput>}
   */
  async compose(_params, _client) {
    throw new Error('Method not implemented');
  }
}
