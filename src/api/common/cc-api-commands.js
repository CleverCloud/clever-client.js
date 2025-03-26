import { CompositeCommand, SimpleCommand } from '../../common/lib/command/simpleCommand.js';

/**
 * @typedef {import('../cc-api-client.js').CcApiClient} CcApiClient
 * @typedef {import('../types/cc-api.types.js').ApplicationOrAddonId} ApplicationOrAddonId
 * @typedef {import('../types/cc-api.types.js').CcApiComposeClient} CcApiComposeClient
 * @typedef {import('../../common/types/request.types.js').CcRequestParams} CcRequestParams
 */

/**
 * @extends {CompositeCommand<ResponseBody, CcApiClient>}
 * @template ResponseBody
 * @abstract
 */
export class CcApiCompositeCommand extends CompositeCommand {
  /**
   * @returns {'api-command'}
   */
  get type() {
    return 'api-command';
  }
}

/**
 * @extends {CcApiCompositeCommand<ResponseBody>}
 * @template {ApplicationOrAddonId} CommandInput
 * @template ResponseBody
 * @abstract
 */
export class CcApiCompositeWithAutoOwnerCommand extends CcApiCompositeCommand {
  /**
   * @param {CommandInput} params
   */
  constructor(params) {
    super();
    this.params = params;
  }

  /**
   * @param {CcApiComposeClient} _client
   * @param {import('../types/cc-api.types.js').WithOwnerId<CommandInput>} _params
   * @returns {Promise<ResponseBody>}
   */
  async composeWithOwnerId(_client, _params) {
    throw new Error('Method not implemented');
  }
}

/**
 * @extends {SimpleCommand<ResponseBody>}
 * @template ResponseBody
 * @abstract
 */
export class CcApiSimpleCommand extends SimpleCommand {
  /**
   * @returns {'api-command'}
   */
  get type() {
    return 'api-command';
  }

  isAuthRequired() {
    return true;
  }
}

/**
 * @extends {CcApiSimpleCommand<ResponseBody>}
 * @template CommandInput
 * @template ResponseBody
 * @abstract
 */
export class CcApiSimpleWithAutoOwnerCommand extends CcApiSimpleCommand {
  /**
   * @param {import('../types/cc-api.types.js').MaybeWithOwnerId<CommandInput>} params
   */
  constructor(params) {
    super();
    this.params = params;
  }

  /**
   * @param {import('../types/cc-api.types.js').WithOwnerId<CommandInput>} _params
   * @returns {Partial<CcRequestParams>}
   */
  toRequestParamsWithOwnerId(_params) {
    throw new Error('Method not implemented');
  }
}
