import { pickNonNull } from '../../pick-non-null.js';

/**
 * GET /organisations/{id}/applications
 * GET /self/applications
 * @param {Object} params
 * @param {String} params.id
 * @param {String} params.instanceId
 */
export function getAll(params) {
  const urlBase = params.id == null ? '/self' : `/organisations/${params.id}`;
  return Promise.resolve({
    method: 'get',
    url: `/v2${urlBase}/applications`,
    headers: { Accept: 'application/json' },
    queryParams: pickNonNull(params, ['instanceId']),
    // no body
  });
}

/**
 * POST /organisations/{id}/applications
 * POST /self/applications
 * @param {Object} params
 * @param {String} params.id
 * @param {Object} body
 */
export function create(params, body) {
  const urlBase = params.id == null ? '/self' : `/organisations/${params.id}`;
  return Promise.resolve({
    method: 'post',
    url: `/v2${urlBase}/applications`,
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
    // no query params
    body,
  });
}

/**
 * DELETE /organisations/{id}/applications/{appId}
 * DELETE /self/applications/{appId}
 * @param {Object} params
 * @param {String} params.id
 * @param {String} params.appId
 */
export function remove(params) {
  const urlBase = params.id == null ? '/self' : `/organisations/${params.id}`;
  return Promise.resolve({
    method: 'delete',
    url: `/v2${urlBase}/applications/${params.appId}`,
    headers: { Accept: 'application/json' },
    // no query params
    // no body
  });
}

/**
 * GET /organisations/{id}/applications/{appId}
 * GET /self/applications/{appId}
 * @param {Object} params
 * @param {String} params.id
 * @param {String} params.appId
 */
export function get(params) {
  const urlBase = params.id == null ? '/self' : `/organisations/${params.id}`;
  return Promise.resolve({
    method: 'get',
    url: `/v2${urlBase}/applications/${params.appId}`,
    headers: { Accept: 'application/json' },
    // no query params
    // no body
  });
}

/**
 * PUT /organisations/{id}/applications/{appId}
 * PUT /self/applications/{appId}
 * @param {Object} params
 * @param {String} params.id
 * @param {String} params.appId
 * @param {Object} body
 */
export function update(params, body) {
  const urlBase = params.id == null ? '/self' : `/organisations/${params.id}`;
  return Promise.resolve({
    method: 'put',
    url: `/v2${urlBase}/applications/${params.appId}`,
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
    // no query params
    body,
  });
}

/**
 * GET /organisations/{id}/applications/{appId}/addons
 * GET /self/applications/{appId}/addons
 * @param {Object} params
 * @param {String} params.id
 * @param {String} params.appId
 */
export function getAllLinkedAddons(params) {
  const urlBase = params.id == null ? '/self' : `/organisations/${params.id}`;
  return Promise.resolve({
    method: 'get',
    url: `/v2${urlBase}/applications/${params.appId}/addons`,
    headers: { Accept: 'application/json' },
    // no query params
    // no body
  });
}

/**
 * POST /organisations/{id}/applications/{appId}/addons
 * POST /self/applications/{appId}/addons
 * @param {Object} params
 * @param {String} params.id
 * @param {String} params.appId
 * @param {Object} body
 */
export function linkAddon(params, body) {
  const urlBase = params.id == null ? '/self' : `/organisations/${params.id}`;
  return Promise.resolve({
    method: 'post',
    url: `/v2${urlBase}/applications/${params.appId}/addons`,
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
    // no query params
    body,
  });
}

/**
 * GET /organisations/{id}/applications/{appId}/addons/env
 * GET /self/applications/{appId}/addons/env
 * @param {Object} params
 * @param {String} params.id
 * @param {String} params.appId
 */
export function getAllEnvVarsForAddons(params) {
  const urlBase = params.id == null ? '/self' : `/organisations/${params.id}`;
  return Promise.resolve({
    method: 'get',
    url: `/v2${urlBase}/applications/${params.appId}/addons/env`,
    headers: { Accept: 'application/json' },
    // no query params
    // no body
  });
}

