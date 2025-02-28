/**
 * @typedef {import('../../request.types.js').RequestParams} RequestParams
 */

/**
 * GET /providers/es-addon/tmp/services-flavors
 * @returns {Promise<RequestParams>}
 */
export function getEsOptionsFlavors() {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'get',
    url: `/v2/providers/es-addon/tmp/services-flavors`,
    headers: { Accept: 'application/json' },
    // no query params
    // no body
  });
}

/**
 * GET /providers/{providerId}/{addonId}
 * @param {Object} params
 * @param {String} params.providerId
 * @param {String} params.addonId
 * @returns {Promise<RequestParams>}
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
