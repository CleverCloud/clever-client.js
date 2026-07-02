import { CcAuth } from './cc-auth.js';

/**
 * Authentication implementation using Clever Cloud API tokens.
 * Provides Bearer token authentication for API requests.
 *
 * The token is formatted as a Bearer token in the format: 'Bearer <api-token>'
 * and can be used in both HTTP headers and URL parameters.
 */
export class CcAuthApiToken extends CcAuth {
  #apiToken: string;

  /**
   * Creates a new API token authentication instance.
   *
   * @param apiToken - The Clever Cloud API token to use for authentication
   */
  constructor(apiToken: string) {
    super();
    this.#apiToken = apiToken;
  }

  /**
   * Returns the API token formatted as a Bearer token.
   *
   * @returns The token in the format 'Bearer <api-token>'
   */
  getAuthorization(): string {
    return `Bearer ${this.#apiToken}`;
  }
}