/**
 * DELETE /organisations/{id}/applications/{appId}/addons/{addonId}
 * DELETE /self/applications/{appId}/addons/{addonId}
 * @param {Object} params
 * @param {String} params.id
 * @param {String} params.appId
 * @param {String} params.addonId
 */
export function unlinkAddon(params) {
  const urlBase = params.id == null ? '/self' : `/organisations/${params.id}`;
  return Promise.resolve({
    method: 'delete',
    url: `/v2${urlBase}/applications/${params.appId}/addons/${params.addonId}`,
    headers: { Accept: 'application/json' },
    // no query params
    // no body
  });
}

/**
 * PUT /organisations/{id}/applications/{appId}/branch
 * PUT /self/applications/{appId}/branch
 * @param {Object} params
 * @param {String} params.id
 * @param {String} params.appId
 * @param {Object} body
 */
export function setBranch(params, body) {
  const urlBase = params.id == null ? '/self' : `/organisations/${params.id}`;
  return Promise.resolve({
    method: 'put',
    url: `/v2${urlBase}/applications/${params.appId}/branch`,
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
    // no query params
    body,
  });
}

/**
 * GET /organisations/{id}/applications/{appId}/branches
 * GET /self/applications/{appId}/branches
 * @param {Object} params
 * @param {String} params.id
 * @param {String} params.appId
 */
export function getAllBranches(params) {
  const urlBase = params.id == null ? '/self' : `/organisations/${params.id}`;
  return Promise.resolve({
    method: 'get',
    url: `/v2${urlBase}/applications/${params.appId}/branches`,
    headers: { Accept: 'application/json' },
    // no query params
    // no body
  });
}

/**
 * PUT /organisations/{id}/applications/{appId}/buildflavor
 * PUT /self/applications/{appId}/buildflavor
 * @param {Object} params
 * @param {String} params.id
 * @param {String} params.appId
 * @param {Object} body
 */
export function setBuildInstanceFlavor(params, body) {
  const urlBase = params.id == null ? '/self' : `/organisations/${params.id}`;
  return Promise.resolve({
    method: 'put',
    url: `/v2${urlBase}/applications/${params.appId}/buildflavor`,
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
    // no query params
    body,
  });
}

/**
 * GET /organisations/{id}/applications/{appId}/dependencies
 * GET /self/applications/{appId}/dependencies
 * @param {Object} params
 * @param {String} params.id
 * @param {String} params.appId
 */
export function getAllDependencies(params) {
  const urlBase = params.id == null ? '/self' : `/organisations/${params.id}`;
  return Promise.resolve({
    method: 'get',
    url: `/v2${urlBase}/applications/${params.appId}/dependencies`,
    headers: { Accept: 'application/json' },
    // no query params
    // no body
  });
}

/**
 * GET /organisations/{id}/applications/{appId}/dependencies/env
 * GET /self/applications/{appId}/dependencies/env
 * @param {Object} params
 * @param {String} params.id
 * @param {String} params.appId
 */
export function getAllEnvVarsForDependencies(params) {
  const urlBase = params.id == null ? '/self' : `/organisations/${params.id}`;
  return Promise.resolve({
    method: 'get',
    url: `/v2${urlBase}/applications/${params.appId}/dependencies/env`,
    headers: { Accept: 'application/json' },
    // no query params
    // no body
  });
}

/**
 * DELETE /organisations/{id}/applications/{appId}/dependencies/{dependencyId}
 * DELETE /self/applications/{appId}/dependencies/{dependencyId}
 * @param {Object} params
 * @param {String} params.id
 * @param {String} params.appId
 * @param {String} params.dependencyId
 */
export function removeDependency(params) {
  const urlBase = params.id == null ? '/self' : `/organisations/${params.id}`;
  return Promise.resolve({
    method: 'delete',
    url: `/v2${urlBase}/applications/${params.appId}/dependencies/${params.dependencyId}`,
    headers: { Accept: 'application/json' },
    // no query params
    // no body
  });
}

