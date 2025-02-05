import { pickNonNull } from '../../pick-non-null.js';

/**
 * GET /orchestration/organisations/{ownerId}/applications/{applicationId}/instances
 * @param {Object} params
 * @param {String} params.ownerId
 * @param {String} params.applicationId
 * @param {String} params.since
 * @param {String} params.until
 * @param {String} params.includeState
 * @param {String} params.excludeState
 * @param {String} params.undefined
 * @param {String} params.limit
 * @param {String} params.order
 */
export function getApplicationInstances(params) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'get',
    url: `/v4/orchestration/organisations/${params.ownerId}/applications/${params.applicationId}/instances`,
    headers: { Accept: 'application/json' },
    queryParams: pickNonNull(params, ['since', 'until', 'includeState', 'excludeState', 'limit', 'order']),
    // no body
  });
}

/**
 * GET /orchestration/organisations/{ownerId}/applications/{applicationId}/instances/{instanceId}
 * @param {Object} params
 * @param {String} params.ownerId
 * @param {String} params.applicationId
 * @param {String} params.undefined
 */
export function getInstance(params) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'get',
    url: `/v4/orchestration/organisations/${params.ownerId}/applications/${params.applicationId}/instances/${params.instanceId}`,
    headers: { Accept: 'application/json' },
    // no query params
    // no body
  });
}
