/**
 * GET /organisations/{id}/addonproviders
 */
export function getAll(params: { id: string }) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'get',
    url: `/v2/organisations/${params.id}/addonproviders`,
    headers: { Accept: 'application/json' },
    // no query params
    // no body
  });
}

/**
 * POST /organisations/{id}/addonproviders
 */
export function create(params: { id: string }, body: object) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'post',
    url: `/v2/organisations/${params.id}/addonproviders`,
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
    // no query params
    body,
  });
}

/**
 * DELETE /organisations/{id}/addonproviders/{providerId}
 */
export function remove(params: { id: string; providerId: string }) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'delete',
    url: `/v2/organisations/${params.id}/addonproviders/${params.providerId}`,
    headers: { Accept: 'application/json' },
    // no query params
    // no body
  });
}

/**
 * GET /organisations/{id}/addonproviders/{providerId}
 */
export function get(params: { id: string; providerId: string }) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'get',
    url: `/v2/organisations/${params.id}/addonproviders/${params.providerId}`,
    headers: { Accept: 'application/json' },
    // no query params
    // no body
  });
}

/**
 * PUT /organisations/{id}/addonproviders/{providerId}
 */
export function update(params: { id: string; providerId: string }, body: object) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'put',
    url: `/v2/organisations/${params.id}/addonproviders/${params.providerId}`,
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
    // no query params
    body,
  });
}

/**
 * GET /organisations/{id}/addonproviders/{providerId}/features
 */
export function getAllFeatures(params: { id: string; providerId: string }) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'get',
    url: `/v2/organisations/${params.id}/addonproviders/${params.providerId}/features`,
    headers: { Accept: 'application/json' },
    // no query params
    // no body
  });
}

/**
 * POST /organisations/{id}/addonproviders/{providerId}/features
 */
export function addFeature(params: { id: string; providerId: string }, body: object) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'post',
    url: `/v2/organisations/${params.id}/addonproviders/${params.providerId}/features`,
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
    // no query params
    body,
  });
}

/**
 * DELETE /organisations/{id}/addonproviders/{providerId}/features/{featureId}
 */
export function removeFeature(params: { id: string; providerId: string; featureId: string }) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'delete',
    url: `/v2/organisations/${params.id}/addonproviders/${params.providerId}/features/${params.featureId}`,
    headers: { Accept: 'application/json' },
    // no query params
    // no body
  });
}

/**
 * GET /organisations/{id}/addonproviders/{providerId}/plans
 */
export function getAllPlans(params: { id: string; providerId: string }) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'get',
    url: `/v2/organisations/${params.id}/addonproviders/${params.providerId}/plans`,
    headers: { Accept: 'application/json' },
    // no query params
    // no body
  });
}

/**
 * POST /organisations/{id}/addonproviders/{providerId}/plans
 */
export function addPlan(params: { id: string; providerId: string }, body: object) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'post',
    url: `/v2/organisations/${params.id}/addonproviders/${params.providerId}/plans`,
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
    // no query params
    body,
  });
}

/**
 * DELETE /organisations/{id}/addonproviders/{providerId}/plans/{planId}
 */
export function removePlan(params: { id: string; providerId: string; planId: string }) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'delete',
    url: `/v2/organisations/${params.id}/addonproviders/${params.providerId}/plans/${params.planId}`,
    headers: { Accept: 'application/json' },
    // no query params
    // no body
  });
}

/**
 * GET /organisations/{id}/addonproviders/{providerId}/plans/{planId}
 */
export function getPlan(params: { id: string; providerId: string; planId: string }) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'get',
    url: `/v2/organisations/${params.id}/addonproviders/${params.providerId}/plans/${params.planId}`,
    headers: { Accept: 'application/json' },
    // no query params
    // no body
  });
}

/**
 * PUT /organisations/{id}/addonproviders/{providerId}/plans/{planId}
 */
export function updatePlan(params: { id: string; providerId: string; planId: string }, body: object) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'put',
    url: `/v2/organisations/${params.id}/addonproviders/${params.providerId}/plans/${params.planId}`,
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
    // no query params
    body,
  });
}

/**
 * DELETE /organisations/{id}/addonproviders/{providerId}/plans/{planId}/features/{featureName}
 */
export function removePlanFeature(params: { id: string; providerId: string; planId: string; featureName: string }) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'delete',
    url: `/v2/organisations/${params.id}/addonproviders/${params.providerId}/plans/${params.planId}/features/${params.featureName}`,
    headers: { Accept: 'application/json' },
    // no query params
    // no body
  });
}

/**
 * PUT /organisations/{id}/addonproviders/{providerId}/plans/{planId}/features/{featureName}
 */
export function updatePlanFeature(
  params: { id: string; providerId: string; planId: string; featureName: string },
  body: object,
) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'put',
    url: `/v2/organisations/${params.id}/addonproviders/${params.providerId}/plans/${params.planId}/features/${params.featureName}`,
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
    // no query params
    body,
  });
}

/**
 * GET /organisations/{id}/addonproviders/{providerId}/sso
 */
export function getSsoData(params: { id: string; providerId: string }) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'get',
    url: `/v2/organisations/${params.id}/addonproviders/${params.providerId}/sso`,
    headers: { Accept: 'application/json' },
    // no query params
    // no body
  });
}

/**
 * GET /organisations/{id}/addonproviders/{providerId}/tags
 */
export function getAllTags(params: { id: string; providerId: string }) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'get',
    url: `/v2/organisations/${params.id}/addonproviders/${params.providerId}/tags`,
    headers: { Accept: 'application/json' },
    // no query params
    // no body
  });
}

/**
 * POST /organisations/{id}/addonproviders/{providerId}/testers
 */
export function addBetaTester(params: { id: string; providerId: string }) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'post',
    url: `/v2/organisations/${params.id}/addonproviders/${params.providerId}/testers`,
    headers: { Accept: 'application/json' },
    // no query params
    // no body
  });
}
