import { pickNonNull } from '../../pick-non-null.js';

/**
 * GET /addon-providers/addon-matomo/addons/{matomoId}
 */
export function getMatomo(params: { matomoId: string }) {
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
 */
export function getMatomoVHosts(params: { keycloakToken: string }) {
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
 */
export function createTardis(params: { appOnly: string }, body: object) {
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
 */
export function deleteTardis(params: { tardisId: string }) {
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
 */
export function getTardis(params: { tardisId: string }) {
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
 */
export function deleteTardisAddonWithOwner(params: { ownerId: string; tardisId: string }) {
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
 */
export function getTardisAddonWithOwner(params: { ownerId: string; tardisId: string }) {
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
 */
export function revertTardisAddonDeletion(params: { ownerId: string; tardisId: string }) {
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
 */
export function deleteTardisAddonToken(params: { ownerId: string; tardisId: string; tokenId: string }) {
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
 */
export function getTardisToken(params: { ownerId: string; tardisId: string; tokenId: string }) {
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
 */
export function listTardisAddonTokens(params: {
  ownerId: string;
  tardisId: string;
  onlyId: string;
  from: string;
  to: string;
}) {
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
 */
export function createTardisToken(params: { ownerId: string; tardisId: string }, body: object) {
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
 */
export function listTardisAddons(params: { ownerId: string; from: string; to: string }) {
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
 */
export function createTardisAddonWithOwner(params: { ownerId: string; appOnly: string }, body: object) {
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
 */
export function revokeAndDeleteTardisAddonToken(_params: object, body: object) {
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
 */
export function getConfigProvider(params: { configurationProviderId: string }) {
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
 */
export function getConfigProviderEnv(params: { configurationProviderId: string }) {
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
 */
export function updateConfigProviderEnv(params: { configurationProviderId: string }, body: object) {
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
 */
export function createMatomo(_params: object, body: object) {
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
 */
export function deleteMatomo(params: { matomoId: string }) {
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
 */
export function createTardisAddon(_params: object, body: object) {
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
 */
export function deleteTardisAddon(params: { tardisId: string }) {
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
 */
export function getTardisAddon(params: { tardisId: string }) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'get',
    url: `/v4/v2/providers/addon-tardis/resources/${params.tardisId}`,
    headers: { Accept: 'application/json' },
    // no query params
    // no body
  });
}
