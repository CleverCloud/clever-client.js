import { pickNonNull } from '../../pick-non-null.js';

/**
 * @typedef {import('../../request.types.js').RequestParams} RequestParams
 */

/**
 * POST /oauth/access_token
 * @param {Object} params
 * @param {Object} body
 * @returns {Promise<RequestParams>}
 */
export function fetchAccessToken(params, body) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'post',
    url: `/v2/oauth/access_token`,
    headers: { Accept: 'application/x-www-form-urlencoded', 'Content-Type': 'application/x-www-form-urlencoded' },
    // no query params
    body,
  });
}

/**
 * GET /oauth/login_data
 * @param {Object} params
 * @param {String} params.oauth_key
 * @returns {Promise<RequestParams>}
 */
export function getLoginData(params) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'get',
    url: `/v2/oauth/login_data`,
    headers: { Accept: 'application/json' },
    queryParams: pickNonNull(params, ['oauth_key']),
    // no body
  });
}

/**
 * POST /oauth/request_token
 * @param {Object} params
 * @param {String} params.partner_id
 * @param {Object} body
 * @returns {Promise<RequestParams>}
 */
export function fetchRequestToken(params, body) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'post',
    url: `/v2/oauth/request_token`,
    headers: { Accept: 'application/x-www-form-urlencoded', 'Content-Type': 'application/x-www-form-urlencoded' },
    queryParams: pickNonNull(params, ['partner_id']),
    body,
  });
}

/**
 * POST /sessions/login
 * @param {Object} params
 * @param {Object} body
 * @returns {Promise<RequestParams>}
 */
export function loginWithEmailAndPassword(params, body) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'post',
    url: `/v2/sessions/login`,
    headers: { Accept: 'text/html', 'Content-Type': 'application/x-www-form-urlencoded' },
    // no query params
    body,
  });
}

/**
 * POST /sessions/mfa_login
 * @param {Object} params
 * @param {Object} body
 * @returns {Promise<RequestParams>}
 */
export function loginWithMfa(params, body) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'post',
    url: `/v2/sessions/mfa_login`,
    headers: { Accept: 'text/html', 'Content-Type': 'application/x-www-form-urlencoded' },
    // no query params
    body,
  });
}
