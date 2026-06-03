import { pickNonNull } from '../../pick-non-null.js';

/**
 * GET /logs/organisations/{ownerId}/applications/{applicationId}/accesslogs
 */
export function streamAccessLogs(params: {
  ownerId: string;
  applicationId: string;
  since: string;
  until: string;
  limit: string;
  field: string;
  throttleElements: string;
  throttlePerInMilliseconds: string;
}) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'get',
    url: `/v4/logs/organisations/${params.ownerId}/applications/${params.applicationId}/accesslogs`,
    headers: { Accept: 'text/event-stream' },
    queryParams: pickNonNull(params, [
      'since',
      'until',
      'limit',
      'field',
      'throttleElements',
      'throttlePerInMilliseconds',
    ]),
    // no body
  });
}

/**
 * GET /logs/organisations/{ownerId}/applications/{applicationId}/logs
 */
export function streamLogs(params: {
  ownerId: string;
  applicationId: string;
  since: string;
  until: string;
  limit: string;
  deploymentId: string;
  instanceId: string;
  filter: string;
  service: string;
  field: string;
  throttleElements: string;
  throttlePerInMilliseconds: string;
}) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'get',
    url: `/v4/logs/organisations/${params.ownerId}/applications/${params.applicationId}/logs`,
    headers: { Accept: 'text/event-stream' },
    queryParams: pickNonNull(params, [
      'since',
      'until',
      'limit',
      'deploymentId',
      'instanceId',
      'filter',
      'service',
      'field',
      'throttleElements',
      'throttlePerInMilliseconds',
    ]),
    // no body
  });
}
