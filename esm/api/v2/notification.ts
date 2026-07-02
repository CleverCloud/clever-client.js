/**
 * GET /notifications/emailhooks/{ownerId}
 */
export function getEmailhooks(params: { ownerId: string }) {
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
 */
export function createEmailhook(params: { ownerId: string }, body: object) {
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
 */
export function deleteEmailhook(params: { ownerId: string; id: string }) {
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
 */
export function editEmailhook(params: { ownerId: string; id: string }, body: object) {
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
 */
export function getWebhooks(params: { ownerId: string }) {
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
 */
export function createWebhook(params: { ownerId: string }, body: object) {
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
 */
export function deleteWebhook(params: { ownerId: string; id: string }) {
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
 */
export function editWebhook(params: { ownerId: string; id: string }, body: object) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'put',
    url: `/v2/notifications/webhooks/${params.ownerId}/${params.id}`,
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
    // no query params
    body,
  });
}
