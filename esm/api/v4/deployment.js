import { pickNonNull } from '../../pick-non-null.js';

/**
 * @typedef {import('../../request.types.js').RequestParams} RequestParams
 */

/**
 * GET /orchestration/organisations/{ownerId}/applications/{applicationId}/deployments/{deploymentId}
 * @param {Object} params
 * @param {String} params.ownerId
 * @param {String} params.applicationId
 * @param {String} params.deploymentId
 * @param {String} params.includeApplicationConfiguration
 * @returns {Promise<RequestParams>}
 */
export function getApplicationDeployment(params) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'get',
    url: `/v4/orchestration/organisations/${params.ownerId}/applications/${params.applicationId}/deployments/${params.deploymentId}`,
    headers: { Accept: 'application/json' },
    queryParams: pickNonNull(params, ['includeApplicationConfiguration']),
    // no body
  });
}
