import { pickNonNull } from '../../pick-non-null.js';

/**
 * DELETE /saas/grafana/{id}
 * @param {Object} params
 * @param {String} params.id
 */
export function deleteGrafanaOrganisation(params) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'delete',
    url: `/v4/saas/grafana/${params.id}`,
    headers: { Accept: 'application/json' },
    // no query params
    // no body
  });
}

/**
 * GET /saas/grafana/{id}
 * @param {Object} params
 * @param {String} params.id
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

/**
 * POST /saas/grafana/{id}
 * @param {Object} params
 * @param {String} params.id
 */
export function createGrafanaOrganisation(params) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'post',
    url: `/v4/saas/grafana/${params.id}`,
    headers: { Accept: 'application/json' },
    // no query params
    // no body
  });
}

/**
 * POST /saas/grafana/{id}/reset
 * @param {Object} params
 * @param {String} params.id
 */
export function resetGrafanaOrganisation(params) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'post',
    url: `/v4/saas/grafana/${params.id}/reset`,
    headers: { Accept: 'application/json' },
    // no query params
    // no body
  });
}
