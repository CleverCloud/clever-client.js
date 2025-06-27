/**
 * @import { CcRequestParams } from '../../types/request.types.js'
 */

/**
 * @abstract
 */
export class CcAuth {
  /**
   * @param {Partial<CcRequestParams>} _requestParams
   * @abstract
   */
  applyOnRequestParams(_requestParams) {}

  /**
   * @param {URL} _url
   * @abstract
   */
  applyOnUrl(_url) {}
}
