import { pickNonNull } from '../../pick-non-null.js';

/**
 * POST /oauth/access_token
 */
export function fetchAccessToken(_params: object, body: object) {
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
 */
export function getLoginData(params: { oauth_key?: string }) {
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
 */
export function fetchRequestToken(params: { partner_id?: string }, body: object) {
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
 */
export function loginWithEmailAndPassword(_params: object, body: object) {
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
 */
export function loginWithMfa(_params: object, body: object) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'post',
    url: `/v2/sessions/mfa_login`,
    headers: { Accept: 'text/html', 'Content-Type': 'application/x-www-form-urlencoded' },
    // no query params
    body,
  });
}
