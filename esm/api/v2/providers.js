import { pickNonNull } from '../../pick-non-null.js';

/**
 * GET /providers/{providerId}/{addonId}
 * @param {Object} params
 * @param {String} params.providerId
 * @param {String} params.addonId
 */
export function getAddon(params) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'get',
    url: `/v2/providers/${params.providerId}/${params.addonId}`,
    headers: { Accept: 'application/json' },
    // no query params
    // no body
  });
}
