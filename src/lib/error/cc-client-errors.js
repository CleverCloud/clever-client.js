/**
 * @import { CcRequest, CcResponse } from '../../types/request.types.js'
 */

//--

export class CcClientError extends Error {
  /** @type {string} */
  #code;

  /**
   * @param {string} message
   * @param {string} code
   * @param {unknown} [cause]
   */
  constructor(message, code, cause) {
    super(message, { cause });
    this.#code = code;
  }

  /**
   * @returns {string}
   */
  get code() {
    return this.#code;
  }
}

export class CcRequestError extends CcClientError {
  /** @type {CcRequest} */
  #request;

  /**
   * @param {string} message
   * @param {string} code
   * @param {CcRequest} request
   * @param {unknown} [cause]
   */
  constructor(message, code, request, cause) {
    super(message, code, cause);
    this.#request = request;
  }

  /**
   * @returns {CcRequest}
   */
  get request() {
    return this.#request;
  }
}

export class CcHttpError extends CcRequestError {
  /** @type {CcResponse<?>} */
  #response;

  /**
   * @param {string} message
   * @param {string} code
   * @param {CcResponse<?>} response
   */
  constructor(message, code, response) {
    super(message, code, response.request);
    this.#response = response;
  }

  get statusCode() {
    return this.#response.status;
  }

  /**
   * @returns {CcResponse<?>|null}
   */
  get response() {
    return this.#response;
  }
}
