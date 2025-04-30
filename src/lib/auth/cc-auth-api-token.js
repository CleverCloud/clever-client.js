import { CcAuth } from './cc-auth.js';

/**
 * @abstract
 */
export class CcAuthApiToken extends CcAuth {
  /** @type {string} */
  #apiToken;

  /**
   * @param {string} apiToken
   */
  constructor(apiToken) {
    super();
    this.#apiToken = apiToken;
  }

  /**
   * @returns {string}
   */
  getToken() {
    return `Bearer ${this.#apiToken}`;
  }
}
