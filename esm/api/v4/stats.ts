import { pickNonNull } from '../../pick-non-null.js';

/**
 * GET /stats/organisations/{ownerId}/requests
 */
export function fetchHeatmapPoints(params: { ownerId: string; applicationId: string }) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'get',
    url: `/v4/stats/organisations/${params.ownerId}/requests`,
    headers: { Accept: 'application/json' },
    queryParams: pickNonNull(params, ['applicationId']),
    // no body
  });
}
