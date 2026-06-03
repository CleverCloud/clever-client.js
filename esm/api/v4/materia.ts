/**
 * GET /materia/organisations/{ownerId}/materia/databases/{id}
 */
export function getMateriaKvInfo(params: { ownerId: string; id: string }) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'get',
    url: `/v4/materia/organisations/${params.ownerId}/materia/databases/${params.id}`,
    headers: { Accept: 'application/json' },
    // no query params
    // no body
  });
}
