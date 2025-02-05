import { pickNonNull } from '../../pick-non-null.js';

/**
 * GET /w10tokens/accessLogs/read/{orgaId}
 * @param {Object} params
 * @param {String} params.orgaId
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
