import { pickNonNull } from '../../pick-non-null.js';

/**
 * GET /products/zones
 */
export function getAllZones() {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'get',
    url: `/v4/products/zones`,
    headers: { Accept: 'application/json' },
    // no query params
    // no body
  });
}

/**
 * GET /products/zones
 */
export function listZones(params: { ownerId: string }) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'get',
    url: `/v4/products/zones`,
    headers: { Accept: 'application/json' },
    queryParams: pickNonNull(params, ['ownerId']),
    // no body
  });
}

/**
 * GET /products/zones/{zoneName}
 */
export function getZone(params: { zoneName: string; ownerId?: string }) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'get',
    url: `/v4/products/zones/${params.zoneName}`,
    headers: { Accept: 'application/json' },
    queryParams: pickNonNull(params, ['ownerId']),
    // no body
  });
}
