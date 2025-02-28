import { pickNonNull } from '../../pick-non-null.js';

/**
 * @typedef {import('../../request.types.js').RequestParams} RequestParams
 */

/**
 * GET /logs/organisations/{ownerId}/applications/{applicationId}/accesslogs
 * @param {Object} params
 * @param {String} params.ownerId
 * @param {String} params.applicationId
 * @param {String} params.since
 * @param {String} params.until
 * @param {String} params.limit
 * @param {String} params.field
 * @param {String} params.throttleElements
 * @param {String} params.throttlePerInMilliseconds
 * @returns {Promise<RequestParams>}
 */
export function streamAccessLogs(params) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'get',
    url: `/v4/logs/organisations/${params.ownerId}/applications/${params.applicationId}/accesslogs`,
    headers: { Accept: 'text/event-stream' },
    queryParams: pickNonNull(params, ['since', 'until', 'limit', 'field', 'throttleElements', 'throttlePerInMilliseconds']),
    // no body
  });
}

/**
 * GET /logs/organisations/{ownerId}/applications/{applicationId}/logs
 * @param {Object} params
 * @param {String} params.ownerId
 * @param {String} params.applicationId
 * @param {String} params.since
 * @param {String} params.until
 * @param {String} params.limit
 * @param {String} params.deploymentId
 * @param {String} params.instanceId
 * @param {String} params.filter
 * @param {String} params.service
 * @param {String} params.field
 * @param {String} params.throttleElements
 * @param {String} params.throttlePerInMilliseconds
 * @returns {Promise<RequestParams>}
 */
export function streamLogs(params) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'get',
    url: `/v4/logs/organisations/${params.ownerId}/applications/${params.applicationId}/logs`,
    headers: { Accept: 'text/event-stream' },
    queryParams: pickNonNull(params, ['since', 'until', 'limit', 'deploymentId', 'instanceId', 'filter', 'service', 'field', 'throttleElements', 'throttlePerInMilliseconds']),
    // no body
  });
}
