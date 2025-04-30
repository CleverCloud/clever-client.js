/**
 * @import {RequestWrapper, DebugFunction} from '../../types/request.types.js'
 */

import { omit } from '../utils.js';
import { QueryParams } from './query-params.js';

/** @type {DebugFunction} */
const defaultDebug = (request, response, duration) => {
  console.log(
    JSON.stringify(
      {
        request: {
          ...request,
          queryParams: obfuscateQueryParams(request.queryParams),
          headers: obfuscateHeaders(request.headers),
        },
        response: {
          ...omit(response, 'request'),
          headers: obfuscateHeaders(response.headers),
        },
        duration,
      },
      null,
      2,
    ),
  );
};

/**
 * @type {RequestWrapper}
 */
export const requestDebug = async (request, handler) => {
  if (request.debug === false) {
    return handler(request);
  }

  const debug = request.debug === true ? defaultDebug : request.debug;
  const now = new Date().getTime();
  const response = await handler(request);
  debug(request, response, new Date().getTime() - now);

  return response;
};

/**
 * @param {Headers} headers
 */
export function obfuscateHeaders(headers) {
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
export function obfuscateQueryParams(queryParams) {
  if (queryParams == null) {
    return null;
  }

  if (queryParams.get('authorization') != null) {
    return new QueryParams(queryParams).set('authorization', '***').toObject();
  }
  return queryParams.toObject();
}
