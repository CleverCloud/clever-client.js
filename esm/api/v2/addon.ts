import { pickNonNull } from '../../pick-non-null.js';

/**
 * GET /organisations/{id}/addons
 * GET /self/addons
 */
export function getAll(params: { id?: string }) {
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
 */
export function create(params: { id?: string }, body: object) {
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
 */
export function preorder(params: { id?: string }, body: object) {
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
 */
export function remove(params: { id?: string; addonId: string }) {
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
 */
export function get(params: { id?: string; addonId: string }) {
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
 */
export function update(params: { id?: string; addonId: string }, body: object) {
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
 */
export function getLinkedApplications(params: { id?: string; addonId: string }) {
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
 */
export function getAllEnvVars(params: { id?: string; addonId: string }) {
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
 */
export function getAllInstances(params: { id: string; addonId: string; deploymentId?: string; withDeleted?: string }) {
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
 */
export function getInstance(params: { id: string; addonId: string; instanceId: string }) {
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
 */
export function getAllMigrations(params: { id: string; addonId: string }) {
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
 */
export function updateMigration(params: { id: string; addonId: string }, body: object) {
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
 */
export function todo_preorderMigration(params: { id: string; addonId: string; planId?: string }) {
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
 */
export function abortMigration(params: { id: string; addonId: string; migrationId: string }) {
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
 */
export function getMigration(params: { id: string; addonId: string; migrationId: string }) {
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
 */
export function getSsoData(params: { id?: string; addonId: string }) {
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
 */
export function getAllTags(params: { id?: string; addonId: string }) {
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
 */
export function replaceAddonTags(params: { id?: string; addonId: string }, body: object) {
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
 */
export function removeTag(params: { id?: string; addonId: string; tag: string }) {
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
 */
export function addTag(params: { id?: string; addonId: string; tag: string }) {
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
 */
export function todo_changeSelfAddonPlanByAddonId(params: { addonId: string }, body: object) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'put',
    url: `/v2/self/addons/${params.addonId}/plan`,
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
    // no query params
    body,
  });
}
