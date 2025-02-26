import { pickNonNull } from '../../pick-non-null.js';

/**
 * GET /materia/organisations/{ownerId}/materia/databases/{id}
 * @param {Object} params
 * @param {String} params.ownerId
 * @param {String} params.id
 */
export function getMateriaKvInfo(params) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'get',
    url: `/v4/materia/organisations/${params.ownerId}/materia/databases/${params.id}`,
    headers: { Accept: 'application/json' },
    // no query params
    // no body
  });
}
