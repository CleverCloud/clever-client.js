import { CcAuth } from './cc-auth.js';

/**
 * Authentication implementation using Clever Cloud API tokens.
 * Provides Bearer token authentication for API requests.
 *
 * The token is formatted as a Bearer token in the format: 'Bearer <api-token>'
 * and can be used in both HTTP headers and URL parameters.
 */
export class CcAuthApiToken extends CcAuth {
  /** @type {string} */
  #apiToken;

  /**
   * Creates a new API token authentication instance.
   *
   * @param {string} apiToken - The Clever Cloud API token to use for authentication
   */
  constructor(apiToken) {
    super();
    this.#apiToken = apiToken;
  }

  /**
   * Returns the API token formatted as a Bearer token.
   *
   * @returns {string} The token in the format 'Bearer <api-token>'
   */
  getAuthorization() {
    return `Bearer ${this.#apiToken}`;
  }
}
