/**
 * @import {RequestWrapper} from '../../types/request.types.js'
 */

import { QueryParams } from './query-params.js';

/**
 * @type {RequestWrapper}
 */
export async function requestDebug(request, handler) {
  if (!request.debug) {
    return handler(request);
  }

  const response = await handler(request);
  console.log(
    JSON.stringify(
      {
        request: {
          ...request,
          queryParams: obfuscateQueryParams(request.queryParams),
          headers: obfuscateHeaders(request.headers),
        },
        response: {
          ...response,
          headers: obfuscateHeaders(response.headers),
        },
      },
      null,
      2,
    ),
  );

  return response;
}

/**
 * @param {Headers} headers
 */
function obfuscateHeaders(headers) {
  if (headers == null) {
    return null;
  }
  if (headers.get('authorization') != null) {
    return { ...Object.fromEntries(headers.entries()), authorization: '***' };
  }
  return Object.fromEntries(headers.entries());
}

/**
 * @param {QueryParams} queryParams
 */
function obfuscateQueryParams(queryParams) {
  if (queryParams == null) {
    return null;
  }

  if (queryParams.get('authorization') != null) {
    return new QueryParams(queryParams).set('authorization', '***').toObject();
  }
  return queryParams.toObject();
}
