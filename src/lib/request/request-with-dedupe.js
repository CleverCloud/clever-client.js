/**
 * @import { RequestWrapper, CcResponse } from '../../types/request.types.js'
 */

import { calculateCacheKey } from '../utils.js';

/**
 * @type {Map<string, Promise<CcResponse<any>>>}
 */
const PENDING_FETCH_CACHE = new Map();

/**
 * @type {RequestWrapper}
 */
export async function requestWithDedupe(request, handler) {
  // no dedupe on HTTP method other than GET
  if (request.method.toLowerCase() !== 'get') {
    return handler(request);
  }

  const cacheKey = calculateCacheKey(request);

  if (PENDING_FETCH_CACHE.has(cacheKey)) {
    return PENDING_FETCH_CACHE.get(cacheKey);
  }

  const promise = handler(request);
  PENDING_FETCH_CACHE.set(cacheKey, promise);
  return promise.finally(() => PENDING_FETCH_CACHE.delete(cacheKey));
}
