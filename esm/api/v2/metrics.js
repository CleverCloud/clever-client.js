/**
 * @typedef {import('../../request.types.js').RequestParams} RequestParams
 */

/**
 * GET /metrics/read/{orgaId}
 * @param {Object} params
 * @param {String} params.orgaId
 * @returns {Promise<RequestParams>}
 */
export function getToken(params) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'get',
    url: `/v2/metrics/read/${params.orgaId}`,
    headers: { Accept: 'application/json' },
    // no query params
    // no body
  });
}
