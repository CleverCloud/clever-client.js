import { pickNonNull } from '../../pick-non-null.js';

/**
 * GET /orchestration/organisations/{ownerId}/applications/{applicationId}/deployments
 * @param {Object} params
 * @param {String} params.ownerId
 * @param {String} params.applicationId
 * @param {String} params.includeApplicationConfiguration
 * @param {String} params.action
 * @param {String} params.limit
 * @param {String} params.order
 */
export function listApplicationDeployments(params) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'get',
    url: `/v4/orchestration/organisations/${params.ownerId}/applications/${params.applicationId}/deployments`,
    headers: { Accept: 'application/json' },
    queryParams: pickNonNull(params, ['includeApplicationConfiguration', 'action', 'limit', 'order']),
    // no body
  });
}
