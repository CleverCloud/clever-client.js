import { pickNonNull } from '../../pick-non-null.js';

/**
 * @typedef {import('../../request.types.js').RequestParams} RequestParams
 */

/**
 * GET /addon-providers/addon-matomo/addons/{matomoId}
 * @param {Object} params
 * @param {String} params.matomoId
 * @returns {Promise<RequestParams>}
 */
export function getMatomo(params) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'get',
    url: `/v4/addon-providers/addon-matomo/addons/${params.matomoId}`,
    headers: { Accept: 'application/json' },
    // no query params
    // no body
  });
}

/**
 * GET /addon-providers/addon-matomo/token/validate
 * @param {Object} params
 * @param {String} params.keycloakToken
 * @returns {Promise<RequestParams>}
 */
export function getMatomoVHosts(params) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'get',
    url: `/v4/addon-providers/addon-matomo/token/validate`,
    headers: { Accept: 'application/json' },
    queryParams: pickNonNull(params, ['keycloakToken']),
    // no body
  });
}

/**
 * POST /addon-providers/addon-tardis/addons
 * @param {Object} params
 * @param {String} params.appOnly
 * @param {Object} body
 * @returns {Promise<RequestParams>}
 */
export function createTardis(params, body) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'post',
    url: `/v4/addon-providers/addon-tardis/addons`,
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
    queryParams: pickNonNull(params, ['appOnly']),
    body,
  });
}

/**
 * DELETE /addon-providers/addon-tardis/addons/{tardisId}
 * @param {Object} params
 * @param {String} params.tardisId
 * @returns {Promise<RequestParams>}
 */
export function deleteTardis(params) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'delete',
    url: `/v4/addon-providers/addon-tardis/addons/${params.tardisId}`,
    headers: {},
    // no query params
    // no body
  });
}

/**
 * GET /addon-providers/addon-tardis/addons/{tardisId}
 * @param {Object} params
 * @param {String} params.tardisId
 * @returns {Promise<RequestParams>}
 */
export function getTardis(params) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'get',
    url: `/v4/addon-providers/addon-tardis/addons/${params.tardisId}`,
    headers: { Accept: 'application/json' },
    // no query params
    // no body
  });
}

/**
 * DELETE /addon-providers/addon-tardis/organisations/{ownerId}/addon/{tardisId}
 * @param {Object} params
 * @param {String} params.ownerId
 * @param {String} params.tardisId
 * @returns {Promise<RequestParams>}
 */
export function deleteTardisAddonWithOwner(params) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'delete',
    url: `/v4/addon-providers/addon-tardis/organisations/${params.ownerId}/addon/${params.tardisId}`,
    headers: {},
    // no query params
    // no body
  });
}

/**
 * GET /addon-providers/addon-tardis/organisations/{ownerId}/addon/{tardisId}
 * @param {Object} params
 * @param {String} params.ownerId
 * @param {String} params.tardisId
 * @returns {Promise<RequestParams>}
 */
export function getTardisAddonWithOwner(params) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'get',
    url: `/v4/addon-providers/addon-tardis/organisations/${params.ownerId}/addon/${params.tardisId}`,
    headers: { Accept: 'application/json' },
    // no query params
    // no body
  });
}

/**
 * POST /addon-providers/addon-tardis/organisations/{ownerId}/addon/{tardisId}/revert
 * @param {Object} params
 * @param {String} params.ownerId
 * @param {String} params.tardisId
 * @returns {Promise<RequestParams>}
 */
export function revertTardisAddonDeletion(params) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'post',
    url: `/v4/addon-providers/addon-tardis/organisations/${params.ownerId}/addon/${params.tardisId}/revert`,
    headers: { Accept: 'application/json' },
    // no query params
    // no body
  });
}

/**
 * DELETE /addon-providers/addon-tardis/organisations/{ownerId}/addon/{tardisId}/token/{tokenId}
 * @param {Object} params
 * @param {String} params.ownerId
 * @param {String} params.tardisId
 * @param {String} params.tokenId
 * @returns {Promise<RequestParams>}
 */
export function deleteTardisAddonToken(params) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'delete',
    url: `/v4/addon-providers/addon-tardis/organisations/${params.ownerId}/addon/${params.tardisId}/token/${params.tokenId}`,
    headers: {},
    // no query params
    // no body
  });
}

/**
 * GET /addon-providers/addon-tardis/organisations/{ownerId}/addon/{tardisId}/token/{tokenId}
 * @param {Object} params
 * @param {String} params.ownerId
 * @param {String} params.tardisId
 * @param {String} params.tokenId
 * @returns {Promise<RequestParams>}
 */
export function getTardisToken(params) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'get',
    url: `/v4/addon-providers/addon-tardis/organisations/${params.ownerId}/addon/${params.tardisId}/token/${params.tokenId}`,
    headers: { Accept: 'application/json' },
    // no query params
    // no body
  });
}

/**
 * GET /addon-providers/addon-tardis/organisations/{ownerId}/addon/{tardisId}/tokens
 * @param {Object} params
 * @param {String} params.ownerId
 * @param {String} params.tardisId
 * @param {String} params.onlyId
 * @param {String} params.from
 * @param {String} params.to
 * @returns {Promise<RequestParams>}
 */
