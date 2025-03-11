/**
 * @typedef {import('../../request.types.js').RequestParams} RequestParams
 */

/**
 * GET /addon-providers/jenkins/addons/{addonId}/updates
 * @param {Object} params
 * @param {String} params.addonId
 * @returns {Promise<RequestParams>}
 */
export function getJenkinsUpdates(params) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'get',
    url: `/v4/addon-providers/jenkins/addons/${params.addonId}/updates`,
    headers: { Accept: 'application/json' },
    // no query params
    // no body
  });
}

/**
 * GET /addon-providers/{providerId}
 * @param {Object} params
 * @param {String} params.providerId
 * @returns {Promise<RequestParams>}
 */
export function getAddonProvider(params) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'get',
    url: `/v4/addon-providers/${params.providerId}`,
    headers: { Accept: 'application/json' },
    // no query params
    // no body
  });
}

/**
 * GET /addon-providers/{providerId}/addons/{addonId}
 * @param {Object} params
 * @param {String} params.providerId
 * @param {String} params.addonId
 * @returns {Promise<RequestParams>}
 */
export function getAddon(params) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'get',
    url: `/v4/addon-providers/${params.providerId}/addons/${params.addonId}`,
    headers: { Accept: 'application/json' },
    // no query params
    // no body
  });
}

/**
 * GET /addon-providers/{providerId}/clusters/{clusterId}
 * @param {Object} params
 * @param {String} params.providerId
 * @param {String} params.clusterId
 * @returns {Promise<RequestParams>}
 */
export function getCluster(params) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'get',
    url: `/v4/addon-providers/${params.providerId}/clusters/${params.clusterId}`,
    headers: { Accept: 'application/json' },
    // no query params
    // no body
  });
}
