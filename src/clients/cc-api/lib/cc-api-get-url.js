/**
 * @import { CcApiType } from '../types/cc-api.types.js'
 */
import { GetUrl } from '../../../lib/get-url.js';

/**
 * @extends {GetUrl<CcApiType, Input>}
 * @template Input
 * @abstract
 */
export class CcApiGetUrl extends GetUrl {
  /** @type {GetUrl<CcApiType, Input>['api']} */
  get api() {
    return 'cc-api';
  }
}
