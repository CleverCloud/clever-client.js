import { HeadersBuilder } from '../request/headers-builder.js';
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

  /** @type {CcAuth['applyOnRequestParams']} */
  applyOnRequestParams(requestParams) {
    requestParams.headers = new HeadersBuilder(requestParams.headers).authorization(this.#getToken()).build();
  }

  /** @type {CcAuth['applyOnUrl']} */
  applyOnUrl(url) {
    url.searchParams.append('authorization', btoa(this.#getToken()));
  }

  /**
   * @returns {string}
   */
  #getToken() {
    return `Bearer ${this.#apiToken}`;
  }
}
