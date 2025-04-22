/**
 * @typedef {import('../../types/request.types.js').RequestWrapper} RequestWrapper
 * @typedef {import('../../types/request.types.js').CcRequestParams} CcRequestParams
 */

/**
 * @type {Map<string, import('../../types/request.types.js').CcResponse<?>>}
 */
const CACHE = new Map();

/**
 * @type {RequestWrapper}
 */
export const requestWithCache = async (request, handler) => {
  // no caching on HTTP method other than GET
  if (request.cache === false || request.method.toLowerCase() !== 'get') {
    return handler(request);
  }

  const cacheKey = calculateCacheKey(request);

  // cache hit
  if (request.cache !== 'reload' && CACHE.has(cacheKey)) {
    return CACHE.get(cacheKey);
  }

  // cache miss
  const response = await handler(request);

  if (request.cacheDelay > 0) {
    CACHE.set(cacheKey, response);
    setTimeout(() => {
      CACHE.delete(cacheKey);
    }, request.cacheDelay);
  }

  return response;
};

/**
 * @param {Partial<CcRequestParams>} requestParams
 *  @returns {string}
 */
function calculateCacheKey(requestParams) {
  const cacheParams = [
    requestParams.url,
    requestParams.queryParams?.entries(),
    requestParams.headers?.get('accept'),
    requestParams.headers?.get('authorization'),
    // todo: do we need more?
  ];
  return JSON.stringify(cacheParams);
}
