/**
 * @typedef {import('../../request.types.js').RequestParams} RequestParams
 */

/**
 * GET /self/tokens/current
 * @returns {Promise<RequestParams>}
 */
export function getCurrentTokenInfo() {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'get',
    url: `/v2/self/tokens/current`,
    headers: { Accept: 'application/json' },
    // no query params
    // no body
  });
}
