import { pickNonNull } from '../../pick-non-null.js';

/**
 * GET /stats/organisations/{ownerId}/resources/{resourceId}/metrics
 * @param {Object} params
 * @param {String} params.ownerId
 * @param {String} params.resourceId
 * @param {String} params.only
 * @param {String} params.interval
 * @param {String} params.span
 * @param {String} params.end
 * @param {String} params.fill
 */
export function getOrganisationApplicationMetrics(params) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'get',
    url: `/v4/stats/organisations/${params.ownerId}/resources/${params.resourceId}/metrics`,
    headers: { Accept: 'application/json' },
    queryParams: pickNonNull(params, ['only', 'interval', 'span', 'end', 'fill']),
    // no body
  });
}