/**
 * PUT /organisations/{id}/applications/{appId}/dependencies/{dependencyId}
 * PUT /self/applications/{appId}/dependencies/{dependencyId}
 * @param {Object} params
 * @param {String} params.id
 * @param {String} params.appId
 * @param {String} params.dependencyId
 */
export function addDependency(params) {
  const urlBase = params.id == null ? '/self' : `/organisations/${params.id}`;
  return Promise.resolve({
    method: 'put',
    url: `/v2${urlBase}/applications/${params.appId}/dependencies/${params.dependencyId}`,
    headers: { Accept: 'application/json' },
    // no query params
    // no body
  });
}

/**
 * GET /organisations/{id}/applications/{appId}/dependents
 * @param {Object} params
 * @param {String} params.id
 * @param {String} params.appId
 */
export function todo_getApplicationDependentsByOrgaAndAppId(params) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'get',
    url: `/v2/organisations/${params.id}/applications/${params.appId}/dependents`,
    headers: { Accept: 'application/json' },
    // no query params
    // no body
  });
}

/**
 * GET /organisations/{id}/applications/{appId}/deployments
 * GET /self/applications/{appId}/deployments
 * @param {Object} params
 * @param {String} params.id
 * @param {String} params.appId
 * @param {String} params.limit
 * @param {String} params.offset
 * @param {String} params.action
 */
export function getAllDeployments(params) {
  const urlBase = params.id == null ? '/self' : `/organisations/${params.id}`;
  return Promise.resolve({
    method: 'get',
    url: `/v2${urlBase}/applications/${params.appId}/deployments`,
    headers: { Accept: 'application/json' },
    queryParams: pickNonNull(params, ['limit', 'offset', 'action']),
    // no body
  });
}

/**
 * GET /organisations/{id}/applications/{appId}/deployments/{deploymentId}
 * GET /self/applications/{appId}/deployments/{deploymentId}
 * @param {Object} params
 * @param {String} params.id
 * @param {String} params.appId
 * @param {String} params.deploymentId
 */
export function getDeployment(params) {
  const urlBase = params.id == null ? '/self' : `/organisations/${params.id}`;
  return Promise.resolve({
    method: 'get',
    url: `/v2${urlBase}/applications/${params.appId}/deployments/${params.deploymentId}`,
    headers: { Accept: 'application/json' },
    // no query params
    // no body
  });
}

/**
 * DELETE /organisations/{id}/applications/{appId}/deployments/{deploymentId}/instances
 * DELETE /self/applications/{appId}/deployments/{deploymentId}/instances
 * @param {Object} params
 * @param {String} params.id
 * @param {String} params.appId
 * @param {String} params.deploymentId
 */
export function cancelDeployment(params) {
  const urlBase = params.id == null ? '/self' : `/organisations/${params.id}`;
  return Promise.resolve({
    method: 'delete',
    url: `/v2${urlBase}/applications/${params.appId}/deployments/${params.deploymentId}/instances`,
    headers: { Accept: 'application/json' },
    // no query params
    // no body
  });
}

/**
 * GET /organisations/{id}/applications/{appId}/env
 * GET /self/applications/{appId}/env
 * @param {Object} params
 * @param {String} params.id
 * @param {String} params.appId
 */
export function getAllEnvVars(params) {
  const urlBase = params.id == null ? '/self' : `/organisations/${params.id}`;
  return Promise.resolve({
    method: 'get',
    url: `/v2${urlBase}/applications/${params.appId}/env`,
    headers: { Accept: 'application/json' },
    // no query params
    // no body
  });
}

/**
 * PUT /organisations/{id}/applications/{appId}/env
 * PUT /self/applications/{appId}/env
 * @param {Object} params
 * @param {String} params.id
 * @param {String} params.appId
 * @param {Object} body
 */
