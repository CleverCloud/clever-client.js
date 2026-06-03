import { pickNonNull } from '../../pick-non-null.js';

/**
 * GET /addon-providers/addon-pulsar
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
 */
export function getPulsar(params: { pulsarId: string }) {
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
 */
export function createTenantAndNamespace(params: { pulsarId: string }) {
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
 */
export function deleteTenantAndNamespace(params: { pulsarId: string }) {
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
 */
export function getPulsarStoragePolicy(params: { pulsarId: string }) {
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
 */
export function patchStoragePolicies(params: { pulsarId: string }, body: object) {
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
 */
export function deleteTopic(params: { pulsarId: string; topicName: string; instanceId: string }) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'delete',
    url: `/v4/addon-providers/addon-pulsar/addons/${params.pulsarId}/topics/${params.topicName}`,
    headers: {},
    queryParams: pickNonNull(params, ['instanceId']),
    // no body
  });
}

/**
 * GET /addon-providers/addon-pulsar/clusters/{clusterId}
 */
export function getPulsarCluster(params: { clusterId: string }) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'get',
    url: `/v4/addon-providers/addon-pulsar/clusters/${params.clusterId}`,
    headers: { Accept: 'application/json' },
    // no query params
    // no body
  });
}
