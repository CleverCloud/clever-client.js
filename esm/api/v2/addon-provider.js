/**
 * @typedef {import('../../request.types.js').RequestParams} RequestParams
 */

/**
 * GET /organisations/{id}/addonproviders
 * @param {Object} params
 * @param {String} params.id
 * @returns {Promise<RequestParams>}
 */
export function getAll(params) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'get',
    url: `/v2/organisations/${params.id}/addonproviders`,
    headers: { Accept: 'application/json' },
    // no query params
    // no body
  });
}

/**
 * POST /organisations/{id}/addonproviders
 * @param {Object} params
 * @param {String} params.id
 * @param {Object} body
 * @returns {Promise<RequestParams>}
 */
export function create(params, body) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'post',
    url: `/v2/organisations/${params.id}/addonproviders`,
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
    // no query params
    body,
  });
}

/**
 * DELETE /organisations/{id}/addonproviders/{providerId}
 * @param {Object} params
 * @param {String} params.id
 * @param {String} params.providerId
 * @returns {Promise<RequestParams>}
 */
export function remove(params) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'delete',
    url: `/v2/organisations/${params.id}/addonproviders/${params.providerId}`,
    headers: { Accept: 'application/json' },
    // no query params
    // no body
  });
}

/**
 * GET /organisations/{id}/addonproviders/{providerId}
 * @param {Object} params
 * @param {String} params.id
 * @param {String} params.providerId
 * @returns {Promise<RequestParams>}
 */
export function get(params) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'get',
    url: `/v2/organisations/${params.id}/addonproviders/${params.providerId}`,
    headers: { Accept: 'application/json' },
    // no query params
    // no body
  });
}

/**
 * PUT /organisations/{id}/addonproviders/{providerId}
 * @param {Object} params
 * @param {String} params.id
 * @param {String} params.providerId
 * @param {Object} body
 * @returns {Promise<RequestParams>}
 */
export function update(params, body) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'put',
    url: `/v2/organisations/${params.id}/addonproviders/${params.providerId}`,
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
    // no query params
    body,
  });
}

/**
 * GET /organisations/{id}/addonproviders/{providerId}/features
 * @param {Object} params
 * @param {String} params.id
 * @param {String} params.providerId
 * @returns {Promise<RequestParams>}
 */
export function getAllFeatures(params) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'get',
    url: `/v2/organisations/${params.id}/addonproviders/${params.providerId}/features`,
    headers: { Accept: 'application/json' },
    // no query params
    // no body
  });
}

/**
 * POST /organisations/{id}/addonproviders/{providerId}/features
 * @param {Object} params
 * @param {String} params.id
 * @param {String} params.providerId
 * @param {Object} body
 * @returns {Promise<RequestParams>}
 */
export function addFeature(params, body) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'post',
    url: `/v2/organisations/${params.id}/addonproviders/${params.providerId}/features`,
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
    // no query params
    body,
  });
}

/**
 * DELETE /organisations/{id}/addonproviders/{providerId}/features/{featureId}
 * @param {Object} params
 * @param {String} params.id
 * @param {String} params.providerId
 * @param {String} params.featureId
 * @returns {Promise<RequestParams>}
 */
export function removeFeature(params) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'delete',
    url: `/v2/organisations/${params.id}/addonproviders/${params.providerId}/features/${params.featureId}`,
    headers: { Accept: 'application/json' },
    // no query params
    // no body
  });
}

/**
 * GET /organisations/{id}/addonproviders/{providerId}/plans
 * @param {Object} params
 * @param {String} params.id
 * @param {String} params.providerId
 * @returns {Promise<RequestParams>}
 */
export function getAllPlans(params) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'get',
    url: `/v2/organisations/${params.id}/addonproviders/${params.providerId}/plans`,
    headers: { Accept: 'application/json' },
    // no query params
    // no body
  });
}

/**
 * POST /organisations/{id}/addonproviders/{providerId}/plans
 * @param {Object} params
 * @param {String} params.id
 * @param {String} params.providerId
 * @param {Object} body
 * @returns {Promise<RequestParams>}
 */
