import { pickNonNull } from '../../pick-non-null.js';

/**
 * @typedef {import('../../request.types.js').RequestParams} RequestParams
 */

/**
 * GET /products/addonproviders
 * @param {Object} params
 * @param {String} params.orgaId
 * @returns {Promise<RequestParams>}
 */
export function getAllAddonProviders(params) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'get',
    url: `/v2/products/addonproviders`,
    headers: { Accept: 'application/json' },
    queryParams: pickNonNull(params, ['orgaId']),
    // no body
  });
}

/**
 * GET /products/addonproviders/{provider_id}
 * @param {Object} params
 * @param {String} params.provider_id
 * @param {String} params.orgaId
 * @returns {Promise<RequestParams>}
 */
export function getAddonProvider(params) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'get',
    url: `/v2/products/addonproviders/${params.provider_id}`,
    headers: { Accept: 'application/json' },
    queryParams: pickNonNull(params, ['orgaId']),
    // no body
  });
}

/**
 * GET /products/instances
 * @param {Object} params
 * @param {String} params.for
 * @returns {Promise<RequestParams>}
 */
export function getAvailableInstances(params) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'get',
    url: `/v2/products/instances`,
    headers: { Accept: 'application/json' },
    queryParams: pickNonNull(params, ['for']),
    // no body
  });
}

/**
 * GET /products/prices
 * @returns {Promise<RequestParams>}
 */
export function getCreditPrice() {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'get',
    url: `/v2/products/prices`,
    headers: { Accept: 'application/json' },
    // no query params
    // no body
  });
}

/**
 * GET /products/zones
 * @returns {Promise<RequestParams>}
 */
export function getAllZones() {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'get',
    url: `/v2/products/zones`,
    headers: { Accept: 'application/json' },
    // no query params
    // no body
  });
}
