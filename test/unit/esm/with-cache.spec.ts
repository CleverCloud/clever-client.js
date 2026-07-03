import { describe, expect, it } from 'vitest';
import { NO_CACHE, withCache } from '../../../esm/with-cache.js';

describe('withCache()', () => {
  it('does not cache a rejected promise: the next call retries', async () => {
    const cacheParams = { method: 'get', url: '/v2/test-rejection' };
    let attempts = 0;
    const createPromise = () => {
      attempts++;
      return Promise.reject(new Error('transient error'));
    };

    await withCache(cacheParams, 1000, createPromise).catch(() => {});
    await withCache(cacheParams, 1000, createPromise).catch(() => {});
    await withCache(cacheParams, 1000, createPromise).catch(() => {});

    expect(attempts).toBe(3);
  });

  it('caches a fulfilled promise: the next call reuses it', async () => {
    const cacheParams = { method: 'get', url: '/v2/test-fulfillment' };
    let attempts = 0;
    const createPromise = () => {
      attempts++;
      return Promise.resolve('ok');
    };

    const result1 = await withCache(cacheParams, 1000, createPromise);
    const result2 = await withCache(cacheParams, 1000, createPromise);

    expect(attempts).toBe(1);
    expect(result1).toBe('ok');
    expect(result2).toBe('ok');
  });

  it('shares one in-flight promise between concurrent callers', async () => {
    const cacheParams = { method: 'get', url: '/v2/test-dedupe' };
    let attempts = 0;
    const createPromise = () => {
      attempts++;
      return Promise.resolve('ok');
    };

    const [result1, result2] = await Promise.all([
      withCache(cacheParams, 1000, createPromise),
      withCache(cacheParams, 1000, createPromise),
    ]);

    expect(attempts).toBe(1);
    expect(result1).toBe('ok');
    expect(result2).toBe('ok');
  });

  it('does not cache anything when cacheDelay is NO_CACHE', async () => {
    const cacheParams = { method: 'get', url: '/v2/test-no-cache' };
    let attempts = 0;
    const createPromise = () => {
      attempts++;
      return Promise.resolve('ok');
    };

    await withCache(cacheParams, NO_CACHE, createPromise);
    await withCache(cacheParams, NO_CACHE, createPromise);

    expect(attempts).toBe(2);
  });

  it('a retried entry survives the original failed call stale eviction timer (identity guard)', async () => {
    const cacheParams = { method: 'get', url: '/v2/test-identity-guard' };
    const cacheDelay = 60;
    let attempts = 0;
    const createPromise = () => {
      attempts++;
      return attempts === 1 ? Promise.reject(new Error('transient error')) : Promise.resolve('ok');
    };

    // t=0: fails, evicted right away by the rejection handler
    await withCache(cacheParams, cacheDelay, createPromise).catch(() => {});

    // t=25: retry succeeds and schedules its own eviction timer for t=85
    await new Promise((resolve) => setTimeout(resolve, 25));
    const retried = await withCache(cacheParams, cacheDelay, createPromise);
    expect(retried).toBe('ok');
    expect(attempts).toBe(2);

    // t=70: past the first call's stale timer (t=60), but before the retry's own timer (t=85)
    await new Promise((resolve) => setTimeout(resolve, 45));
    const stillCached = await withCache(cacheParams, cacheDelay, createPromise);
    expect(stillCached).toBe('ok');
    expect(attempts).toBe(2); // the stale timer must not have evicted the retried entry

    // t=95: past the retry's own timer (t=85): the entry legitimately expires now
    await new Promise((resolve) => setTimeout(resolve, 25));
    const fresh = await withCache(cacheParams, cacheDelay, createPromise);
    expect(fresh).toBe('ok');
    expect(attempts).toBe(3);
  });
});
