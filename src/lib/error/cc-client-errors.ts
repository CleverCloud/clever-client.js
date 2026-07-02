import type { CcRequest, CcResponse } from '../../types/request.types.js';

//--

/**
 * Base error class for Clever Cloud client errors.
 * Extends the native Error class with an error code system.
 */
export class CcClientError extends Error {
  #code: string;

  /**
   * Creates a new client error.
   *
   * @param message - Human-readable error description
   * @param code - Machine-readable error code for programmatic handling
   * @param cause - Optional underlying cause of the error
   */
  constructor(message: string, code: string, cause?: unknown) {
    super(message, { cause });
    this.#code = code;
  }

  /**
   * Gets the error code associated with this error.
   *
   * @returns The machine-readable error code
   */
  get code(): string {
    return this.#code;
  }
}

/**
 * Error class for request-specific errors in the Clever Cloud client.
 * Extends CcClientError with request context information.
 */
export class CcRequestError extends CcClientError {
  #request: CcRequest;

  /**
   * Creates a new request error.
   *
   * @param message - Human-readable error description
   * @param code - Machine-readable error code
   * @param request - The request that caused the error
   * @param cause - Optional underlying cause of the error
   */
  constructor(message: string, code: string, request: CcRequest, cause?: unknown) {
    super(message, code, cause);
    this.#request = request;
  }

  /**
   * Gets the request object associated with this error.
   *
   * @returns The request that caused the error
   */
  get request(): CcRequest {
    return this.#request;
  }
}

/**
 * Error class for HTTP-specific errors in the Clever Cloud client.
 * Extends CcRequestError with HTTP response information.
 *
 * Used for errors that occur when a request receives an error response
 * from the server (non-2xx status codes).
 */
export class CcHttpError extends CcRequestError {
  #response: CcResponse<unknown>;

  /**
   * Creates a new HTTP error.
   *
   * @param message - Human-readable error description
   * @param code - Machine-readable error code
   * @param request - The HTTP request that caused the error
   * @param response - The HTTP response
   */
  constructor(message: string, code: string, request: CcRequest, response: CcResponse<unknown>) {
    super(message, code, request);
    this.#response = response;
  }

  /**
   * Gets the HTTP status code from the error response.
   *
   * @returns The HTTP status code
   */
  get statusCode(): number {
    return this.#response.status;
  }

  /**
   * Gets the complete HTTP response associated with this error.
   *
   * @returns The HTTP response that caused the error
   */
  get response(): CcResponse<unknown> {
    return this.#response;
  }
}
