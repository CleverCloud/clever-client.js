import { pickNonNull } from '../../pick-non-null.js';

/**
 * GET /logs/{appId}
 */
export function getOldLogs(params: {
  appId: string;
  limit?: string;
  order?: string;
  after?: string;
  since?: string;
  before?: string;
  filter?: string;
  deployment_id?: string;
}) {
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
 */
export function getDrains(params: { appId: string }) {
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
 */
export function createDrain(params: { appId: string }, body: object) {
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
 */
export function deleteDrain(params: { appId: string; drainId: string }) {
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
 */
export function updateDrainState(params: { appId: string; drainId: string }, body: object) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'put',
    url: `/v2/logs/${params.appId}/drains/${params.drainId}/state`,
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
    // no query params
    body,
  });
}
