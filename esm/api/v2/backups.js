/**
 * @typedef {import('../../request.types.js').RequestParams} RequestParams
 */

/**
 * GET /backups/{ownerId}/{ref}
 * @param {Object} params
 * @param {String} params.ownerId
 * @param {String} params.ref
 * @returns {Promise<RequestParams>}
 */
export function getBackups(params) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'get',
    url: `/v2/backups/${params.ownerId}/${params.ref}`,
    headers: { Accept: 'application/json' },
    // no query params
    // no body
  });
}