export function updateAllEnvVars(params, body) {
  const urlBase = params.id == null ? '/self' : `/organisations/${params.id}`;
  return Promise.resolve({
    method: 'put',
    url: `/v2${urlBase}/applications/${params.appId}/env`,
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
    // no query params
    body,
  });
}

/**
 * DELETE /organisations/{id}/applications/{appId}/env/{envName}
 * DELETE /self/applications/{appId}/env/{envName}
 * @param {Object} params
 * @param {String} params.id
 * @param {String} params.appId
 * @param {String} params.envName
 */
export function removeEnvVar(params) {
  const urlBase = params.id == null ? '/self' : `/organisations/${params.id}`;
  return Promise.resolve({
    method: 'delete',
    url: `/v2${urlBase}/applications/${params.appId}/env/${params.envName}`,
    headers: { Accept: 'application/json' },
    // no query params
    // no body
  });
}

/**
 * PUT /organisations/{id}/applications/{appId}/env/{envName}
 * PUT /self/applications/{appId}/env/{envName}
 * @param {Object} params
 * @param {String} params.id
 * @param {String} params.appId
 * @param {String} params.envName
 * @param {Object} body
 */
export function updateEnvVar(params, body) {
  const urlBase = params.id == null ? '/self' : `/organisations/${params.id}`;
  return Promise.resolve({
    method: 'put',
    url: `/v2${urlBase}/applications/${params.appId}/env/${params.envName}`,
    headers: { 'Content-Type': 'application/json' },
    // no query params
    body,
  });
}

/**
 * GET /organisations/{id}/applications/{appId}/exposed_env
 * GET /self/applications/{appId}/exposed_env
 * @param {Object} params
 * @param {String} params.id
 * @param {String} params.appId
 */
export function getAllExposedEnvVars(params) {
  const urlBase = params.id == null ? '/self' : `/organisations/${params.id}`;
  return Promise.resolve({
    method: 'get',
    url: `/v2${urlBase}/applications/${params.appId}/exposed_env`,
    headers: { Accept: 'application/json' },
    // no query params
    // no body
  });
}

/**
 * PUT /organisations/{id}/applications/{appId}/exposed_env
 * PUT /self/applications/{appId}/exposed_env
 * @param {Object} params
 * @param {String} params.id
 * @param {String} params.appId
 * @param {Object} body
 */
export function updateAllExposedEnvVars(params, body) {
  const urlBase = params.id == null ? '/self' : `/organisations/${params.id}`;
  return Promise.resolve({
    method: 'put',
    url: `/v2${urlBase}/applications/${params.appId}/exposed_env`,
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
    // no query params
    body,
  });
}

/**
 * DELETE /organisations/{id}/applications/{appId}/instances
 * DELETE /self/applications/{appId}/instances
 * @param {Object} params
 * @param {String} params.id
 * @param {String} params.appId
 */
export function undeploy(params) {
  const urlBase = params.id == null ? '/self' : `/organisations/${params.id}`;
  return Promise.resolve({
    method: 'delete',
    url: `/v2${urlBase}/applications/${params.appId}/instances`,
    headers: { Accept: 'application/json' },
    // no query params
    // no body
  });
}

/**
 * GET /organisations/{id}/applications/{appId}/instances
 * GET /self/applications/{appId}/instances
 * @param {Object} params
 * @param {String} params.id
 * @param {String} params.appId
 * @param {String} params.deploymentId
 * @param {String} params.withDeleted
 */
export function getAllInstances(params) {
  const urlBase = params.id == null ? '/self' : `/organisations/${params.id}`;
  return Promise.resolve({
    method: 'get',
    url: `/v2${urlBase}/applications/${params.appId}/instances`,
    headers: { Accept: 'application/json' },
    queryParams: pickNonNull(params, ['deploymentId', 'withDeleted']),
    // no body
  });
}

/**
 * POST /organisations/{id}/applications/{appId}/instances
 * POST /self/applications/{appId}/instances
 * @param {Object} params
 * @param {String} params.id
 * @param {String} params.appId
 * @param {String} params.commit
 * @param {String} params.useCache
 */
