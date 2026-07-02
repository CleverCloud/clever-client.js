/**
 * GET /metrics/read/{orgaId}
 */
export function getToken(params: { orgaId: string }) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'get',
    url: `/v2/metrics/read/${params.orgaId}`,
    headers: { Accept: 'application/json' },
    // no query params
    // no body
  });
}
