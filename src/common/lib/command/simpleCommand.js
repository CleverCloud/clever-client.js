/**
 * @typedef {import('../cc-client.js').CcClient} CcClient
 * @typedef {import('../../types/request.types.js').CcRequestParams} CcRequestParams
 */

/**
 * @template ResponseBody
 * @abstract
 */
export class SimpleCommand {
  /**
   * @returns {Partial<CcRequestParams>}
   * @abstract
   */
  toRequestParams() {
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
   * @returns {ResponseBody} response
   */
  transformResponseBody(response) {
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
 * @template ResponseBody
 * @template {CcClient} Client
 * @abstract
 */
export class CompositeCommand {
  /**
   * @param {import('../../types/command.types.js').ComposeClient<Client>} _client
   * @returns {Promise<ResponseBody>}
   * @abstract
   */
  async compose(_client) {
    throw new Error('Method not implemented');
  }
}
