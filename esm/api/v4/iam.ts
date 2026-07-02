import { pickNonNull } from '../../pick-non-null.js';

/**
 * POST /iam/organisations/{ownerId}/iam/materia-db-kv/{KVId}/tokens
 */
export function createMateriaDBKVToken(params: { ownerId: string; KVId: string }) {
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
 */
export function listOrganisationTokens(params: { ownerId: string; from: string; size: string }) {
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
 */
export function revokeToken(params: { ownerId: string; tokenId: string }) {
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
 */
export function getOrganisationToken(params: { ownerId: string; tokenId: string }) {
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
 */
export function listTokenRevocations(params: { from: string; size: string }) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'get',
    url: `/v4/iam/tokens/revocations`,
    headers: { Accept: 'application/json' },
    queryParams: pickNonNull(params, ['from', 'size']),
    // no body
  });
}
