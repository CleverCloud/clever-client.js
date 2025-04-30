/**
 * @import { CcRequestParams } from '../../types/request.types.js'
 */

import { HeadersBuilder } from '../request/headers-builder.js';

/**
 * @abstract
 */
export class CcAuth {
  /**
   * @param {Partial<CcRequestParams>} requestParams
   * @abstract
   */
  applyOnRequestParams(requestParams) {
    requestParams.headers = new HeadersBuilder(requestParams.headers).authorization(this.getToken()).build();
  }

  /**
   * @param {URL} url
   * @abstract
   */
  applyOnUrl(url) {
    url.searchParams.append('authorization', btoa(this.getToken()));
  }

  /**
   * @returns {string}
   * @abstract
   */
  getToken() {
    throw new Error('Method not implemented');
  }
}
