/**
 * @typedef {import('./plugins.type.js').RequestWrapperPlugin} RequestWrapperPlugin
 * @typedef {import('../request/request.types.js').RequestParams} RequestParams
 */

export const NO_CACHE = 0;

/**
 * @type {Map<string, Promise<import('../request/request.types.js').Response<?>>>}
 */
const CACHE = new Map();

/**
 * @param {number} [cacheDelay] The default cache delay that can also be overridden by the `requestParam.cacheDelay`. No cache by default
 * @returns {RequestWrapperPlugin}
 */
export const requestWrapperWithCache = (cacheDelay) => ({
  type: 'requestWrapper',
  async handle (requestParams, handler) {
    // no caching on HTTP method other than GET
    if (requestParams.method.toLowerCase() !== 'get') {
      return handler(requestParams);
    }

    const delay = (requestParams.cacheDelay ?? cacheDelay) ?? NO_CACHE;

    // no caching
    if (delay <= 0) {
      return handler(requestParams);
    }

    const cacheKey = calculateCacheKey(requestParams);

    // cache hit
    if (CACHE.has(cacheKey)) {
      return CACHE.get(cacheKey);
    }

    // cache miss
    const response = handler(requestParams);

    CACHE.set(cacheKey, response);
    setTimeout(() => {
      CACHE.delete(cacheKey);
    }, cacheDelay);

    return response;
  },
});

/**
 * @param {Partial<RequestParams>} requestParams
 *  @return {string}
 */
function calculateCacheKey (requestParams) {
  const cacheParams = [
    requestParams.url,
    requestParams.queryParams?.entries(),
    requestParams.headers?.get('accept'),
    requestParams.headers?.get('authorization'),
    // todo: do we need more?
  ];
  return JSON.stringify(cacheParams);
}
