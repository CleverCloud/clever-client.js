/**
 * GET /w10tokens/accessLogs/read/{orgaId}
 */
export function getWarp10AccessLogsToken(params: { orgaId: string }) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'get',
    url: `/v2/w10tokens/accessLogs/read/${params.orgaId}`,
    headers: { Accept: 'application/json' },
    // no query params
    // no body
  });
}