export function redeploy(params) {
  const urlBase = params.id == null ? '/self' : `/organisations/${params.id}`;
  return Promise.resolve({
    method: 'post',
    url: `/v2${urlBase}/applications/${params.appId}/instances`,
    headers: { Accept: 'application/json' },
    queryParams: pickNonNull(params, ['commit', 'useCache']),
    // no body
  });
}

/**
 * GET /organisations/{id}/applications/{appId}/instances/{instanceId}
 * GET /self/applications/{appId}/instances/{instanceId}
 * @param {Object} params
 * @param {String} params.id
 * @param {String} params.appId
 * @param {String} params.instanceId
 */
export function getInstance(params) {
  const urlBase = params.id == null ? '/self' : `/organisations/${params.id}`;
  return Promise.resolve({
    method: 'get',
    url: `/v2${urlBase}/applications/${params.appId}/instances/${params.instanceId}`,
    headers: { Accept: 'application/json' },
    // no query params
    // no body
  });
}

/**
 * GET /organisations/{id}/applications/{appId}/tags
 * GET /self/applications/{appId}/tags
 * @param {Object} params
 * @param {String} params.id
 * @param {String} params.appId
 */
export function getAllTags(params) {
  const urlBase = params.id == null ? '/self' : `/organisations/${params.id}`;
  return Promise.resolve({
    method: 'get',
    url: `/v2${urlBase}/applications/${params.appId}/tags`,
    headers: { Accept: 'application/json' },
    // no query params
    // no body
  });
}

/**
 * DELETE /organisations/{id}/applications/{appId}/tags/{tag}
 * DELETE /self/applications/{appId}/tags/{tag}
 * @param {Object} params
 * @param {String} params.id
 * @param {String} params.appId
 * @param {String} params.tag
 */
export function removeTag(params) {
  const urlBase = params.id == null ? '/self' : `/organisations/${params.id}`;
  return Promise.resolve({
    method: 'delete',
    url: `/v2${urlBase}/applications/${params.appId}/tags/${params.tag}`,
    headers: { Accept: 'application/json' },
    // no query params
    // no body
  });
}

/**
 * PUT /organisations/{id}/applications/{appId}/tags/{tag}
 * PUT /self/applications/{appId}/tags/{tag}
 * @param {Object} params
 * @param {String} params.id
 * @param {String} params.appId
 * @param {String} params.tag
 */
export function updateTag(params) {
  const urlBase = params.id == null ? '/self' : `/organisations/${params.id}`;
  return Promise.resolve({
    method: 'put',
    url: `/v2${urlBase}/applications/${params.appId}/tags/${params.tag}`,
    headers: { Accept: 'application/json' },
    // no query params
    // no body
  });
}

/**
 * GET /organisations/{id}/applications/{appId}/tcpRedirs
 * @param {Object} params
 * @param {String} params.id
 * @param {String} params.appId
 */
export function getTcpRedirs(params) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'get',
    url: `/v2/organisations/${params.id}/applications/${params.appId}/tcpRedirs`,
    headers: { Accept: 'application/json' },
    // no query params
    // no body
  });
}

/**
 * POST /organisations/{id}/applications/{appId}/tcpRedirs
 * @param {Object} params
 * @param {String} params.id
 * @param {String} params.appId
 * @param {Object} body
 */
export function addTcpRedir(params, body) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'post',
    url: `/v2/organisations/${params.id}/applications/${params.appId}/tcpRedirs`,
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
    // no query params
    body,
  });
}

/**
 * DELETE /organisations/{id}/applications/{appId}/tcpRedirs/{sourcePort}
 * @param {Object} params
 * @param {String} params.id
 * @param {String} params.appId
 * @param {String} params.sourcePort
 * @param {String} params.namespace
 */
export function removeTcpRedir(params) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'delete',
    url: `/v2/organisations/${params.id}/applications/${params.appId}/tcpRedirs/${params.sourcePort}`,
    headers: { Accept: 'application/json' },
    queryParams: pickNonNull(params, ['namespace']),
    // no body
  });
}

