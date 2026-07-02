/**
 * GET /saas/heptapod/{id}/heptapod.host/price-prevision
 */
export function getHeptapodPricePrevision(params: { id: string }) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'get',
    url: `/v2/saas/heptapod/${params.id}/heptapod.host/price-prevision`,
    headers: { Accept: 'application/json' },
    // no query params
    // no body
  });
}
