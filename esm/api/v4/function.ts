/**
 * GET /functions/organisations/{ownerId}/functions
 */
export function list(params: { ownerId: string }) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'get',
    url: `/v4/functions/organisations/${params.ownerId}/functions`,
    headers: { Accept: 'application/json' },
    // no query params
    // no body
  });
}

/**
 * POST /functions/organisations/{ownerId}/functions
 */
export function create(params: { ownerId: string }, body: object) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'post',
    url: `/v4/functions/organisations/${params.ownerId}/functions`,
    headers: { 'Content-Type': 'application/json' },
    // no query params
    body,
  });
}

/**
 * DELETE /functions/organisations/{ownerId}/functions/{functionId}
 */
export function _delete(params: { ownerId: string; functionId: string }) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'delete',
    url: `/v4/functions/organisations/${params.ownerId}/functions/${params.functionId}`,
    headers: {},
    // no query params
    // no body
  });
}

/**
 * GET /functions/organisations/{ownerId}/functions/{functionId}
 */
export function get(params: { ownerId: string; functionId: string }) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'get',
    url: `/v4/functions/organisations/${params.ownerId}/functions/${params.functionId}`,
    headers: { Accept: 'application/json' },
    // no query params
    // no body
  });
}

/**
 * PUT /functions/organisations/{ownerId}/functions/{functionId}
 */
export function update(params: { ownerId: string; functionId: string }, body: object) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'put',
    url: `/v4/functions/organisations/${params.ownerId}/functions/${params.functionId}`,
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
    // no query params
    body,
  });
}

/**
 * GET /functions/organisations/{ownerId}/functions/{functionId}/deployments
 */
export function listDeployments(params: { ownerId: string; functionId: string }) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'get',
    url: `/v4/functions/organisations/${params.ownerId}/functions/${params.functionId}/deployments`,
    headers: { Accept: 'application/json' },
    // no query params
    // no body
  });
}

/**
 * POST /functions/organisations/{ownerId}/functions/{functionId}/deployments
 */
export function createDeployment(params: { ownerId: string; functionId: string }, body: object) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'post',
    url: `/v4/functions/organisations/${params.ownerId}/functions/${params.functionId}/deployments`,
    headers: { 'Content-Type': 'application/json' },
    // no query params
    body,
  });
}

/**
 * DELETE /functions/organisations/{ownerId}/functions/{functionId}/deployments/{deploymentId}
 */
export function deleteDeployment(params: { ownerId: string; functionId: string; deploymentId: string }) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'delete',
    url: `/v4/functions/organisations/${params.ownerId}/functions/${params.functionId}/deployments/${params.deploymentId}`,
    headers: {},
    // no query params
    // no body
  });
}

/**
 * GET /functions/organisations/{ownerId}/functions/{functionId}/deployments/{deploymentId}
 */
export function getDeployment(params: { ownerId: string; functionId: string; deploymentId: string }) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'get',
    url: `/v4/functions/organisations/${params.ownerId}/functions/${params.functionId}/deployments/${params.deploymentId}`,
    headers: { Accept: 'application/json' },
    // no query params
    // no body
  });
}

/**
 * POST /functions/organisations/{ownerId}/functions/{functionId}/deployments/{deploymentId}
 */
export function triggerDeployment(params: { ownerId: string; functionId: string; deploymentId: string }) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'post',
    url: `/v4/functions/organisations/${params.ownerId}/functions/${params.functionId}/deployments/${params.deploymentId}`,
    headers: {},
    // no query params
    // no body
  });
}

/**
 * PUT /functions/organisations/{ownerId}/functions/{functionId}/deployments/{deploymentId}
 */
export function updateDeployment(params: { ownerId: string; functionId: string; deploymentId: string }, body: object) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'put',
    url: `/v4/functions/organisations/${params.ownerId}/functions/${params.functionId}/deployments/${params.deploymentId}`,
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
    // no query params
    body,
  });
}
