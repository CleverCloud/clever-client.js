import { pickNonNull } from '../../pick-non-null.js';

/**
 * GET /products/zones
 * @param {Object} params
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
 * @param {Object} params
 * @param {String} params.undefined
 */
export function listZones(params) {
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
 * GET /products/zones/{zoneName}
 * @param {Object} params
 * @param {String} params.zoneName
 */
export function getZone(params) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'get',
    url: `/v4/products/zones/${params.zoneName}`,
    headers: { Accept: 'application/json' },
    // no query params
    // no body
  });
}
