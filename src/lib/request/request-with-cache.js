/**
 * @import { RequestWrapper } from '../../types/request.types.js'
 */

import { calculateCacheKey } from '../utils.js';

/**
 * @type {Map<string, { response: import('../../types/request.types.js').CcResponse<?>, expiresAt: number }>}
 */
const CACHE = new Map();

/**
 * @type {RequestWrapper}
 */
export async function requestWithCache(request, handler) {
  // no caching on HTTP method other than GET
  if (request.cache == null || request.method.toLowerCase() !== 'get') {
    return handler(request);
  }

  const cacheKey = calculateCacheKey(request);

  // cache hit - check expiration only for this entry
  if (request.cache.mode !== 'reload' && CACHE.has(cacheKey)) {
    const entry = CACHE.get(cacheKey);
    if (entry.expiresAt > Date.now()) {
      return entry.response;
    } else {
      CACHE.delete(cacheKey);
    }
  }

  // cache miss
  const response = await handler(request);

  if (request.cache.ttl > 0) {
    CACHE.set(cacheKey, {
      response: { ...response, cacheHit: true },
      expiresAt: Date.now() + request.cache.ttl,
    });
  }

  return response;
}
