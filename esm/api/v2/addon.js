import { pickNonNull } from '../../pick-non-null.js';

/**
 * GET /organisations/{id}/addons
 * GET /self/addons
 * @param {Object} params
 * @param {String} params.id
 */
export function getAll(params) {
  const urlBase = params.id == null ? '/self' : `/organisations/${params.id}`;
  return Promise.resolve({
    method: 'get',
    url: `/v2${urlBase}/addons`,
    headers: { Accept: 'application/json' },
    // no query params
    // no body
  });
}

/**
 * POST /organisations/{id}/addons
 * POST /self/addons
 * @param {Object} params
 * @param {String} params.id
 * @param {Object} body
 */
export function create(params, body) {
  const urlBase = params.id == null ? '/self' : `/organisations/${params.id}`;
  return Promise.resolve({
    method: 'post',
    url: `/v2${urlBase}/addons`,
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
    // no query params
    body,
  });
}

/**
 * POST /organisations/{id}/addons/preorders
 * POST /self/addons/preorders
 * @param {Object} params
 * @param {String} params.id
 * @param {Object} body
 */
export function preorder(params, body) {
  const urlBase = params.id == null ? '/self' : `/organisations/${params.id}`;
  return Promise.resolve({
    method: 'post',
    url: `/v2${urlBase}/addons/preorders`,
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
    // no query params
    body,
  });
}

/**
 * DELETE /organisations/{id}/addons/{addonId}
 * DELETE /self/addons/{addonId}
 * @param {Object} params
 * @param {String} params.id
 * @param {String} params.addonId
 */
export function remove(params) {
  const urlBase = params.id == null ? '/self' : `/organisations/${params.id}`;
  return Promise.resolve({
    method: 'delete',
    url: `/v2${urlBase}/addons/${params.addonId}`,
    headers: { Accept: 'application/json' },
    // no query params
    // no body
  });
}

/**
 * GET /organisations/{id}/addons/{addonId}
 * GET /self/addons/{addonId}
 * @param {Object} params
 * @param {String} params.id
 * @param {String} params.addonId
 */
export function get(params) {
  const urlBase = params.id == null ? '/self' : `/organisations/${params.id}`;
  return Promise.resolve({
    method: 'get',
    url: `/v2${urlBase}/addons/${params.addonId}`,
    headers: { Accept: 'application/json' },
    // no query params
    // no body
  });
}

/**
 * PUT /organisations/{id}/addons/{addonId}
 * PUT /self/addons/{addonId}
 * @param {Object} params
 * @param {String} params.id
 * @param {String} params.addonId
 * @param {Object} body
 */
export function update(params, body) {
  const urlBase = params.id == null ? '/self' : `/organisations/${params.id}`;
  return Promise.resolve({
    method: 'put',
    url: `/v2${urlBase}/addons/${params.addonId}`,
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
    // no query params
    body,
  });
}

/**
 * GET /organisations/{id}/addons/{addonId}/applications
 * GET /self/addons/{addonId}/applications
 * @param {Object} params
 * @param {String} params.id
 * @param {String} params.addonId
 */
export function getLinkedApplications(params) {
  const urlBase = params.id == null ? '/self' : `/organisations/${params.id}`;
  return Promise.resolve({
    method: 'get',
    url: `/v2${urlBase}/addons/${params.addonId}/applications`,
    headers: { Accept: 'application/json' },
    // no query params
    // no body
  });
}

/**
 * GET /organisations/{id}/addons/{addonId}/env
 * GET /self/addons/{addonId}/env
 * @param {Object} params
 * @param {String} params.id
 * @param {String} params.addonId
 */
export function getAllEnvVars(params) {
  const urlBase = params.id == null ? '/self' : `/organisations/${params.id}`;
  return Promise.resolve({
    method: 'get',
    url: `/v2${urlBase}/addons/${params.addonId}/env`,
    headers: { Accept: 'application/json' },
    // no query params
    // no body
  });
}

/**
 * GET /organisations/{id}/addons/{addonId}/instances
 * @param {Object} params
 * @param {String} params.id
 * @param {String} params.addonId
 * @param {String} params.deploymentId
 * @param {String} params.withDeleted
 */
export function getAllInstances(params) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'get',
    url: `/v2/organisations/${params.id}/addons/${params.addonId}/instances`,
    headers: { Accept: 'application/json' },
    queryParams: pickNonNull(params, ['deploymentId', 'withDeleted']),
    // no body
  });
}

/**
 * GET /organisations/{id}/addons/{addonId}/instances/{instanceId}
 * @param {Object} params
 * @param {String} params.id
 * @param {String} params.addonId
 * @param {String} params.instanceId
 */
export function getInstance(params) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'get',
    url: `/v2/organisations/${params.id}/addons/${params.addonId}/instances/${params.instanceId}`,
    headers: { Accept: 'application/json' },
    // no query params
    // no body
  });
}

/**
 * GET /organisations/{id}/addons/{addonId}/migrations
 * @param {Object} params
 * @param {String} params.id
 * @param {String} params.addonId
 */
