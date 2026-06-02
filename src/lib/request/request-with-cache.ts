import type { CcRequest, CcResponse, RequestAdapter } from '../../types/request.types.js';
import { calculateCacheKey } from '../utils.js';

const CACHE = new Map<string, { response: CcResponse<unknown>; expiresAt: number }>();

export async function requestWithCache<CommandOutput>(
  request: CcRequest,
  handler: RequestAdapter,
): Promise<CcResponse<CommandOutput>> {
  // no caching on HTTP method other than GET
  if (request.cache == null || request.method.toLowerCase() !== 'get') {
    return handler<CommandOutput>(request);
  }

  const cacheKey = calculateCacheKey(request);

  // cache hit - check expiration only for this entry
  if (request.cache.mode !== 'reload' && CACHE.has(cacheKey)) {
    const entry = CACHE.get(cacheKey);
    if (entry.expiresAt > Date.now()) {
      return entry.response as CcResponse<CommandOutput>;
    } else {
      CACHE.delete(cacheKey);
    }
  }

  // cache miss
  const response = await handler<CommandOutput>(request);

  if (request.cache.ttl > 0) {
    CACHE.set(cacheKey, {
      response: { ...response, cacheHit: true },
      expiresAt: Date.now() + request.cache.ttl,
    });
  }

  return response;
}
