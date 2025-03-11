import { pickNonNull } from '../../pick-non-null.js';

/**
 * @typedef {import('../../request.types.js').RequestParams} RequestParams
 */

/**
 * POST /iam/organisations/{ownerId}/iam/materia-db-kv/{KVId}/tokens
 * @param {Object} params
 * @param {String} params.ownerId
 * @param {String} params.KVId
 * @returns {Promise<RequestParams>}
 */
export function createMateriaDBKVToken(params) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'post',
    url: `/v4/iam/organisations/${params.ownerId}/iam/materia-db-kv/${params.KVId}/tokens`,
    headers: { Accept: 'application/json' },
    // no query params
    // no body
  });
}

/**
 * GET /iam/organisations/{ownerId}/iam/tokens
 * @param {Object} params
 * @param {String} params.ownerId
 * @param {String} params.from
 * @param {String} params.size
 * @returns {Promise<RequestParams>}
 */
export function listOrganisationTokens(params) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'get',
    url: `/v4/iam/organisations/${params.ownerId}/iam/tokens`,
    headers: { Accept: 'application/json' },
    queryParams: pickNonNull(params, ['from', 'size']),
    // no body
  });
}

/**
 * DELETE /iam/organisations/{ownerId}/iam/tokens/{tokenId}
 * @param {Object} params
 * @param {String} params.ownerId
 * @param {String} params.tokenId
 * @returns {Promise<RequestParams>}
 */
export function revokeToken(params) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'delete',
    url: `/v4/iam/organisations/${params.ownerId}/iam/tokens/${params.tokenId}`,
    headers: {},
    // no query params
    // no body
  });
}

/**
 * GET /iam/organisations/{ownerId}/iam/tokens/{tokenId}
 * @param {Object} params
 * @param {String} params.ownerId
 * @param {String} params.tokenId
 * @returns {Promise<RequestParams>}
 */
export function getOrganisationToken(params) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'get',
    url: `/v4/iam/organisations/${params.ownerId}/iam/tokens/${params.tokenId}`,
    headers: { Accept: 'application/json' },
    // no query params
    // no body
  });
}

/**
 * GET /iam/tokens/revocations
 * @param {Object} params
 * @param {String} params.from
 * @param {String} params.size
 * @returns {Promise<RequestParams>}
 */
export function listTokenRevocations(params) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'get',
    url: `/v4/iam/tokens/revocations`,
    headers: { Accept: 'application/json' },
    queryParams: pickNonNull(params, ['from', 'size']),
    // no body
  });
}
