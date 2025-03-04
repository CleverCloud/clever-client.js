/**
 * @typedef {import('../request/request.types.d.ts').RequestParams} RequestParams
 * @typedef {import('../request/request.types.d.ts').Response<unknown>} Response
 */

export class CleverClientError extends Error {
  /** @type {string} */
  #code;
  /** @type {Partial<RequestParams>} */
  #requestParams;

  /**
   * @param {string} message
   * @param {string} code
   * @param {Partial<RequestParams>} requestParams
   * @param {unknown} cause
   */
  constructor (message, code, requestParams, cause) {
    super(message);
    if (cause != null) {
      this.cause = cause;
    }
    this.#code = code;
    this.#requestParams = requestParams;
  }

  /**
   * @returns {string}
   */
  get code () {
    return this.#code;
  }

  /**
   * @returns {Partial<RequestParams>}
   */
  get requestParams () {
    return this.#requestParams;
  }
}

export class CleverHttpError extends CleverClientError {
  /** @type {Response} */
  #response;

  /**
   * @param {string} message
   * @param {Response} response
   */
  constructor (message, response) {
    super(message, 'HTTP_ERROR', response.requestParams);
    this.#response = response;
  }

  // todo: I would really like to normalize error Response body (and have a real proper ErrorBody interface)
  //  ovd is trying to normalize that, but work is still in progress

  /**
   * @returns {Response|null}
   */
  get response () {
    return this.#response;
  }
}

/**
 * @param {any} error
 * @returns {error is CleverClientError}
 */
export function isCleverClientError (error) {
  return error instanceof CleverClientError;
}

/**
 * @param {any} error
 * @returns {error is CleverHttpError}
 */
export function isCleverHttpError (error) {
  return error instanceof CleverHttpError;
}
