/**
 * @typedef {import('../../request.types.js').RequestParams} RequestParams
 */

/**
 * GET /w10tokens/accessLogs/read/{orgaId}
 * @param {Object} params
 * @param {String} params.orgaId
 * @returns {Promise<RequestParams>}
 */
export function getWarp10AccessLogsToken(params) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'get',
    url: `/v2/w10tokens/accessLogs/read/${params.orgaId}`,
    headers: { Accept: 'application/json' },
    // no query params
    // no body
  });
}