export function listTardisAddonTokens(params) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'get',
    url: `/v4/addon-providers/addon-tardis/organisations/${params.ownerId}/addon/${params.tardisId}/tokens`,
    headers: { Accept: 'application/json' },
    queryParams: pickNonNull(params, ['onlyId', 'from', 'to']),
    // no body
  });
}

/**
 * POST /addon-providers/addon-tardis/organisations/{ownerId}/addon/{tardisId}/tokens
 * @param {Object} params
 * @param {String} params.ownerId
 * @param {String} params.tardisId
 * @param {Object} body
 * @returns {Promise<RequestParams>}
 */
export function createTardisToken(params, body) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'post',
    url: `/v4/addon-providers/addon-tardis/organisations/${params.ownerId}/addon/${params.tardisId}/tokens`,
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
    // no query params
    body,
  });
}

/**
 * GET /addon-providers/addon-tardis/organisations/{ownerId}/addons
 * @param {Object} params
 * @param {String} params.ownerId
 * @param {String} params.from
 * @param {String} params.to
 * @returns {Promise<RequestParams>}
 */
export function listTardisAddons(params) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'get',
    url: `/v4/addon-providers/addon-tardis/organisations/${params.ownerId}/addons`,
    headers: { Accept: 'application/json' },
    queryParams: pickNonNull(params, ['from', 'to']),
    // no body
  });
}

/**
 * POST /addon-providers/addon-tardis/organisations/{ownerId}/addons
 * @param {Object} params
 * @param {String} params.ownerId
 * @param {String} params.appOnly
 * @param {Object} body
 * @returns {Promise<RequestParams>}
 */
export function createTardisAddonWithOwner(params, body) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'post',
    url: `/v4/addon-providers/addon-tardis/organisations/${params.ownerId}/addons`,
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
    queryParams: pickNonNull(params, ['appOnly']),
    body,
  });
}

/**
 * POST /addon-providers/addon-tardis/token/revoke
 * @param {Object} params
 * @param {Object} body
 * @returns {Promise<RequestParams>}
 */
export function revokeAndDeleteTardisAddonToken(params, body) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'post',
    url: `/v4/addon-providers/addon-tardis/token/revoke`,
    headers: { 'Content-Type': 'application/json' },
    // no query params
    body,
  });
}

/**
 * GET /addon-providers/config-provider/addons/{configurationProviderId}
 * @param {Object} params
 * @param {String} params.configurationProviderId
 * @returns {Promise<RequestParams>}
 */
export function getConfigProvider(params) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'get',
    url: `/v4/addon-providers/config-provider/addons/${params.configurationProviderId}`,
    headers: { Accept: 'application/json' },
    // no query params
    // no body
  });
}

/**
 * GET /addon-providers/config-provider/addons/{configurationProviderId}/env
 * @param {Object} params
 * @param {String} params.configurationProviderId
 * @returns {Promise<RequestParams>}
 */
export function getConfigProviderEnv(params) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'get',
    url: `/v4/addon-providers/config-provider/addons/${params.configurationProviderId}/env`,
    headers: { Accept: 'application/json' },
    // no query params
    // no body
  });
}

/**
 * PUT /addon-providers/config-provider/addons/{configurationProviderId}/env
 * @param {Object} params
 * @param {String} params.configurationProviderId
 * @param {Object} body
 * @returns {Promise<RequestParams>}
 */
export function updateConfigProviderEnv(params, body) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'put',
    url: `/v4/addon-providers/config-provider/addons/${params.configurationProviderId}/env`,
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
    // no query params
    body,
  });
}

/**
 * POST /v2/providers/addon-matomo/resources
 * @param {Object} params
 * @param {Object} body
 * @returns {Promise<RequestParams>}
 */
export function createMatomo(params, body) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'post',
    url: `/v4/v2/providers/addon-matomo/resources`,
    headers: { 'Content-Type': 'application/json' },
    // no query params
    body,
  });
}

/**
 * DELETE /v2/providers/addon-matomo/resources/{matomoId}
 * @param {Object} params
 * @param {String} params.matomoId
 * @returns {Promise<RequestParams>}
 */
export function deleteMatomo(params) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'delete',
    url: `/v4/v2/providers/addon-matomo/resources/${params.matomoId}`,
    headers: {},
    // no query params
    // no body
  });
}

/**
 * POST /v2/providers/addon-tardis/resources
 * @param {Object} params
 * @param {Object} body
 * @returns {Promise<RequestParams>}
 */
export function createTardisAddon(params, body) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'post',
    url: `/v4/v2/providers/addon-tardis/resources`,
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
    // no query params
    body,
  });
}

/**
 * DELETE /v2/providers/addon-tardis/resources/{tardisId}
 * @param {Object} params
 * @param {String} params.tardisId
 * @returns {Promise<RequestParams>}
 */
export function deleteTardisAddon(params) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'delete',
    url: `/v4/v2/providers/addon-tardis/resources/${params.tardisId}`,
    headers: {},
    // no query params
    // no body
  });
}

/**
 * GET /v2/providers/addon-tardis/resources/{tardisId}
 * @param {Object} params
 * @param {String} params.tardisId
 * @returns {Promise<RequestParams>}
 */
export function getTardisAddon(params) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'get',
    url: `/v4/v2/providers/addon-tardis/resources/${params.tardisId}`,
    headers: { Accept: 'application/json' },
    // no query params
    // no body
  });
}
