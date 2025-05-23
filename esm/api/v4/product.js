import { pickNonNull } from '../../pick-non-null.js';

/**
 * @typedef {import('../../request.types.js').RequestParams} RequestParams
 */

/**
 * GET /products/zones
 * @returns {Promise<RequestParams>}
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
 * @param {String} params.ownerId
 * @returns {Promise<RequestParams>}
 */
export function listZones(params) {
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
 * @param {Object} params
 * @param {String} params.zoneName
 * @returns {Promise<RequestParams>}
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
