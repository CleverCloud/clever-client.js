import { pickNonNull } from '../../pick-non-null.js';

/**
 * GET /saas/grafana/{id}
 * @param {Object} params
 * @param {String} params.zone_id
 */
export function getGrafanaOrganisation(params) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'get',
    url: `/v4/saas/grafana/${params.id}`,
    headers: { Accept: 'application/json' },
    // no query params
    // no body
  });
}
