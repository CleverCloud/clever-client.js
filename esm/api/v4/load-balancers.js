/**
 * @typedef {import('../../request.types.js').RequestParams} RequestParams
 */

/**
 * GET /load-balancers/organisations/{ownerId}/addons/{addonId}/load-balancers/{loadBalancerKind}
 * @param {Object} params
 * @param {String} params.ownerId
 * @param {String} params.addonId
 * @param {String} params.loadBalancerKind
 * @returns {Promise<RequestParams>}
 */
export function listAddonLoadBalancers(params) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'get',
    url: `/v4/load-balancers/organisations/${params.ownerId}/addons/${params.addonId}/load-balancers/${params.loadBalancerKind}`,
    headers: { Accept: 'application/json' },
    // no query params
    // no body
  });
}

/**
 * GET /load-balancers/organisations/{ownerId}/applications/{appId}/load-balancers/default
 * @param {Object} params
 * @param {String} params.ownerId
 * @param {String} params.appId
 * @returns {Promise<RequestParams>}
 */
export function getDefaultLoadBalancersDnsInfo(params) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'get',
    url: `/v4/load-balancers/organisations/${params.ownerId}/applications/${params.appId}/load-balancers/default`,
    headers: { Accept: 'application/json' },
    // no query params
    // no body
  });
}

/**
 * GET /load-balancers/organisations/{ownerId}/applications/{applicationId}/load-balancers/{loadBalancerKind}
 * @param {Object} params
 * @param {String} params.ownerId
 * @param {String} params.applicationId
 * @param {String} params.loadBalancerKind
 * @returns {Promise<RequestParams>}
 */
export function listApplicationLoadBalancers(params) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'get',
    url: `/v4/load-balancers/organisations/${params.ownerId}/applications/${params.applicationId}/load-balancers/${params.loadBalancerKind}`,
    headers: { Accept: 'application/json' },
    // no query params
    // no body
  });
}
