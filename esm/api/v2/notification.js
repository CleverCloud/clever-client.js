/**
 * @typedef {import('../../request.types.js').RequestParams} RequestParams
 */

/**
 * GET /notifications/emailhooks/{ownerId}
 * @param {Object} params
 * @param {String} params.ownerId
 * @returns {Promise<RequestParams>}
 */
export function getEmailhooks(params) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'get',
    url: `/v2/notifications/emailhooks/${params.ownerId}`,
    headers: { Accept: 'application/json' },
    // no query params
    // no body
  });
}

/**
 * POST /notifications/emailhooks/{ownerId}
 * @param {Object} params
 * @param {String} params.ownerId
 * @param {Object} body
 * @returns {Promise<RequestParams>}
 */
export function createEmailhook(params, body) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'post',
    url: `/v2/notifications/emailhooks/${params.ownerId}`,
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
    // no query params
    body,
  });
}

/**
 * DELETE /notifications/emailhooks/{ownerId}/{id}
 * @param {Object} params
 * @param {String} params.ownerId
 * @param {String} params.id
 * @returns {Promise<RequestParams>}
 */
export function deleteEmailhook(params) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'delete',
    url: `/v2/notifications/emailhooks/${params.ownerId}/${params.id}`,
    headers: { Accept: 'application/json' },
    // no query params
    // no body
  });
}

/**
 * PUT /notifications/emailhooks/{ownerId}/{id}
 * @param {Object} params
 * @param {String} params.ownerId
 * @param {String} params.id
 * @param {Object} body
 * @returns {Promise<RequestParams>}
 */
export function editEmailhook(params, body) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'put',
    url: `/v2/notifications/emailhooks/${params.ownerId}/${params.id}`,
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
    // no query params
    body,
  });
}

/**
 * GET /notifications/info/events
 * @returns {Promise<RequestParams>}
 */
export function getAvailableEvents() {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'get',
    url: `/v2/notifications/info/events`,
    headers: { Accept: 'application/json' },
    // no query params
    // no body
  });
}

/**
 * GET /notifications/info/webhookformats
 * @returns {Promise<RequestParams>}
 */
export function getWebhookFormats() {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'get',
    url: `/v2/notifications/info/webhookformats`,
    headers: { Accept: 'application/json' },
    // no query params
    // no body
  });
}

/**
 * GET /notifications/webhooks/{ownerId}
 * @param {Object} params
 * @param {String} params.ownerId
 * @returns {Promise<RequestParams>}
 */
export function getWebhooks(params) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'get',
    url: `/v2/notifications/webhooks/${params.ownerId}`,
    headers: { Accept: 'application/json' },
    // no query params
    // no body
  });
}

/**
 * POST /notifications/webhooks/{ownerId}
 * @param {Object} params
 * @param {String} params.ownerId
 * @param {Object} body
 * @returns {Promise<RequestParams>}
 */
export function createWebhook(params, body) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'post',
    url: `/v2/notifications/webhooks/${params.ownerId}`,
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
    // no query params
    body,
  });
}

/**
 * DELETE /notifications/webhooks/{ownerId}/{id}
 * @param {Object} params
 * @param {String} params.ownerId
 * @param {String} params.id
 * @returns {Promise<RequestParams>}
 */
export function deleteWebhook(params) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'delete',
    url: `/v2/notifications/webhooks/${params.ownerId}/${params.id}`,
    headers: { Accept: 'application/json' },
    // no query params
    // no body
  });
}

/**
 * PUT /notifications/webhooks/{ownerId}/{id}
 * @param {Object} params
 * @param {String} params.ownerId
 * @param {String} params.id
 * @param {Object} body
 * @returns {Promise<RequestParams>}
 */
export function editWebhook(params, body) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'put',
    url: `/v2/notifications/webhooks/${params.ownerId}/${params.id}`,
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
    // no query params
    body,
  });
}
