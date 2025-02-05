import { pickNonNull } from '../../pick-non-null.js';

/**
 * GET /console/settings
 * @param {Object} params
 * @param {String} params.env
 */
export function list(params) {
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
 * @param {Object} params
 * @param {String} params.env
 * @param {String} params.name
 */
export function _delete(params) {
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
 * @param {Object} params
 * @param {String} params.env
 * @param {String} params.name
 */
export function get(params) {
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
 * @param {Object} params
 * @param {String} params.env
 * @param {String} params.name
 * @param {Object} body
 */
export function put(params, body) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'put',
    url: `/v4/console/settings/${params.name}`,
    headers: { 'Content-Type': 'text/plain' },
    queryParams: pickNonNull(params, ['env']),
    body,
  });
}
