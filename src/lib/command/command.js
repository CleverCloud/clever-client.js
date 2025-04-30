/**
 * @import { CcRequestParams } from '../../types/request.types.js'
 * @import { Composer } from '../../types/command.types.js'
 * @import { SelfOrPromise } from '../../types/utils.types.js'
 * @internal
 */

//--

/**
 * @template {string} Api
 * @template CommandInput
 * @abstract
 */
export class AbstractCommand {
  /** @type {CommandInput} */
  #params;

  /**
   * @param {CommandInput} params
   */
  constructor(params) {
    this.#params = params;
  }

  /**
   * @returns {CommandInput}
   */
  get params() {
    return this.#params;
  }

  /**
   * @returns {Api}
   */
  get api() {
    throw new Error('Method not implemented');
  }
}

/**
 * @template {string} Api
 * @template CommandInput
 * @template CommandOutput
 * @extends {AbstractCommand<Api, CommandInput>}
 * @abstract
 */
export class SimpleCommand extends AbstractCommand {
  /**
   * @param {CommandInput} _params
   * @returns {SelfOrPromise<Partial<CcRequestParams>>}
   * @abstract
   */
  toRequestParams(_params) {
    throw new Error('Method not implemented');
  }

  /**
   * @param {number} _status
   * @param {any} _body
   * @returns {{isEmpty: boolean, emptyValue?: any}|null}
   */
  getEmptyResponsePolicy(_status, _body) {
    return null;
  }

  /**
   * @param {any} response
   * @returns {CommandOutput}
   */
  transformCommandOutput(response) {
    return response;
  }

  /**
   * @param {string} errorCode
   * @returns {string}
   */
  transformErrorCode(errorCode) {
    return errorCode;
  }
}

/**
 * @template {string} Api
 * @template CommandInput
 * @template CommandOutput
 * @extends {AbstractCommand<Api, CommandInput>}
 * @abstract
 */
export class CompositeCommand extends AbstractCommand {
  /**
   * @param {CommandInput} _params
   * @param {Composer<Api>} _composer
   * @returns {Promise<CommandOutput>}
   * @abstract
   */
  async compose(_params, _composer) {
    throw new Error('Method not implemented');
  }
}
