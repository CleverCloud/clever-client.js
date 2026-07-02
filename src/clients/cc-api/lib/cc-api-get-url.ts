import { GetUrl } from '../../../lib/get-url.js';
import type { CcApiType } from '../types/cc-api.types.js';

/**
 * @template Input
 */
export abstract class CcApiGetUrl<Input> extends GetUrl<CcApiType, Input> {
  get api(): CcApiType {
    return 'cc-api';
  }
}
