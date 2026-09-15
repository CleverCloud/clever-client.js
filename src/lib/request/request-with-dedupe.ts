import type { CcRequest, CcResponse, RequestAdapter } from '../../types/request.types.js';
import { calculateCacheKey, waitUnlessAborted } from '../utils.js';

const EVENT_STREAM_CONTENT_TYPE = 'text/event-stream';

/**
 * A fetch shared by every caller sending the same request while it is pending.
 */
interface PendingFetch {
  promise: Promise<CcResponse<unknown>>;
  abortController: AbortController;
  callerCount: number;
}

const PENDING_FETCH_CACHE = new Map<string, PendingFetch>();

export async function requestWithDedupe<CommandOutput>(
  request: CcRequest,
  handler: RequestAdapter,
): Promise<CcResponse<CommandOutput>> {
  // no dedupe on HTTP method other than GET
  if (request.method.toLowerCase() !== 'get') {
    return handler<CommandOutput>(request);
  }

  // no dedupe on event streams: a stream body can only be read once, and the caller keeps reading it
  // long after the fetch resolved
  if (request.headers?.get('accept') === EVENT_STREAM_CONTENT_TYPE) {
    return handler<CommandOutput>(request);
  }

  const cacheKey = getDedupeKey(request);
  const pendingFetch = PENDING_FETCH_CACHE.get(cacheKey) ?? startFetch(cacheKey, request, handler);

  return joinFetch(cacheKey, pendingFetch, request.signal) as Promise<CcResponse<CommandOutput>>;
}

function getDedupeKey(request: CcRequest): string {
  // a fetch failing before any response rejects every caller with the same error, built from the request
  // of the first one: callers must agree on `isIdempotent`, which `CcNetworkError.isWorthRetrying()` reads
  return JSON.stringify([calculateCacheKey(request), request.isIdempotent]);
}

function startFetch(cacheKey: string, request: CcRequest, handler: RequestAdapter): PendingFetch {
  // the fetch belongs to every caller joining it, so the signal of the first one must not abort it
  const abortController = new AbortController();
  const pendingFetch: PendingFetch = {
    promise: handler({ ...request, signal: abortController.signal }),
    abortController,
    callerCount: 0,
  };
  PENDING_FETCH_CACHE.set(cacheKey, pendingFetch);

  const forget = (): void => forgetFetch(cacheKey, pendingFetch);
  pendingFetch.promise.then(forget, forget);

  return pendingFetch;
}

function joinFetch(
  cacheKey: string,
  pendingFetch: PendingFetch,
  signal: AbortSignal | undefined,
): Promise<CcResponse<unknown>> {
  pendingFetch.callerCount++;

  return waitUnlessAborted(pendingFetch.promise, signal, () => leaveFetch(cacheKey, pendingFetch));
}

function leaveFetch(cacheKey: string, pendingFetch: PendingFetch): void {
  pendingFetch.callerCount--;
  if (pendingFetch.callerCount === 0) {
    // nobody waits for it anymore: the next caller must start a new fetch rather than join this one
    forgetFetch(cacheKey, pendingFetch);
    pendingFetch.abortController.abort();
  }
}

function forgetFetch(cacheKey: string, pendingFetch: PendingFetch): void {
  // once every caller left, a new fetch may already have taken the key
  if (PENDING_FETCH_CACHE.get(cacheKey) === pendingFetch) {
    PENDING_FETCH_CACHE.delete(cacheKey);
  }
}
