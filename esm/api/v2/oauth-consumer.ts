/**
 * GET /organisations/{id}/consumers
 * GET /self/consumers
 */
export function getAll(params: { id?: string }) {
  const urlBase = params.id == null ? '/self' : `/organisations/${params.id}`;
  return Promise.resolve({
    method: 'get',
    url: `/v2${urlBase}/consumers`,
    headers: { Accept: 'application/json' },
    // no query params
    // no body
  });
}

/**
 * POST /organisations/{id}/consumers
 * POST /self/consumers
 */
export function create(params: { id?: string }, body: object) {
  const urlBase = params.id == null ? '/self' : `/organisations/${params.id}`;
  return Promise.resolve({
    method: 'post',
    url: `/v2${urlBase}/consumers`,
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
    // no query params
    body,
  });
}

/**
 * DELETE /organisations/{id}/consumers/{key}
 * DELETE /self/consumers/{key}
 */
export function remove(params: { id?: string; key: string }) {
  const urlBase = params.id == null ? '/self' : `/organisations/${params.id}`;
  return Promise.resolve({
    method: 'delete',
    url: `/v2${urlBase}/consumers/${params.key}`,
    headers: { Accept: 'application/json' },
    // no query params
    // no body
  });
}

/**
 * GET /organisations/{id}/consumers/{key}
 * GET /self/consumers/{key}
 */
export function get(params: { id?: string; key: string }) {
  const urlBase = params.id == null ? '/self' : `/organisations/${params.id}`;
  return Promise.resolve({
    method: 'get',
    url: `/v2${urlBase}/consumers/${params.key}`,
    headers: { Accept: 'application/json' },
    // no query params
    // no body
  });
}

/**
 * PUT /organisations/{id}/consumers/{key}
 * PUT /self/consumers/{key}
 */
export function update(params: { id?: string; key: string }, body: object) {
  const urlBase = params.id == null ? '/self' : `/organisations/${params.id}`;
  return Promise.resolve({
    method: 'put',
    url: `/v2${urlBase}/consumers/${params.key}`,
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
    // no query params
    body,
  });
}

/**
 * GET /organisations/{id}/consumers/{key}/secret
 * GET /self/consumers/{key}/secret
 */
export function getSecret(params: { id?: string; key: string }) {
  const urlBase = params.id == null ? '/self' : `/organisations/${params.id}`;
  return Promise.resolve({
    method: 'get',
    url: `/v2${urlBase}/consumers/${params.key}/secret`,
    headers: { Accept: 'application/json' },
    // no query params
    // no body
  });
}
