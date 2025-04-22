import { HeadersBuilder } from '../request/headers-builder.js';

/**
 * @typedef {import('../../types/request.types.js').CcRequestParams} CcRequestParams
 */

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
