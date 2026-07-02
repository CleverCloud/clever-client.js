import { pickNonNull } from '../../pick-non-null.js';

/**
 * GET /orchestration/organisations/{ownerId}/applications/{applicationId}/deployments
 */
export function listApplicationDeployments(params: {
  ownerId: string;
  applicationId: string;
  includeApplicationConfiguration: string;
  action: string;
  limit: string;
  order: string;
}) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'get',
    url: `/v4/orchestration/organisations/${params.ownerId}/applications/${params.applicationId}/deployments`,
    headers: { Accept: 'application/json' },
    queryParams: pickNonNull(params, ['includeApplicationConfiguration', 'action', 'limit', 'order']),
    // no body
  });
}
