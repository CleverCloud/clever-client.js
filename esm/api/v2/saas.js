/**
 * @typedef {import('../../request.types.js').RequestParams} RequestParams
 */

/**
 * GET /saas/heptapod/{id}/heptapod.host/price-prevision
 * @param {Object} params
 * @param {String} params.id
 * @returns {Promise<RequestParams>}
 */
export function getHeptapodPricePrevision(params) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'get',
    url: `/v2/saas/heptapod/${params.id}/heptapod.host/price-prevision`,
    headers: { Accept: 'application/json' },
    // no query params
    // no body
  });
}
