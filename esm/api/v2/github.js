import { pickNonNull } from '../../pick-non-null.js';

/**
 * GET /github
 * @param {Object} params
 */
export function get() {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'get',
    url: `/v2/github`,
    headers: { Accept: 'application/json' },
    // no query params
    // no body
  });
}

/**
 * GET /github/applications
 * @param {Object} params
 */
export function getApplications() {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'get',
    url: `/v2/github/applications`,
    headers: { Accept: 'application/json' },
    // no query params
    // no body
  });
}

/**
 * GET /github/callback
 * @param {Object} params
 * @param {String} params.CcOAuthData
 * @param {String} params.code
 * @param {String} params.state
 * @param {String} params.error
 * @param {String} params.error_description
 * @param {String} params.error_uri
 */
export function getCallback(params) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'get',
    url: `/v2/github/callback`,
    headers: { Accept: 'application/json' },
    queryParams: pickNonNull(params, ['code', 'state', 'error', 'error_description', 'error_uri']),
    // no body
  });
}

/**
 * GET /github/emails
 * @param {Object} params
 */
export function getEmailsAddresses() {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'get',
    url: `/v2/github/emails`,
    headers: { Accept: 'application/json' },
    // no query params
    // no body
  });
}

/**
 * GET /github/keys
 * @param {Object} params
 */
export function getKeys() {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'get',
    url: `/v2/github/keys`,
    headers: { Accept: 'application/json' },
    // no query params
    // no body
  });
}

/**
 * DELETE /github/link
 * @param {Object} params
 */
export function removeLink() {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'delete',
    url: `/v2/github/link`,
    headers: { Accept: 'application/json' },
    // no query params
    // no body
  });
}

/**
 * GET /github/link
 * @param {Object} params
 * @param {String} params.transactionId
 * @param {String} params.redirectUrl
 * @param {String} params.partner_id
 */
export function getLink(params) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'get',
    url: `/v2/github/link`,
    headers: { Accept: 'application/json' },
    queryParams: pickNonNull(params, ['transactionId', 'redirectUrl', 'partner_id']),
    // no body
  });
}

/**
 * GET /github/login
 * @param {Object} params
 * @param {String} params.redirectUrl
 * @param {String} params.fromAuthorize
 * @param {String} params.cli_token
 * @param {String} params.partner_id
 * @param {String} params.oauth_token
 * @param {String} params.invitationKey
 * @param {String} params.subscriptionSource
 */
export function getLogin(params) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'get',
    url: `/v2/github/login`,
    headers: { Accept: 'application/json' },
    queryParams: pickNonNull(params, ['redirectUrl', 'fromAuthorize', 'cli_token', 'partner_id', 'oauth_token', 'invitationKey', 'subscriptionSource']),
    // no body
  });
}

/**
 * POST /github/redeploy
 * @param {Object} params
 * @param {String} params.User-Agent
 * @param {String} params.X-Github-Event
 * @param {String} params.X-Hub-Signature
 * @param {Object} body
 */
export function redeploy(params, body) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'post',
    url: `/v2/github/redeploy`,
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
    // no query params
    body,
  });
}

/**
 * GET /github/signup
 * @param {Object} params
 * @param {String} params.redirectUrl
 * @param {String} params.fromAuthorize
 * @param {String} params.cli_token
 * @param {String} params.partner_id
 * @param {String} params.oauth_token
 * @param {String} params.invitationKey
 * @param {String} params.subscriptionSource
 * @param {String} params.terms
 */
export function signup(params) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'get',
    url: `/v2/github/signup`,
    headers: { Accept: 'application/json' },
    queryParams: pickNonNull(params, ['redirectUrl', 'fromAuthorize', 'cli_token', 'partner_id', 'oauth_token', 'invitationKey', 'subscriptionSource', 'terms']),
    // no body
  });
}

/**
 * POST /github/signup
 * @param {Object} params
 * @param {Object} body
 */
export function finishSignup(params, body) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'post',
    url: `/v2/github/signup`,
    headers: { Accept: 'application/json', 'Content-Type': 'application/x-www-form-urlencoded' },
    // no query params
    body,
  });
}

/**
 * GET /github/username
 * @param {Object} params
 */
export function getUsername() {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'get',
    url: `/v2/github/username`,
    headers: { Accept: 'application/json' },
    // no query params
    // no body
  });
}