export function addPlan(params, body) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'post',
    url: `/v2/organisations/${params.id}/addonproviders/${params.providerId}/plans`,
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
    // no query params
    body,
  });
}

/**
 * DELETE /organisations/{id}/addonproviders/{providerId}/plans/{planId}
 * @param {Object} params
 * @param {String} params.id
 * @param {String} params.providerId
 * @param {String} params.planId
 * @returns {Promise<RequestParams>}
 */
export function removePlan(params) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'delete',
    url: `/v2/organisations/${params.id}/addonproviders/${params.providerId}/plans/${params.planId}`,
    headers: { Accept: 'application/json' },
    // no query params
    // no body
  });
}

/**
 * GET /organisations/{id}/addonproviders/{providerId}/plans/{planId}
 * @param {Object} params
 * @param {String} params.id
 * @param {String} params.providerId
 * @param {String} params.planId
 * @returns {Promise<RequestParams>}
 */
export function getPlan(params) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'get',
    url: `/v2/organisations/${params.id}/addonproviders/${params.providerId}/plans/${params.planId}`,
    headers: { Accept: 'application/json' },
    // no query params
    // no body
  });
}

/**
 * PUT /organisations/{id}/addonproviders/{providerId}/plans/{planId}
 * @param {Object} params
 * @param {String} params.id
 * @param {String} params.providerId
 * @param {String} params.planId
 * @param {Object} body
 * @returns {Promise<RequestParams>}
 */
export function updatePlan(params, body) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'put',
    url: `/v2/organisations/${params.id}/addonproviders/${params.providerId}/plans/${params.planId}`,
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
    // no query params
    body,
  });
}

/**
 * DELETE /organisations/{id}/addonproviders/{providerId}/plans/{planId}/features/{featureName}
 * @param {Object} params
 * @param {String} params.id
 * @param {String} params.providerId
 * @param {String} params.planId
 * @param {String} params.featureName
 * @returns {Promise<RequestParams>}
 */
export function removePlanFeature(params) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'delete',
    url: `/v2/organisations/${params.id}/addonproviders/${params.providerId}/plans/${params.planId}/features/${params.featureName}`,
    headers: { Accept: 'application/json' },
    // no query params
    // no body
  });
}

/**
 * PUT /organisations/{id}/addonproviders/{providerId}/plans/{planId}/features/{featureName}
 * @param {Object} params
 * @param {String} params.id
 * @param {String} params.providerId
 * @param {String} params.planId
 * @param {String} params.featureName
 * @param {Object} body
 * @returns {Promise<RequestParams>}
 */
export function updatePlanFeature(params, body) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'put',
    url: `/v2/organisations/${params.id}/addonproviders/${params.providerId}/plans/${params.planId}/features/${params.featureName}`,
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
    // no query params
    body,
  });
}

/**
 * GET /organisations/{id}/addonproviders/{providerId}/sso
 * @param {Object} params
 * @param {String} params.id
 * @param {String} params.providerId
 * @returns {Promise<RequestParams>}
 */
export function getSsoData(params) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'get',
    url: `/v2/organisations/${params.id}/addonproviders/${params.providerId}/sso`,
    headers: { Accept: 'application/json' },
    // no query params
    // no body
  });
}

/**
 * GET /organisations/{id}/addonproviders/{providerId}/tags
 * @param {Object} params
 * @param {String} params.id
 * @param {String} params.providerId
 * @returns {Promise<RequestParams>}
 */
export function getAllTags(params) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'get',
    url: `/v2/organisations/${params.id}/addonproviders/${params.providerId}/tags`,
    headers: { Accept: 'application/json' },
    // no query params
    // no body
  });
}

/**
 * POST /organisations/{id}/addonproviders/{providerId}/testers
 * @param {Object} params
 * @param {String} params.id
 * @param {String} params.providerId
 * @returns {Promise<RequestParams>}
 */
export function addBetaTester(params) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'post',
    url: `/v2/organisations/${params.id}/addonproviders/${params.providerId}/testers`,
    headers: { Accept: 'application/json' },
    // no query params
    // no body
  });
}
