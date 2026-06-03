/**
 * GET /load-balancers/organisations/{ownerId}/addons/{addonId}/load-balancers/{loadBalancerKind}
 */
export function listAddonLoadBalancers(params: { ownerId: string; addonId: string; loadBalancerKind: string }) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'get',
    url: `/v4/load-balancers/organisations/${params.ownerId}/addons/${params.addonId}/load-balancers/${params.loadBalancerKind}`,
    headers: { Accept: 'application/json' },
    // no query params
    // no body
  });
}

/**
 * GET /load-balancers/organisations/{ownerId}/applications/{appId}/load-balancers/default
 */
export function getDefaultLoadBalancersDnsInfo(params: { ownerId: string; appId: string }) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'get',
    url: `/v4/load-balancers/organisations/${params.ownerId}/applications/${params.appId}/load-balancers/default`,
    headers: { Accept: 'application/json' },
    // no query params
    // no body
  });
}

/**
 * GET /load-balancers/organisations/{ownerId}/applications/{applicationId}/load-balancers/{loadBalancerKind}
 */
export function listApplicationLoadBalancers(params: {
  ownerId: string;
  applicationId: string;
  loadBalancerKind: string;
}) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'get',
    url: `/v4/load-balancers/organisations/${params.ownerId}/applications/${params.applicationId}/load-balancers/${params.loadBalancerKind}`,
    headers: { Accept: 'application/json' },
    // no query params
    // no body
  });
}
