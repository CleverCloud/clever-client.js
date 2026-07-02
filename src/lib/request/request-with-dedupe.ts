import type { CcRequest, CcResponse, RequestAdapter } from '../../types/request.types.js';
import { calculateCacheKey } from '../utils.js';

const PENDING_FETCH_CACHE = new Map<string, Promise<CcResponse<unknown>>>();

export async function requestWithDedupe<CommandOutput>(
  request: CcRequest,
  handler: RequestAdapter,
): Promise<CcResponse<CommandOutput>> {
  // no dedupe on HTTP method other than GET
  if (request.method.toLowerCase() !== 'get') {
    return handler<CommandOutput>(request);
  }

  const cacheKey = calculateCacheKey(request);

  if (PENDING_FETCH_CACHE.has(cacheKey)) {
    return PENDING_FETCH_CACHE.get(cacheKey) as Promise<CcResponse<CommandOutput>>;
  }

  const promise = handler<CommandOutput>(request);
  PENDING_FETCH_CACHE.set(cacheKey, promise);
  return promise.finally(() => PENDING_FETCH_CACHE.delete(cacheKey));
}
