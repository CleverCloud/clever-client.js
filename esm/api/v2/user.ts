import { pickNonNull } from '../../pick-non-null.js';

/**
 * PUT /self/change_password
 */
export function todo_changeUserPassword(_params: object, body: object) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'put',
    url: `/v2/self/change_password`,
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
    // no query params
    body,
  });
}

/**
 * GET /self/cli_tokens
 */
export function todo_getSelfCliTokens(params: { cli_token: string }) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'get',
    url: `/v2/self/cli_tokens`,
    headers: { Accept: 'application/json' },
    queryParams: pickNonNull(params, ['cli_token']),
    // no body
  });
}

/**
 * GET /self/confirmation_email
 */
export function todo_getConfirmationEmail() {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'get',
    url: `/v2/self/confirmation_email`,
    headers: { Accept: 'application/json' },
    // no query params
    // no body
  });
}

/**
 * GET /self/emails
 */
export function todo_getEmailAddresses() {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'get',
    url: `/v2/self/emails`,
    headers: { Accept: 'application/json' },
    // no query params
    // no body
  });
}

/**
 * DELETE /self/emails/{email}
 */
export function todo_removeEmailAddress(params: { email: string }) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'delete',
    url: `/v2/self/emails/${params.email}`,
    headers: { Accept: 'application/json' },
    // no query params
    // no body
  });
}

/**
 * PUT /self/emails/{email}
 */
export function todo_addEmailAddress(params: { email: string }, body: object) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'put',
    url: `/v2/self/emails/${params.email}`,
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
    // no query params
    body,
  });
}

/**
 * GET /self/id
 */
export function getId() {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'get',
    url: `/v2/self/id`,
    headers: { Accept: 'application/json' },
    // no query params
    // no body
  });
}

/**
 * GET /self/keys
 */
export function todo_getSshKeys() {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'get',
    url: `/v2/self/keys`,
    headers: { Accept: 'application/json' },
    // no query params
    // no body
  });
}

/**
 * DELETE /self/keys/{key}
 */
export function todo_removeSshKey(params: { key: string }) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'delete',
    url: `/v2/self/keys/${params.key}`,
    headers: { Accept: 'application/json' },
    // no query params
    // no body
  });
}

/**
 * PUT /self/keys/{key}
 */
export function todo_addSshKey(params: { key: string }, body: string) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'put',
    url: `/v2/self/keys/${params.key}`,
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
    // no query params
    body,
  });
}

/**
 * DELETE /self/mfa/{kind}
 */
export function todo_deleteSelfMFA(params: { kind: string }) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'delete',
    url: `/v2/self/mfa/${params.kind}`,
    headers: { Accept: 'application/json' },
    // no query params
    // no body
  });
}

/**
 * POST /self/mfa/{kind}
 */
export function todo_createSelfMFA(params: { kind: string }) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'post',
    url: `/v2/self/mfa/${params.kind}`,
    headers: { Accept: 'application/json' },
    // no query params
    // no body
  });
}

/**
 * PUT /self/mfa/{kind}
 */
export function todo_setSelfFavouriteMFA(params: { kind: string }, body: object) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'put',
    url: `/v2/self/mfa/${params.kind}`,
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
    // no query params
    body,
  });
}

/**
 * GET /self/mfa/{kind}/backupcodes
 */
export function todo_getSelfBackupCodes(params: { kind: string }) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'get',
    url: `/v2/self/mfa/${params.kind}/backupcodes`,
    headers: { Accept: 'application/json' },
    // no query params
    // no body
  });
}

/**
 * POST /self/mfa/{kind}/confirmation
 */
export function todo_validateSelfMFA(params: { kind: string }, body: object) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'post',
    url: `/v2/self/mfa/${params.kind}/confirmation`,
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
    // no query params
    body,
  });
}

/**
 * DELETE /self/tokens
 */
export function todo_revokeSelfTokens() {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'delete',
    url: `/v2/self/tokens`,
    headers: { Accept: 'application/json' },
    // no query params
    // no body
  });
}

/**
 * GET /self/tokens
 */
export function todo_listSelfTokens() {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'get',
    url: `/v2/self/tokens`,
    headers: { Accept: 'application/json' },
    // no query params
    // no body
  });
}

/**
 * DELETE /self/tokens/{token}
 */
export function todo_revokeSelfToken(params: { token: string }) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'delete',
    url: `/v2/self/tokens/${params.token}`,
    headers: { Accept: 'application/json' },
    // no query params
    // no body
  });
}

/**
 * GET /self/validate_email
 */
export function todo_validateEmail(params: { validationKey: string }) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'get',
    url: `/v2/self/validate_email`,
    headers: { Accept: 'application/json' },
    queryParams: pickNonNull(params, ['validationKey']),
    // no body
  });
}

/**
 * GET /summary
 */
export function getSummary(params: { full: string }) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'get',
    url: `/v2/summary`,
    headers: { Accept: 'application/json' },
    queryParams: pickNonNull(params, ['full']),
    // no body
  });
}

/**
 * POST /users
 */
export function create(_params: object, body: object) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'post',
    url: `/v2/users`,
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    // no query params
    body,
  });
}
