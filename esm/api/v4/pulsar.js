import { pickNonNull } from '../../pick-non-null.js';

/**
 * GET /addon-providers/addon-pulsar
 * @param {Object} params
 */
export function getPulsarProviderInformations() {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'get',
    url: `/v4/addon-providers/addon-pulsar`,
    headers: { Accept: 'application/json' },
    // no query params
    // no body
  });
}

/**
 * GET /addon-providers/addon-pulsar/addons/{pulsarId}
 * @param {Object} params
 * @param {String} params.pulsarId
 */
export function getPulsar(params) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'get',
    url: `/v4/addon-providers/addon-pulsar/addons/${params.pulsarId}`,
    headers: { Accept: 'application/json' },
    // no query params
    // no body
  });
}

/**
 * POST /addon-providers/addon-pulsar/addons/{pulsarId}/create-tenant-and-namespace
 * @param {Object} params
 * @param {String} params.pulsarId
 */
export function createTenantAndNamespace(params) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'post',
    url: `/v4/addon-providers/addon-pulsar/addons/${params.pulsarId}/create-tenant-and-namespace`,
    headers: { Accept: 'application/json' },
    // no query params
    // no body
  });
}

/**
 * DELETE /addon-providers/addon-pulsar/addons/{pulsarId}/delete-tenant-and-namespace
 * @param {Object} params
 * @param {String} params.pulsarId
 */
export function deleteTenantAndNamespace(params) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'delete',
    url: `/v4/addon-providers/addon-pulsar/addons/${params.pulsarId}/delete-tenant-and-namespace`,
    headers: {},
    // no query params
    // no body
  });
}

/**
 * GET /addon-providers/addon-pulsar/addons/{pulsarId}/storage-policies
 * @param {Object} params
 * @param {String} params.pulsarId
 */
export function getPulsarStoragePolicy(params) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'get',
    url: `/v4/addon-providers/addon-pulsar/addons/${params.pulsarId}/storage-policies`,
    headers: { Accept: 'application/json' },
    // no query params
    // no body
  });
}

/**
 * PATCH /addon-providers/addon-pulsar/addons/{pulsarId}/storage-policies
 * @param {Object} params
 * @param {String} params.pulsarId
 * @param {Object} body
 */
export function patchStoragePolicies(params, body) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'patch',
    url: `/v4/addon-providers/addon-pulsar/addons/${params.pulsarId}/storage-policies`,
    headers: { 'Content-Type': 'application/json' },
    // no query params
    body,
  });
}

/**
 * DELETE /addon-providers/addon-pulsar/addons/{pulsarId}/topics/{topicName}
 * @param {Object} params
 * @param {String} params.undefined
 * @param {String} params.undefined
 */
export function deleteTopic(params) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'delete',
    url: `/v4/addon-providers/addon-pulsar/addons/${params.pulsarId}/topics/${params.topicName}`,
    headers: {},
    // no query params
    // no body
  });
}

/**
 * GET /addon-providers/addon-pulsar/clusters/{clusterId}
 * @param {Object} params
 * @param {String} params.clusterId
 */
export function getPulsarCluster(params) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'get',
    url: `/v4/addon-providers/addon-pulsar/clusters/${params.clusterId}`,
    headers: { Accept: 'application/json' },
    // no query params
    // no body
  });
}
