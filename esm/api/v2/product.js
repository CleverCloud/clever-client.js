import { pickNonNull } from '../../pick-non-null.js';

/**
 * GET /products/addonproviders
 * @param {Object} params
 * @param {String} params.orgaId
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
 * @param {Object} params
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
 * @param {Object} params
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
