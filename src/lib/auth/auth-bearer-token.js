/**
 * @import { CcRequestParams } from '../../types/request.types.js'
 */
import { HeadersBuilder } from '../request/headers-builder.js';

/**
 * @param {Partial<CcRequestParams>} requestParams
 * @param {string} bearerToken
 * @returns {Partial<CcRequestParams>}
 */
export function prepareRequestWithBearerToken(requestParams, bearerToken) {
  return {
    ...requestParams,
    headers: new HeadersBuilder(requestParams.headers).authorization(`Bearer ${bearerToken}`).build(),
  };
}
