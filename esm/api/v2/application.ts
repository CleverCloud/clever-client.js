import { pickNonNull } from '../../pick-non-null.js';

/**
 * GET /organisations/{id}/applications
 * GET /self/applications
 */
export function getAll(params: { id?: string; instanceId?: string }) {
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
 */
export function create(params: { id?: string }, body: object) {
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
 */
export function remove(params: { id?: string; appId: string }) {
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
 */
export function get(params: { id?: string; appId: string }) {
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
 */
export function update(params: { id?: string; appId: string }, body: object) {
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
 */
export function getAllLinkedAddons(params: { id?: string; appId: string }) {
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
 */
export function linkAddon(params: { id?: string; appId: string }, body: object) {
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
 */
export function getAllEnvVarsForAddons(params: { id?: string; appId: string }) {
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
 */
export function unlinkAddon(params: { id?: string; appId: string; addonId: string }) {
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
 */
export function setBranch(params: { id?: string; appId: string }, body: object) {
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
 */
export function getAllBranches(params: { id?: string; appId: string }) {
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
 */
export function setBuildInstanceFlavor(params: { id?: string; appId: string }, body: object) {
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
 */
export function getAllDependencies(params: { id?: string; appId: string }) {
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
 */
export function getAllEnvVarsForDependencies(params: { id?: string; appId: string }) {
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
 */
export function removeDependency(params: { id?: string; appId: string; dependencyId: string }) {
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
 */
export function addDependency(params: { id?: string; appId: string; dependencyId: string }) {
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
 */
export function todo_getApplicationDependentsByOrgaAndAppId(params: { id: string; appId: string }) {
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
 */
export function getAllDeployments(params: {
  id?: string;
  appId: string;
  limit?: string;
  offset?: string;
  action?: string;
}) {
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
 */
export function getDeployment(params: { id?: string; appId: string; deploymentId: string }) {
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
 */
export function cancelDeployment(params: { id?: string; appId: string; deploymentId: string }) {
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
 */
export function getAllEnvVars(params: { id?: string; appId: string }) {
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
 */
export function updateAllEnvVars(params: { id?: string; appId: string }, body: object) {
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
 */
export function removeEnvVar(params: { id?: string; appId: string; envName: string }) {
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
 */
export function updateEnvVar(params: { id?: string; appId: string; envName: string }, body: object) {
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
 */
export function getAllExposedEnvVars(params: { id?: string; appId: string }) {
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
 */
export function updateAllExposedEnvVars(params: { id?: string; appId: string }, body: object) {
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
 */
export function undeploy(params: { id?: string; appId: string }) {
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
 */
export function getAllInstances(params: { id?: string; appId: string; deploymentId?: string; withDeleted?: string }) {
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
 */
export function redeploy(params: { id?: string; appId: string; commit?: string; useCache?: string }) {
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
 */
export function getInstance(params: { id?: string; appId: string; instanceId: string }) {
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
 */
export function getAllTags(params: { id?: string; appId: string }) {
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
 */
export function removeTag(params: { id?: string; appId: string; tag: string }) {
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
 */
export function updateTag(params: { id?: string; appId: string; tag: string }) {
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
 */
export function getTcpRedirs(params: { id: string; appId: string }) {
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
 */
export function addTcpRedir(params: { id: string; appId: string }, body: object) {
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
 */
export function removeTcpRedir(params: { id: string; appId: string; sourcePort: string; namespace?: string }) {
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
 */
export function getAllDomains(params: { id?: string; appId: string }) {
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
 */
export function unmarkFavouriteDomain(params: { id?: string; appId: string }) {
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
 */
export function getFavouriteDomain(params: { id?: string; appId: string }) {
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
 */
export function markFavouriteDomain(params: { id?: string; appId: string }, body: object) {
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
 */
export function removeDomain(params: { id?: string; appId: string; domain: string }) {
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
 */
export function addDomain(params: { id?: string; appId: string; domain: string }) {
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
 */
export function todo_getSelfApplicationDependents(params: { appId: string }) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'get',
    url: `/v2/self/applications/${params.appId}/dependents`,
    headers: { Accept: 'application/json' },
    // no query params
    // no body
  });
}
