/**
 * DELETE /saas/grafana/{id}
 */
export function deleteGrafanaOrganisation(params: { id: string }) {
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
 */
export function getGrafanaOrganisation(params: { id: string }) {
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
 */
export function createGrafanaOrganisation(params: { id: string }) {
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
 */
export function resetGrafanaOrganisation(params: { id: string }) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'post',
    url: `/v4/saas/grafana/${params.id}/reset`,
    headers: { Accept: 'application/json' },
    // no query params
    // no body
  });
}
