import { pickNonNull } from '../../pick-non-null.js';

/**
 * @typedef {import('../../request.types.js').RequestParams} RequestParams
 */

/**
 * GET /logs/{appId}
 * @param {Object} params
 * @param {String} params.appId
 * @param {String} params.limit
 * @param {String} params.order
 * @param {String} params.after
 * @param {String} params.since
 * @param {String} params.before
 * @param {String} params.filter
 * @param {String} params.deployment_id
 * @returns {Promise<RequestParams>}
 */
export function getOldLogs(params) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'get',
    url: `/v2/logs/${params.appId}`,
    headers: { Accept: 'application/json' },
    queryParams: pickNonNull(params, ['limit', 'order', 'after', 'since', 'before', 'filter', 'deployment_id']),
    // no body
  });
}

/**
 * GET /logs/{appId}/drains
 * @param {Object} params
 * @param {String} params.appId
 * @returns {Promise<RequestParams>}
 */
export function getDrains(params) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'get',
    url: `/v2/logs/${params.appId}/drains`,
    headers: { Accept: 'application/json' },
    // no query params
    // no body
  });
}

/**
 * POST /logs/{appId}/drains
 * @param {Object} params
 * @param {String} params.appId
 * @param {Object} body
 * @returns {Promise<RequestParams>}
 */
export function createDrain(params, body) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'post',
    url: `/v2/logs/${params.appId}/drains`,
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
    // no query params
    body,
  });
}

/**
 * DELETE /logs/{appId}/drains/{drainId}
 * @param {Object} params
 * @param {String} params.appId
 * @param {String} params.drainId
 * @returns {Promise<RequestParams>}
 */
export function deleteDrain(params) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'delete',
    url: `/v2/logs/${params.appId}/drains/${params.drainId}`,
    headers: { Accept: 'application/json' },
    // no query params
    // no body
  });
}

/**
 * PUT /logs/{appId}/drains/{drainId}/state
 * @param {Object} params
 * @param {String} params.appId
 * @param {String} params.drainId
 * @param {Object} body
 * @returns {Promise<RequestParams>}
 */
export function updateDrainState(params, body) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'put',
    url: `/v2/logs/${params.appId}/drains/${params.drainId}/state`,
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
    // no query params
    body,
  });
}
