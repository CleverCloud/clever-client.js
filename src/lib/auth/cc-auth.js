/**
 * @import { CcRequestParams } from '../../types/request.types.js'
 */

import { HeadersBuilder } from '../request/headers-builder.js';

/**
 * Abstract base class for Clever Cloud authentication mechanisms.
 * Provides a common interface for different authentication strategies
 * including API tokens and OAuth.
 *
 * This class defines the contract for:
 * - Applying authentication to request parameters
 * - Applying authentication to URLs
 * - Retrieving authentication tokens
 *
 * @abstract
 */
export class CcAuth {
  /**
   * Applies authentication headers to request parameters.
   * Adds an Authorization header with the authentication token.
   *
   * @param {Partial<CcRequestParams>} requestParams - The request parameters to modify
   * @abstract
   */
  applyOnRequestParams(requestParams) {
    requestParams.headers = new HeadersBuilder(requestParams.headers).authorization(this.getAuthorization()).build();
  }

  /**
   * Applies authentication to a URL by adding an authorization query parameter.
   * The token is base64 encoded before being added to the URL.
   *
   * @param {URL} url - The URL to modify with authentication
   * @abstract
   */
  applyOnUrl(url) {
    url.searchParams.append('authorization', btoa(this.getAuthorization()));
  }

  /**
   * Returns the authentication token in the appropriate format for the auth strategy.
   * Must be implemented by concrete authentication classes.
   *
   * @returns {string} The formatted authentication token
   * @abstract
   * @throws {Error} If the method is not implemented by the concrete class
   */
  getAuthorization() {
    throw new Error('Method not implemented');
  }
}
