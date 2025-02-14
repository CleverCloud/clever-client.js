import { pickNonNull } from '../../pick-non-null.js';

/**
 * GET /stats/organisations/{ownerId}/requests
 * @param {Object} params
 * @param {String} params.ownerId
 * @param {String} params.application
 */
export function fetchHeatmapPoints(params) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'get',
    url: `/v4/stats/organisations/${params.ownerId}/requests`,
    headers: { Accept: 'application/json' },
    queryParams: pickNonNull(params, ['application']),
    // no body
  });
}