/**
 * GET /organisations/{id}/applications/{appId}/vhosts
 * GET /self/applications/{appId}/vhosts
 * @param {Object} params
 * @param {String} params.id
 * @param {String} params.appId
 */
export function getAllDomains(params) {
  const urlBase = params.id == null ? '/self' : `/organisations/${params.id}`;
  return Promise.resolve({
    method: 'get',
    url: `/v2${urlBase}/applications/${params.appId}/vhosts`,
    headers: { Accept: 'application/json' },
    // no query params
    // no body
  });
}

/**
 * DELETE /organisations/{id}/applications/{appId}/vhosts/favourite
 * DELETE /self/applications/{appId}/vhosts/favourite
 * @param {Object} params
 * @param {String} params.id
 * @param {String} params.appId
 */
export function unmarkFavouriteDomain(params) {
  const urlBase = params.id == null ? '/self' : `/organisations/${params.id}`;
  return Promise.resolve({
    method: 'delete',
    url: `/v2${urlBase}/applications/${params.appId}/vhosts/favourite`,
    headers: { Accept: 'application/json' },
    // no query params
    // no body
  });
}

/**
 * GET /organisations/{id}/applications/{appId}/vhosts/favourite
 * GET /self/applications/{appId}/vhosts/favourite
 * @param {Object} params
 * @param {String} params.id
 * @param {String} params.appId
 */
export function getFavouriteDomain(params) {
  const urlBase = params.id == null ? '/self' : `/organisations/${params.id}`;
  return Promise.resolve({
    method: 'get',
    url: `/v2${urlBase}/applications/${params.appId}/vhosts/favourite`,
    headers: { Accept: 'application/json' },
    // no query params
    // no body
  });
}

/**
 * PUT /organisations/{id}/applications/{appId}/vhosts/favourite
 * PUT /self/applications/{appId}/vhosts/favourite
 * @param {Object} params
 * @param {String} params.id
 * @param {String} params.appId
 * @param {Object} body
 */
export function markFavouriteDomain(params, body) {
  const urlBase = params.id == null ? '/self' : `/organisations/${params.id}`;
  return Promise.resolve({
    method: 'put',
    url: `/v2${urlBase}/applications/${params.appId}/vhosts/favourite`,
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
    // no query params
    body,
  });
}

/**
 * DELETE /organisations/{id}/applications/{appId}/vhosts/{domain}
 * DELETE /self/applications/{appId}/vhosts/{domain}
 * @param {Object} params
 * @param {String} params.id
 * @param {String} params.appId
 * @param {String} params.domain
 */
export function removeDomain(params) {
  const urlBase = params.id == null ? '/self' : `/organisations/${params.id}`;
  return Promise.resolve({
    method: 'delete',
    url: `/v2${urlBase}/applications/${params.appId}/vhosts/${params.domain}`,
    headers: { Accept: 'application/json' },
    // no query params
    // no body
  });
}

/**
 * PUT /organisations/{id}/applications/{appId}/vhosts/{domain}
 * PUT /self/applications/{appId}/vhosts/{domain}
 * @param {Object} params
 * @param {String} params.id
 * @param {String} params.appId
 * @param {String} params.domain
 */
export function addDomain(params) {
  const urlBase = params.id == null ? '/self' : `/organisations/${params.id}`;
  return Promise.resolve({
    method: 'put',
    url: `/v2${urlBase}/applications/${params.appId}/vhosts/${params.domain}`,
    headers: { Accept: 'application/json' },
    // no query params
    // no body
  });
}

/**
 * GET /self/applications/{appId}/dependents
 * @param {Object} params
 * @param {String} params.appId
 */
export function todo_getSelfApplicationDependents(params) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'get',
    url: `/v2/self/applications/${params.appId}/dependents`,
    headers: { Accept: 'application/json' },
    // no query params
    // no body
  });
}
