/**
 * @import { CcRequest, CcResponse } from '../../types/request.types.js'
 */

//--

/**
 * Base error class for Clever Cloud client errors.
 * Extends the native Error class with an error code system.
 *
 * @extends Error
 */
export class CcClientError extends Error {
  /** @type {string} */
  #code;

  /**
   * Creates a new client error.
   *
   * @param {string} message - Human-readable error description
   * @param {string} code - Machine-readable error code for programmatic handling
   * @param {unknown} [cause] - Optional underlying cause of the error
   */
  constructor(message, code, cause) {
    super(message, { cause });
    this.#code = code;
  }

  /**
   * Gets the error code associated with this error.
   *
   * @returns {string} The machine-readable error code
   */
  get code() {
    return this.#code;
  }
}

/**
 * Error class for request-specific errors in the Clever Cloud client.
 * Extends CcClientError with request context information.
 *
 * @extends CcClientError
 */
export class CcRequestError extends CcClientError {
  /** @type {CcRequest} */
  #request;

  /**
   * Creates a new request error.
   *
   * @param {string} message - Human-readable error description
   * @param {string} code - Machine-readable error code
   * @param {CcRequest} request - The request that caused the error
   * @param {unknown} [cause] - Optional underlying cause of the error
   */
  constructor(message, code, request, cause) {
    super(message, code, cause);
    this.#request = request;
  }

  /**
   * Gets the request object associated with this error.
   *
   * @returns {CcRequest} The request that caused the error
   */
  get request() {
    return this.#request;
  }
}

/**
 * Error class for HTTP-specific errors in the Clever Cloud client.
 * Extends CcRequestError with HTTP response information.
 *
 * Used for errors that occur when a request receives an error response
 * from the server (non-2xx status codes).
 *
 * @extends CcRequestError
 */
export class CcHttpError extends CcRequestError {
  /** @type {CcResponse<?>} */
  #response;

  /**
   * Creates a new HTTP error.
   *
   * @param {string} message - Human-readable error description
   * @param {string} code - Machine-readable error code
   * @param {CcRequest} request - The HTTP request that caused the error
   * @param {CcResponse<?>} response - The HTTP response
   */
  constructor(message, code, request, response) {
    super(message, code, request);
    this.#response = response;
  }

  /**
   * Gets the HTTP status code from the error response.
   *
   * @returns {number} The HTTP status code
   */
  get statusCode() {
    return this.#response.status;
  }

  /**
   * Gets the complete HTTP response associated with this error.
   *
   * @returns {CcResponse<?>} The HTTP response that caused the error
   */
  get response() {
    return this.#response;
  }
}
