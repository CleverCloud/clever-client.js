import { pickNonNull } from '../../pick-non-null.js';

/**
 * GET /orchestration/organisations/{ownerId}/applications/{applicationId}/instances
 */
export function getAllApplicationInstances(params: {
  ownerId: string;
  applicationId: string;
  since: string;
  until: string;
  includeState: string;
  excludeState: string;
  deploymentId: string;
  limit: string;
  order: string;
}) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'get',
    url: `/v4/orchestration/organisations/${params.ownerId}/applications/${params.applicationId}/instances`,
    headers: { Accept: 'application/json' },
    queryParams: pickNonNull(params, [
      'since',
      'until',
      'includeState',
      'excludeState',
      'deploymentId',
      'limit',
      'order',
    ]),
    // no body
  });
}

/**
 * GET /orchestration/organisations/{ownerId}/applications/{applicationId}/instances
 */
export function getApplicationInstances(params: {
  ownerId: string;
  applicationId: string;
  since: string;
  until: string;
  includeState: string;
  excludeState: string;
  deploymentId: string;
  limit: string;
  order: string;
}) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'get',
    url: `/v4/orchestration/organisations/${params.ownerId}/applications/${params.applicationId}/instances`,
    headers: { Accept: 'application/json' },
    queryParams: pickNonNull(params, [
      'since',
      'until',
      'includeState',
      'excludeState',
      'deploymentId',
      'limit',
      'order',
    ]),
    // no body
  });
}

/**
 * GET /orchestration/organisations/{ownerId}/applications/{applicationId}/instances/{instanceId}
 */
export function getInstance(params: { ownerId: string; applicationId: string; instanceId: string }) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'get',
    url: `/v4/orchestration/organisations/${params.ownerId}/applications/${params.applicationId}/instances/${params.instanceId}`,
    headers: { Accept: 'application/json' },
    // no query params
    // no body
  });
}
