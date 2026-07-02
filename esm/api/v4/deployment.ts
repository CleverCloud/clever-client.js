import { pickNonNull } from '../../pick-non-null.js';

/**
 * GET /orchestration/organisations/{ownerId}/applications/{applicationId}/deployments/{deploymentId}
 */
export function getApplicationDeployment(params: {
  ownerId: string;
  applicationId: string;
  deploymentId: string;
  includeApplicationConfiguration: string;
}) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'get',
    url: `/v4/orchestration/organisations/${params.ownerId}/applications/${params.applicationId}/deployments/${params.deploymentId}`,
    headers: { Accept: 'application/json' },
    queryParams: pickNonNull(params, ['includeApplicationConfiguration']),
    // no body
  });
}
