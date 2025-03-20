/**
 * @typedef {import('../../types/request.types.js').CcRequest} CcRequest
 * @typedef {import('../../types/request.types.js').CcResponse<unknown>} CcResponse
 */

export class CcClientError extends Error {
  /** @type {string} */
  #code;
  /** @type {CcRequest} */
  #request;

  /**
   * @param {string} message
   * @param {string} code
   * @param {CcRequest} request
   * @param {unknown} cause
   */
  constructor(message, code, request, cause) {
    super(message);
    if (cause != null) {
      this.cause = cause;
    }
    this.#code = code;
    this.#request = request;
  }

  /**
   * @returns {string}
   */
  get code() {
    return this.#code;
  }

  /**
   * @returns {CcRequest}
   */
  get request() {
    return this.#request;
  }
}

export class CcHttpError extends CcClientError {
  /** @type {CcResponse} */
  #response;

  /**
   * @param {string} message
   * @param {CcResponse} response
   */
  constructor(message, response) {
    super(message, 'HTTP_ERROR', response.request);
    this.#response = response;
  }

  // todo: I would really like to normalize error Response body (and have a real proper ErrorBody interface)
  //  ovd is trying to normalize that, but work is still in progress

  /**
   * @returns {CcResponse|null}
   */
  get response() {
    return this.#response;
  }
}

/**
 * @param {any} error
 * @returns {error is CcClientError}
 */
export function isCcClientError(error) {
  return error instanceof CcClientError;
}

/**
 * @param {any} error
 * @returns {error is CcHttpError}
 */
export function isCcHttpError(error) {
  return error instanceof CcHttpError;
}
