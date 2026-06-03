import { pickNonNull } from '../../pick-non-null.js';

/**
 * GET /products/addonproviders
 */
export function getAllAddonProviders(params: { orgaId: string }) {
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
 */
export function getAddonProvider(params: { provider_id: string; orgaId: string }) {
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
 */
export function getAvailableInstances(params: { for: string }) {
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
