import { pickNonNull } from '../../pick-non-null.js';

/**
 * @typedef {import('../../request.types.js').RequestParams} RequestParams
 */

/**
 * PUT /self/change_password
 * @param {Object} params
 * @param {Object} body
 * @returns {Promise<RequestParams>}
 */
export function todo_changeUserPassword(params, body) {
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
 * @param {Object} params
 * @param {String} params.cli_token
 * @returns {Promise<RequestParams>}
 */
export function todo_getSelfCliTokens(params) {
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
 * @returns {Promise<RequestParams>}
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
 * @returns {Promise<RequestParams>}
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
 * @param {Object} params
 * @param {String} params.email
 * @returns {Promise<RequestParams>}
 */
export function todo_removeEmailAddress(params) {
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
 * @param {Object} params
 * @param {String} params.email
 * @param {Object} body
 * @returns {Promise<RequestParams>}
 */
export function todo_addEmailAddress(params, body) {
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
 * @returns {Promise<RequestParams>}
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
 * @returns {Promise<RequestParams>}
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
 * @param {Object} params
 * @param {String} params.key
 * @returns {Promise<RequestParams>}
 */
export function todo_removeSshKey(params) {
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
 * @param {Object} params
 * @param {String} params.key
 * @param {Object} body
 * @returns {Promise<RequestParams>}
 */
export function todo_addSshKey(params, body) {
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
 * @param {Object} params
 * @param {String} params.kind
 * @returns {Promise<RequestParams>}
 */
export function todo_deleteSelfMFA(params) {
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
 * @param {Object} params
 * @param {String} params.kind
 * @returns {Promise<RequestParams>}
 */
export function todo_createSelfMFA(params) {
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
 * @param {Object} params
 * @param {String} params.kind
 * @param {Object} body
 * @returns {Promise<RequestParams>}
 */
export function todo_setSelfFavouriteMFA(params, body) {
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
 * @param {Object} params
 * @param {String} params.kind
 * @returns {Promise<RequestParams>}
 */
export function todo_getSelfBackupCodes(params) {
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
 * @param {Object} params
 * @param {String} params.kind
 * @param {Object} body
 * @returns {Promise<RequestParams>}
 */
export function todo_validateSelfMFA(params, body) {
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
 * @returns {Promise<RequestParams>}
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
 * @returns {Promise<RequestParams>}
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
 * @param {Object} params
 * @param {String} params.token
 * @returns {Promise<RequestParams>}
 */
export function todo_revokeSelfToken(params) {
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
 * @param {Object} params
 * @param {String} params.validationKey
 * @returns {Promise<RequestParams>}
 */
export function todo_validateEmail(params) {
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
 * @param {Object} params
 * @param {String} params.full
 * @returns {Promise<RequestParams>}
 */
export function getSummary(params) {
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
 * @param {Object} params
 * @param {Object} body
 * @returns {Promise<RequestParams>}
 */
export function create(params, body) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'post',
    url: `/v2/users`,
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    // no query params
    body,
  });
}
