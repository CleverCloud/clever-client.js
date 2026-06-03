/**
 * GET /providers/es-addon/tmp/services-flavors
 */
export function getEsOptionsFlavors() {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'get',
    url: `/v2/providers/es-addon/tmp/services-flavors`,
    headers: { Accept: 'application/json' },
    // no query params
    // no body
  });
}

/**
 * GET /providers/{providerId}/{addonId}
 */
export function getAddon(params: { providerId: string; addonId: string }) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'get',
    url: `/v2/providers/${params.providerId}/${params.addonId}`,
    headers: { Accept: 'application/json' },
    // no query params
    // no body
  });
}
