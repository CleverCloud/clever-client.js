import { pickNonNull } from '../../pick-non-null.js';

/**
 * GET /console/settings
 */
export function list(params: { env: string }) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'get',
    url: `/v4/console/settings`,
    headers: { Accept: 'application/json' },
    queryParams: pickNonNull(params, ['env']),
    // no body
  });
}

/**
 * DELETE /console/settings/{name}
 */
export function _delete(params: { env: string; name: string }) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'delete',
    url: `/v4/console/settings/${params.name}`,
    headers: {},
    queryParams: pickNonNull(params, ['env']),
    // no body
  });
}

/**
 * GET /console/settings/{name}
 */
export function get(params: { env: string; name: string }) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'get',
    url: `/v4/console/settings/${params.name}`,
    headers: { Accept: 'application/json' },
    queryParams: pickNonNull(params, ['env']),
    // no body
  });
}

/**
 * PUT /console/settings/{name}
 */
export function put(params: { env: string; name: string }, body: object) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'put',
    url: `/v4/console/settings/${params.name}`,
    headers: { 'Content-Type': 'text/plain' },
    queryParams: pickNonNull(params, ['env']),
    body,
  });
}
