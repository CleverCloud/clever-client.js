import { pickNonNull } from '../../pick-non-null.js';

/**
 * @typedef {import('../../request.types.js').RequestParams} RequestParams
 */

/**
 * GET /stats/organisations/{ownerId}/requests
 * @param {Object} params
 * @param {String} params.ownerId
 * @param {String} params.applicationId
 * @returns {Promise<RequestParams>}
 */
export function fetchHeatmapPoints(params) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'get',
    url: `/v4/stats/organisations/${params.ownerId}/requests`,
    headers: { Accept: 'application/json' },
    queryParams: pickNonNull(params, ['applicationId']),
    // no body
  });
}
