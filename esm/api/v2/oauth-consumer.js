/**
 * @typedef {import('../../request.types.js').RequestParams} RequestParams
 */

/**
 * GET /organisations/{id}/consumers
 * GET /self/consumers
 * @param {Object} params
 * @param {String} [params.id]
 * @returns {Promise<RequestParams>}
 */
export function getAll(params) {
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
 * @param {Object} params
 * @param {String} [params.id]
 * @param {Object} body
 * @returns {Promise<RequestParams>}
 */
export function create(params, body) {
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
 * @param {Object} params
 * @param {String} [params.id]
 * @param {String} params.key
 * @returns {Promise<RequestParams>}
 */
export function remove(params) {
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
 * @param {Object} params
 * @param {String} [params.id]
 * @param {String} params.key
 * @returns {Promise<RequestParams>}
 */
export function get(params) {
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
 * @param {Object} params
 * @param {String} [params.id]
 * @param {String} params.key
 * @param {Object} body
 * @returns {Promise<RequestParams>}
 */
export function update(params, body) {
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
 * @param {Object} params
 * @param {String} [params.id]
 * @param {String} params.key
 * @returns {Promise<RequestParams>}
 */
export function getSecret(params) {
  const urlBase = params.id == null ? '/self' : `/organisations/${params.id}`;
  return Promise.resolve({
    method: 'get',
    url: `/v2${urlBase}/consumers/${params.key}/secret`,
    headers: { Accept: 'application/json' },
    // no query params
    // no body
  });
}
