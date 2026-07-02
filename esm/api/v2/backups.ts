/**
 * GET /backups/{ownerId}/{ref}
 */
export function getBackups(params: { ownerId: string; ref: string }) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'get',
    url: `/v2/backups/${params.ownerId}/${params.ref}`,
    headers: { Accept: 'application/json' },
    // no query params
    // no body
  });
}
