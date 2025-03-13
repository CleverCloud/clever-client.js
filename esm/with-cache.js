import { pickNonNull } from './pick-non-null.js';

const cache = new Map();

/**
 * @param {Record<string, any>} cacheParams
 * @returns {string}
 */
function getKey(cacheParams) {
  const objectKey = pickNonNull(cacheParams, [
    'API_HOST',
    'WARP_10_HOST',
    'API_OAUTH_TOKEN',
    'API_OAUTH_TOKEN_SECRET',
    'OAUTH_CONSUMER_KEY',
    'OAUTH_CONSUMER_SECRET',
    'method',
    'url',
    'queryParams',
  ]);
  return JSON.stringify(objectKey);
}

export const NO_CACHE = 0;
export const ONE_SECOND = 1000;
export const ONE_DAY = 1000 * 60 * 60 * 24;

/**
 *
 * @param {Record<string, any>} cacheParams
 * @param {number} cacheDelay
 * @param {() => Promise<T>} createPromise
 * @returns {Promise<T>}
 * @template T
 */
export function withCache(cacheParams, cacheDelay, createPromise) {
  const cacheKey = getKey(cacheParams);

  if (cacheParams.method === 'get' && cache.has(cacheKey) && cacheDelay !== NO_CACHE) {
    return cache.get(cacheKey);
  }

  const promise = createPromise();

  if (cacheParams.method === 'get' && cacheDelay !== NO_CACHE) {
    cache.set(cacheKey, promise);
    setTimeout(() => {
      cache.delete(cacheKey);
    }, cacheDelay);
  }

  return promise;
}
