import { pickNonNull } from '../../pick-non-null.js';

/**
 * GET /saas/heptapod/{id}/heptapod.host/price-prevision
 * @param {Object} params
 * @param {String} params.id
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
