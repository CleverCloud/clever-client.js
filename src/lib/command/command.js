/**
 * @typedef {import('../../types/request.types.js').CcRequestParams} CcRequestParams
 */

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
   * @returns {Partial<CcRequestParams>}
   * @abstract
   */
  toRequestParams(_params) {
    throw new Error('Method not implemented');
  }

  /**
   * @param {number} _status
   * @param {any} _body
   * @returns {boolean}
   */
  isEmptyResponse(_status, _body) {
    return false;
  }

  /**
   * @param {any} response
   * @returns {CommandOutput} response
   */
  transformCommandOutput(response) {
    return response;
  }

  /**
   * @returns {boolean}
   */
  isAuthRequired() {
    return false;
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
   * @param {import('../../types/command.types.js').Composer<Api>} _composer
   * @returns {Promise<CommandOutput>}
   * @abstract
   */
  async compose(_params, _composer) {
    throw new Error('Method not implemented');
  }
}
