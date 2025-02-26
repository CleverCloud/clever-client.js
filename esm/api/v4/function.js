import { pickNonNull } from '../../pick-non-null.js';

/**
 * GET /functions/organisations/{ownerId}/functions
 * @param {Object} params
 * @param {String} params.ownerId
 */
export function list(params) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'get',
    url: `/v4/functions/organisations/${params.ownerId}/functions`,
    headers: { Accept: 'application/json' },
    // no query params
    // no body
  });
}

/**
 * POST /functions/organisations/{ownerId}/functions
 * @param {Object} params
 * @param {String} params.ownerId
 * @param {Object} body
 */
export function create(params, body) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'post',
    url: `/v4/functions/organisations/${params.ownerId}/functions`,
    headers: { 'Content-Type': 'application/json' },
    // no query params
    body,
  });
}

/**
 * DELETE /functions/organisations/{ownerId}/functions/{functionId}
 * @param {Object} params
 * @param {String} params.ownerId
 * @param {String} params.functionId
 */
export function _delete(params) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'delete',
    url: `/v4/functions/organisations/${params.ownerId}/functions/${params.functionId}`,
    headers: {},
    // no query params
    // no body
  });
}

/**
 * GET /functions/organisations/{ownerId}/functions/{functionId}
 * @param {Object} params
 * @param {String} params.ownerId
 * @param {String} params.functionId
 */
export function get(params) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'get',
    url: `/v4/functions/organisations/${params.ownerId}/functions/${params.functionId}`,
    headers: { Accept: 'application/json' },
    // no query params
    // no body
  });
}

/**
 * PUT /functions/organisations/{ownerId}/functions/{functionId}
 * @param {Object} params
 * @param {String} params.ownerId
 * @param {String} params.functionId
 * @param {Object} body
 */
export function update(params, body) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'put',
    url: `/v4/functions/organisations/${params.ownerId}/functions/${params.functionId}`,
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
    // no query params
    body,
  });
}

/**
 * GET /functions/organisations/{ownerId}/functions/{functionId}/deployments
 * @param {Object} params
 * @param {String} params.ownerId
 * @param {String} params.functionId
 */
export function listDeployments(params) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'get',
    url: `/v4/functions/organisations/${params.ownerId}/functions/${params.functionId}/deployments`,
    headers: { Accept: 'application/json' },
    // no query params
    // no body
  });
}

/**
 * POST /functions/organisations/{ownerId}/functions/{functionId}/deployments
 * @param {Object} params
 * @param {String} params.ownerId
 * @param {String} params.functionId
 * @param {Object} body
 */
export function createDeployment(params, body) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'post',
    url: `/v4/functions/organisations/${params.ownerId}/functions/${params.functionId}/deployments`,
    headers: { 'Content-Type': 'application/json' },
    // no query params
    body,
  });
}

/**
 * DELETE /functions/organisations/{ownerId}/functions/{functionId}/deployments/{deploymentId}
 * @param {Object} params
 * @param {String} params.ownerId
 * @param {String} params.functionId
 * @param {String} params.deploymentId
 */
export function deleteDeployment(params) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'delete',
    url: `/v4/functions/organisations/${params.ownerId}/functions/${params.functionId}/deployments/${params.deploymentId}`,
    headers: {},
    // no query params
    // no body
  });
}

/**
 * GET /functions/organisations/{ownerId}/functions/{functionId}/deployments/{deploymentId}
 * @param {Object} params
 * @param {String} params.ownerId
 * @param {String} params.functionId
 * @param {String} params.deploymentId
 */
export function getDeployment(params) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'get',
    url: `/v4/functions/organisations/${params.ownerId}/functions/${params.functionId}/deployments/${params.deploymentId}`,
    headers: { Accept: 'application/json' },
    // no query params
    // no body
  });
}

/**
 * POST /functions/organisations/{ownerId}/functions/{functionId}/deployments/{deploymentId}
 * @param {Object} params
 * @param {String} params.ownerId
 * @param {String} params.functionId
 * @param {String} params.deploymentId
 */
export function triggerDeployment(params) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'post',
    url: `/v4/functions/organisations/${params.ownerId}/functions/${params.functionId}/deployments/${params.deploymentId}`,
    headers: {},
    // no query params
    // no body
  });
}

/**
 * PUT /functions/organisations/{ownerId}/functions/{functionId}/deployments/{deploymentId}
 * @param {Object} params
 * @param {String} params.ownerId
 * @param {String} params.functionId
 * @param {String} params.deploymentId
 * @param {Object} body
 */
export function updateDeployment(params, body) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'put',
    url: `/v4/functions/organisations/${params.ownerId}/functions/${params.functionId}/deployments/${params.deploymentId}`,
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
    // no query params
    body,
  });
}
