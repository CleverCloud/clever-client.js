/**
 * @import { ApplicationOrAddonId, CcApiType, CcApiComposer, WithOwnerId } from '../types/cc-api.types.js'
 * @import { CcRequestParams } from '../../../types/request.types.js'
 */
import { CompositeCommand, SimpleCommand } from '../../../lib/command/command.js';

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
   * @param {WithOwnerId<CommandInput>} _params
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
   * @param {WithOwnerId<CommandInput>} _params
   * @param {CcApiComposer} _client
   * @returns {Promise<CommandOutput>}
   * @abstract
   */
  async compose(_params, _client) {
    throw new Error('Method not implemented');
  }
}