export function getAllMigrations(params) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'get',
    url: `/v2/organisations/${params.id}/addons/${params.addonId}/migrations`,
    headers: { Accept: 'application/json' },
    // no query params
    // no body
  });
}

/**
 * POST /organisations/{id}/addons/{addonId}/migrations
 * @param {Object} params
 * @param {String} params.id
 * @param {String} params.addonId
 * @param {Object} body
 */
export function updateMigration(params, body) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'post',
    url: `/v2/organisations/${params.id}/addons/${params.addonId}/migrations`,
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
    // no query params
    body,
  });
}

/**
 * GET /organisations/{id}/addons/{addonId}/migrations/preorders
 * @param {Object} params
 * @param {String} params.id
 * @param {String} params.addonId
 * @param {String} params.planId
 */
export function todo_preorderMigration(params) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'get',
    url: `/v2/organisations/${params.id}/addons/${params.addonId}/migrations/preorders`,
    headers: { Accept: 'application/json' },
    queryParams: pickNonNull(params, ['planId']),
    // no body
  });
}

/**
 * DELETE /organisations/{id}/addons/{addonId}/migrations/{migrationId}
 * @param {Object} params
 * @param {String} params.id
 * @param {String} params.addonId
 * @param {String} params.migrationId
 */
export function abortMigration(params) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'delete',
    url: `/v2/organisations/${params.id}/addons/${params.addonId}/migrations/${params.migrationId}`,
    headers: { Accept: 'application/json' },
    // no query params
    // no body
  });
}

/**
 * GET /organisations/{id}/addons/{addonId}/migrations/{migrationId}
 * @param {Object} params
 * @param {String} params.id
 * @param {String} params.addonId
 * @param {String} params.migrationId
 */
export function getMigration(params) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'get',
    url: `/v2/organisations/${params.id}/addons/${params.addonId}/migrations/${params.migrationId}`,
    headers: { Accept: 'application/json' },
    // no query params
    // no body
  });
}

/**
 * GET /organisations/{id}/addons/{addonId}/sso
 * GET /self/addons/{addonId}/sso
 * @param {Object} params
 * @param {String} params.id
 * @param {String} params.addonId
 */
export function getSsoData(params) {
  const urlBase = params.id == null ? '/self' : `/organisations/${params.id}`;
  return Promise.resolve({
    method: 'get',
    url: `/v2${urlBase}/addons/${params.addonId}/sso`,
    headers: { Accept: 'application/json' },
    // no query params
    // no body
  });
}

/**
 * GET /organisations/{id}/addons/{addonId}/tags
 * GET /self/addons/{addonId}/tags
 * @param {Object} params
 * @param {String} params.id
 * @param {String} params.addonId
 */
export function getAllTags(params) {
  const urlBase = params.id == null ? '/self' : `/organisations/${params.id}`;
  return Promise.resolve({
    method: 'get',
    url: `/v2${urlBase}/addons/${params.addonId}/tags`,
    headers: { Accept: 'application/json' },
    // no query params
    // no body
  });
}

/**
 * PUT /organisations/{id}/addons/{addonId}/tags
 * PUT /self/addons/{addonId}/tags
 * @param {Object} params
 * @param {String} params.id
 * @param {String} params.addonId
 * @param {Object} body
 */
export function replaceAddonTags(params, body) {
  const urlBase = params.id == null ? '/self' : `/organisations/${params.id}`;
  return Promise.resolve({
    method: 'put',
    url: `/v2${urlBase}/addons/${params.addonId}/tags`,
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
    // no query params
    body,
  });
}

/**
 * DELETE /organisations/{id}/addons/{addonId}/tags/{tag}
 * DELETE /self/addons/{addonId}/tags/{tag}
 * @param {Object} params
 * @param {String} params.id
 * @param {String} params.addonId
 * @param {String} params.tag
 */
export function removeTag(params) {
  const urlBase = params.id == null ? '/self' : `/organisations/${params.id}`;
  return Promise.resolve({
    method: 'delete',
    url: `/v2${urlBase}/addons/${params.addonId}/tags/${params.tag}`,
    headers: { Accept: 'application/json' },
    // no query params
    // no body
  });
}

/**
 * PUT /organisations/{id}/addons/{addonId}/tags/{tag}
 * PUT /self/addons/{addonId}/tags/{tag}
 * @param {Object} params
 * @param {String} params.id
 * @param {String} params.addonId
 * @param {String} params.tag
 */
export function addTag(params) {
  const urlBase = params.id == null ? '/self' : `/organisations/${params.id}`;
  return Promise.resolve({
    method: 'put',
    url: `/v2${urlBase}/addons/${params.addonId}/tags/${params.tag}`,
    headers: { Accept: 'application/json' },
    // no query params
    // no body
  });
}

/**
 * PUT /self/addons/{addonId}/plan
 * @param {Object} params
 * @param {String} params.addonId
 * @param {Object} body
 */
export function todo_changeSelfAddonPlanByAddonId(params, body) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'put',
    url: `/v2/self/addons/${params.addonId}/plan`,
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
    // no query params
    body,
  });
}
