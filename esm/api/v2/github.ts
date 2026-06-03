import { pickNonNull } from '../../pick-non-null.js';

/**
 * GET /github
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
 */
export function getCallback(params: {
  CcOAuthData?: string;
  code?: string;
  state?: string;
  error?: string;
  error_description?: string;
  error_uri?: string;
}) {
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
 */
export function getLink(params: { transactionId?: string; redirectUrl?: string; partner_id?: string }) {
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
 */
export function getLogin(params: {
  redirectUrl?: string;
  fromAuthorize?: string;
  cli_token?: string;
  partner_id?: string;
  oauth_token?: string;
  invitationKey?: string;
  subscriptionSource?: string;
}) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'get',
    url: `/v2/github/login`,
    headers: { Accept: 'application/json' },
    queryParams: pickNonNull(params, [
      'redirectUrl',
      'fromAuthorize',
      'cli_token',
      'partner_id',
      'oauth_token',
      'invitationKey',
      'subscriptionSource',
    ]),
    // no body
  });
}

/**
 * POST /github/redeploy
 */
export function redeploy(
  _params: { 'User-Agent': string; 'X-Github-Event': string; 'X-Hub-Signature': string },
  body: object,
) {
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
 */
export function signup(params: {
  redirectUrl?: string;
  fromAuthorize?: string;
  cli_token?: string;
  partner_id?: string;
  oauth_token?: string;
  invitationKey?: string;
  subscriptionSource?: string;
  terms?: string;
}) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'get',
    url: `/v2/github/signup`,
    headers: { Accept: 'application/json' },
    queryParams: pickNonNull(params, [
      'redirectUrl',
      'fromAuthorize',
      'cli_token',
      'partner_id',
      'oauth_token',
      'invitationKey',
      'subscriptionSource',
      'terms',
    ]),
    // no body
  });
}

/**
 * POST /github/signup
 */
export function finishSignup(_params: object, body: object) {
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
