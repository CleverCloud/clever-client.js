import { pickNonNull } from '../../pick-non-null.js';

/**
 * @typedef {import('../../request.types.js').RequestParams} RequestParams
 */

/**
 * GET /organisations
 * @returns {Promise<RequestParams>}
 */
export function getAll() {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'get',
    url: `/v2/organisations`,
    headers: { Accept: 'application/json' },
    // no query params
    // no body
  });
}

/**
 * POST /organisations
 * @param {Object} params
 * @param {Object} body
 * @returns {Promise<RequestParams>}
 */
export function create(params, body) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'post',
    url: `/v2/organisations`,
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
    // no query params
    body,
  });
}

/**
 * DELETE /organisations/{id}
 * DELETE /self
 * @param {Object} params
 * @param {String} [params.id]
 * @returns {Promise<RequestParams>}
 */
export function remove(params) {
  const urlBase = params.id == null ? '/self' : `/organisations/${params.id}`;
  return Promise.resolve({
    method: 'delete',
    url: `/v2${urlBase}`,
    headers: { Accept: 'application/json' },
    // no query params
    // no body
  });
}

/**
 * GET /organisations/{id}
 * GET /self
 * @param {Object} params
 * @param {String} [params.id]
 * @returns {Promise<RequestParams>}
 */
export function get(params) {
  const urlBase = params.id == null ? '/self' : `/organisations/${params.id}`;
  return Promise.resolve({
    method: 'get',
    url: `/v2${urlBase}`,
    headers: { Accept: 'application/json' },
    // no query params
    // no body
  });
}

/**
 * PUT /organisations/{id}
 * PUT /self
 * @param {Object} params
 * @param {String} [params.id]
 * @param {Object} body
 * @returns {Promise<RequestParams>}
 */
export function update(params, body) {
  const urlBase = params.id == null ? '/self' : `/organisations/${params.id}`;
  return Promise.resolve({
    method: 'put',
    url: `/v2${urlBase}`,
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
    // no query params
    body,
  });
}

/**
 * PUT /organisations/{id}/applications/{appId}/tags
 * PUT /self/applications/{appId}/tags
 * @param {Object} params
 * @param {String} [params.id]
 * @param {String} params.appId
 * @param {Object} body
 * @returns {Promise<RequestParams>}
 */
export function updateApplicationTags(params, body) {
  const urlBase = params.id == null ? '/self' : `/organisations/${params.id}`;
  return Promise.resolve({
    method: 'put',
    url: `/v2${urlBase}/applications/${params.appId}/tags`,
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
    // no query params
    body,
  });
}

/**
 * GET /organisations/{id}/applications/{appId}/udpRedirs
 * @param {Object} params
 * @param {String} params.id
 * @param {String} params.appId
 * @returns {Promise<RequestParams>}
 */
export function listApplicationUDPRedirections(params) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'get',
    url: `/v2/organisations/${params.id}/applications/${params.appId}/udpRedirs`,
    headers: { Accept: 'application/json' },
    // no query params
    // no body
  });
}

/**
 * POST /organisations/{id}/applications/{appId}/udpRedirs
 * @param {Object} params
 * @param {String} params.id
 * @param {String} params.appId
 * @param {Object} body
 * @returns {Promise<RequestParams>}
 */
export function createApplicationUDPRedirection(params, body) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'post',
    url: `/v2/organisations/${params.id}/applications/${params.appId}/udpRedirs`,
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
    // no query params
    body,
  });
}

/**
 * DELETE /organisations/{id}/applications/{appId}/udpRedirs/{sourcePort}
 * @param {Object} params
 * @param {String} params.id
 * @param {String} params.appId
 * @param {String} params.sourcePort
 * @param {String} params.namespace
 * @returns {Promise<RequestParams>}
 */
export function deleteApplicationUDPRedirection(params) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'delete',
    url: `/v2/organisations/${params.id}/applications/${params.appId}/udpRedirs/${params.sourcePort}`,
    headers: { Accept: 'application/json' },
    queryParams: pickNonNull(params, ['namespace']),
    // no body
  });
}

/**
 * PUT /organisations/{id}/avatar
 * PUT /self/avatar
 * @param {Object} params
 * @param {String} [params.id]
 * @param {Object} body
 * @returns {Promise<RequestParams>}
 */
export function updateAvatar(params, body) {
  const urlBase = params.id == null ? '/self' : `/organisations/${params.id}`;
  return Promise.resolve({
    method: 'put',
    url: `/v2${urlBase}/avatar`,
    headers: { Accept: 'application/json', 'Content-Type': 'image/bmp' },
    // no query params
    body,
  });
}

/**
 * GET /organisations/{id}/consumptions
 * GET /self/consumptions
 * @param {Object} params
 * @param {String} [params.id]
 * @param {String} params.appId
 * @param {String} params.from
 * @param {String} params.to
 * @param {String} params.for
 * @returns {Promise<RequestParams>}
 */
export function getConsumptions(params) {
  const urlBase = params.id == null ? '/self' : `/organisations/${params.id}`;
  return Promise.resolve({
    method: 'get',
    url: `/v2${urlBase}/consumptions`,
    headers: { Accept: 'application/json' },
    queryParams: pickNonNull(params, ['appId', 'from', 'to', 'for']),
    // no body
  });
}

/**
 * GET /organisations/{id}/credits
 * GET /self/credits
 * @param {Object} params
 * @param {String} [params.id]
 * @returns {Promise<RequestParams>}
 */
export function getCredits(params) {
  const urlBase = params.id == null ? '/self' : `/organisations/${params.id}`;
  return Promise.resolve({
    method: 'get',
    url: `/v2${urlBase}/credits`,
    headers: { Accept: 'application/json' },
    // no query params
    // no body
  });
}

/**
 * GET /organisations/{id}/deployments
 * @param {Object} params
 * @param {String} params.id
 * @param {String} params.limit
 * @returns {Promise<RequestParams>}
 */
export function getAllDeployments(params) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'get',
    url: `/v2/organisations/${params.id}/deployments`,
    headers: { Accept: 'application/json' },
    queryParams: pickNonNull(params, ['limit']),
    // no body
  });
}

/**
 * GET /organisations/{id}/instances
 * GET /self/instances
 * @param {Object} params
 * @param {String} [params.id]
 * @returns {Promise<RequestParams>}
 */
export function getAllInstances(params) {
  const urlBase = params.id == null ? '/self' : `/organisations/${params.id}`;
  return Promise.resolve({
    method: 'get',
    url: `/v2${urlBase}/instances`,
    headers: { Accept: 'application/json' },
    // no query params
    // no body
  });
}

/**
 * GET /organisations/{id}/members
 * @param {Object} params
 * @param {String} params.id
 * @returns {Promise<RequestParams>}
 */
export function getAllMembers(params) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'get',
    url: `/v2/organisations/${params.id}/members`,
    headers: { Accept: 'application/json' },
    // no query params
    // no body
  });
}

/**
 * POST /organisations/{id}/members
 * @param {Object} params
 * @param {String} params.id
 * @param {String} params.invitationKey
 * @param {Object} body
 * @returns {Promise<RequestParams>}
 */
export function addMember(params, body) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'post',
    url: `/v2/organisations/${params.id}/members`,
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
    queryParams: pickNonNull(params, ['invitationKey']),
    body,
  });
}

/**
 * DELETE /organisations/{id}/members/{userId}
 * @param {Object} params
 * @param {String} params.id
 * @param {String} params.userId
 * @returns {Promise<RequestParams>}
 */
export function removeMemeber(params) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'delete',
    url: `/v2/organisations/${params.id}/members/${params.userId}`,
    headers: { Accept: 'application/json' },
    // no query params
    // no body
  });
}

/**
 * PUT /organisations/{id}/members/{userId}
 * @param {Object} params
 * @param {String} params.id
 * @param {String} params.userId
 * @param {Object} body
 * @returns {Promise<RequestParams>}
 */
export function updateMember(params, body) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'put',
    url: `/v2/organisations/${params.id}/members/${params.userId}`,
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
    // no query params
    body,
  });
}

/**
 * GET /organisations/{id}/namespaces
 * @param {Object} params
 * @param {String} params.id
 * @returns {Promise<RequestParams>}
 */
export function getNamespaces(params) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'get',
    url: `/v2/organisations/${params.id}/namespaces`,
    headers: { Accept: 'application/json' },
    // no query params
    // no body
  });
}

/**
 * GET /organisations/{id}/payment-info
 * GET /self/payment-info
 * @param {Object} params
 * @param {String} [params.id]
 * @returns {Promise<RequestParams>}
 */
export function getPaymentInfo(params) {
  const urlBase = params.id == null ? '/self' : `/organisations/${params.id}`;
  return Promise.resolve({
    method: 'get',
    url: `/v2${urlBase}/payment-info`,
    headers: { Accept: 'application/json' },
    // no query params
    // no body
  });
}

/**
 * GET /organisations/{id}/payments/billings
 * @param {Object} params
 * @param {String} params.id
 * @returns {Promise<RequestParams>}
 */
export function todo_getInvoicesByOrga(params) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'get',
    url: `/v2/organisations/${params.id}/payments/billings`,
    headers: { Accept: 'application/json' },
    // no query params
    // no body
  });
}

/**
 * POST /organisations/{id}/payments/billings
 * @param {Object} params
 * @param {String} params.id
 * @param {Object} body
 * @returns {Promise<RequestParams>}
 */
export function todo_buyDropsByOrga(params, body) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'post',
    url: `/v2/organisations/${params.id}/payments/billings`,
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
    // no query params
    body,
  });
}

/**
 * GET /organisations/{id}/payments/billings/unpaid
 * @param {Object} params
 * @param {String} params.id
 * @returns {Promise<RequestParams>}
 */
export function todo_getUnpaidInvoicesByOrga_1(params) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'get',
    url: `/v2/organisations/${params.id}/payments/billings/unpaid`,
    headers: { Accept: 'application/json' },
    // no query params
    // no body
  });
}

/**
 * DELETE /organisations/{id}/payments/billings/{bid}
 * DELETE /self/payments/billings/{bid}
 * @param {Object} params
 * @param {String} [params.id]
 * @param {String} params.bid
 * @returns {Promise<RequestParams>}
 */
export function deletePurchaseOrder(params) {
  const urlBase = params.id == null ? '/self' : `/organisations/${params.id}`;
  return Promise.resolve({
    method: 'delete',
    url: `/v2${urlBase}/payments/billings/${params.bid}`,
    headers: { Accept: 'application/json' },
    // no query params
    // no body
  });
}

/**
 * GET /organisations/{id}/payments/billings/{bid}
 * GET /self/payments/billings/{bid}
 * @param {Object} params
 * @param {String} [params.id]
 * @param {String} params.bid
 * @returns {Promise<RequestParams>}
 */
export function getInvoice(params) {
  const urlBase = params.id == null ? '/self' : `/organisations/${params.id}`;
  return Promise.resolve({
    method: 'get',
    url: `/v2${urlBase}/payments/billings/${params.bid}`,
    headers: { Accept: 'application/json' },
    // no query params
    // no body
  });
}

/**
 * PUT /organisations/{id}/payments/billings/{bid}
 * PUT /self/payments/billings/{bid}
 * @param {Object} params
 * @param {String} [params.id]
 * @param {String} params.bid
 * @param {Object} body
 * @returns {Promise<RequestParams>}
 */
export function choosePaymentProvider(params, body) {
  const urlBase = params.id == null ? '/self' : `/organisations/${params.id}`;
  return Promise.resolve({
    method: 'put',
    url: `/v2${urlBase}/payments/billings/${params.bid}`,
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
    // no query params
    body,
  });
}

/**
 * GET /organisations/{id}/payments/billings/{bid}.pdf
 * @param {Object} params
 * @param {String} params.id
 * @param {String} params.bid
 * @param {String} params.token
 * @returns {Promise<RequestParams>}
 */
export function todo_getPdfInvoiceByOrga(params) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'get',
    url: `/v2/organisations/${params.id}/payments/billings/${params.bid}.pdf`,
    headers: { Accept: 'application/pdf' },
    queryParams: pickNonNull(params, ['token']),
    // no body
  });
}

/**
 * GET /organisations/{id}/payments/fullprice/{price}
 * @param {Object} params
 * @param {String} params.id
 * @param {String} params.price
 * @returns {Promise<RequestParams>}
 */
export function todo_getPriceWithTaxByOrga(params) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'get',
    url: `/v2/organisations/${params.id}/payments/fullprice/${params.price}`,
    headers: { Accept: 'application/json' },
    // no query params
    // no body
  });
}

/**
 * GET /organisations/{id}/payments/methods
 * @param {Object} params
 * @param {String} params.id
 * @returns {Promise<RequestParams>}
 */
export function todo_getUnpaidInvoicesByOrga(params) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'get',
    url: `/v2/organisations/${params.id}/payments/methods`,
    headers: { Accept: 'application/json' },
    // no query params
    // no body
  });
}

/**
 * POST /organisations/{id}/payments/methods
 * @param {Object} params
 * @param {String} params.id
 * @param {Object} body
 * @returns {Promise<RequestParams>}
 */
export function todo_addPaymentMethodByOrga(params, body) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'post',
    url: `/v2/organisations/${params.id}/payments/methods`,
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
    // no query params
    body,
  });
}

/**
 * GET /organisations/{id}/payments/methods/default
 * @param {Object} params
 * @param {String} params.id
 * @returns {Promise<RequestParams>}
 */
export function todo_getDefaultMethodByOrga(params) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'get',
    url: `/v2/organisations/${params.id}/payments/methods/default`,
    headers: { Accept: 'application/json' },
    // no query params
    // no body
  });
}

/**
 * PUT /organisations/{id}/payments/methods/default
 * @param {Object} params
 * @param {String} params.id
 * @param {Object} body
 * @returns {Promise<RequestParams>}
 */
export function todo_setDefaultMethodByOrga(params, body) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'put',
    url: `/v2/organisations/${params.id}/payments/methods/default`,
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
    // no query params
    body,
  });
}

/**
 * GET /organisations/{id}/payments/methods/newintent
 * @param {Object} params
 * @param {String} params.id
 * @param {String} params.type
 * @returns {Promise<RequestParams>}
 */
export function getNewSetupIntent(params) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'get',
    url: `/v2/organisations/${params.id}/payments/methods/newintent`,
    headers: { Accept: 'application/json' },
    queryParams: pickNonNull(params, ['type']),
    // no body
  });
}

/**
 * DELETE /organisations/{id}/payments/methods/{mId}
 * @param {Object} params
 * @param {String} params.id
 * @param {String} params.mId
 * @returns {Promise<RequestParams>}
 */
export function todo_deletePaymentMethodByOrga(params) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'delete',
    url: `/v2/organisations/${params.id}/payments/methods/${params.mId}`,
    headers: {},
    // no query params
    // no body
  });
}

/**
 * GET /organisations/{id}/payments/monthlyinvoice
 * GET /self/payments/monthlyinvoice
 * @param {Object} params
 * @param {String} [params.id]
 * @returns {Promise<RequestParams>}
 */
export function getMonthlyInvoice(params) {
  const urlBase = params.id == null ? '/self' : `/organisations/${params.id}`;
  return Promise.resolve({
    method: 'get',
    url: `/v2${urlBase}/payments/monthlyinvoice`,
    headers: { Accept: 'application/json' },
    // no query params
    // no body
  });
}

/**
 * PUT /organisations/{id}/payments/monthlyinvoice/maxcredit
 * @param {Object} params
 * @param {String} params.id
 * @param {Object} body
 * @returns {Promise<RequestParams>}
 */
export function todo_setMaxCreditsPerMonthByOrga(params, body) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'put',
    url: `/v2/organisations/${params.id}/payments/monthlyinvoice/maxcredit`,
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
    // no query params
    body,
  });
}

/**
 * DELETE /organisations/{id}/payments/recurring
 * @param {Object} params
 * @param {String} params.id
 * @returns {Promise<RequestParams>}
 */
export function todo_deleteRecurrentPaymentByOrga(params) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'delete',
    url: `/v2/organisations/${params.id}/payments/recurring`,
    headers: { Accept: 'application/json' },
    // no query params
    // no body
  });
}

/**
 * GET /organisations/{id}/payments/recurring
 * @param {Object} params
 * @param {String} params.id
 * @returns {Promise<RequestParams>}
 */
export function todo_getRecurrentPaymentByOrga(params) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'get',
    url: `/v2/organisations/${params.id}/payments/recurring`,
    headers: { Accept: 'application/json' },
    // no query params
    // no body
  });
}

/**
 * GET /organisations/{id}/payments/tokens/stripe
 * @param {Object} params
 * @param {String} params.id
 * @returns {Promise<RequestParams>}
 */
export function getStripeToken(params) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'get',
    url: `/v2/organisations/${params.id}/payments/tokens/stripe`,
    headers: { Accept: 'application/json' },
    // no query params
    // no body
  });
}

/**
 * GET /self/payments/billings
 * @returns {Promise<RequestParams>}
 */
export function todo_getSelfInvoices() {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'get',
    url: `/v2/self/payments/billings`,
    headers: { Accept: 'application/json' },
    // no query params
    // no body
  });
}

/**
 * POST /self/payments/billings
 * @param {Object} params
 * @param {Object} body
 * @returns {Promise<RequestParams>}
 */
export function todo_buySelfDrops(params, body) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'post',
    url: `/v2/self/payments/billings`,
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
    // no query params
    body,
  });
}

/**
 * GET /self/payments/billings/{bid}.pdf
 * @param {Object} params
 * @param {String} params.bid
 * @param {String} params.token
 * @returns {Promise<RequestParams>}
 */
export function todo_getSelfPdfInvoiceById(params) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'get',
    url: `/v2/self/payments/billings/${params.bid}.pdf`,
    headers: { Accept: 'application/pdf' },
    queryParams: pickNonNull(params, ['token']),
    // no body
  });
}

/**
 * GET /self/payments/fullprice/{price}
 * @param {Object} params
 * @param {String} params.price
 * @returns {Promise<RequestParams>}
 */
export function todo_getSelfPriceWithTax(params) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'get',
    url: `/v2/self/payments/fullprice/${params.price}`,
    headers: { Accept: 'application/json' },
    // no query params
    // no body
  });
}

/**
 * GET /self/payments/methods
 * @returns {Promise<RequestParams>}
 */
export function todo_getSelfPaymentMethods() {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'get',
    url: `/v2/self/payments/methods`,
    headers: { Accept: 'application/json' },
    // no query params
    // no body
  });
}

/**
 * POST /self/payments/methods
 * @param {Object} params
 * @param {Object} body
 * @returns {Promise<RequestParams>}
 */
export function todo_addSelfPaymentMethod(params, body) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'post',
    url: `/v2/self/payments/methods`,
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
    // no query params
    body,
  });
}

/**
 * GET /self/payments/methods/default
 * @returns {Promise<RequestParams>}
 */
export function todo_getSelfDefaultMethod() {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'get',
    url: `/v2/self/payments/methods/default`,
    headers: { Accept: 'application/json' },
    // no query params
    // no body
  });
}

/**
 * PUT /self/payments/methods/default
 * @param {Object} params
 * @param {Object} body
 * @returns {Promise<RequestParams>}
 */
export function todo_setSelfDefaultMethod(params, body) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'put',
    url: `/v2/self/payments/methods/default`,
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
    // no query params
    body,
  });
}

/**
 * DELETE /self/payments/methods/{mId}
 * @param {Object} params
 * @param {String} params.mId
 * @returns {Promise<RequestParams>}
 */
export function todo_deleteSelfCard(params) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'delete',
    url: `/v2/self/payments/methods/${params.mId}`,
    headers: { Accept: 'application/json' },
    // no query params
    // no body
  });
}

/**
 * PUT /self/payments/monthlyinvoice/maxcredit
 * @param {Object} params
 * @param {Object} body
 * @returns {Promise<RequestParams>}
 */
export function todo_setSelfMaxCreditsPerMonth(params, body) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'put',
    url: `/v2/self/payments/monthlyinvoice/maxcredit`,
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
    // no query params
    body,
  });
}

/**
 * DELETE /self/payments/recurring
 * @returns {Promise<RequestParams>}
 */
export function todo_deleteSelfRecurrentPayment() {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'delete',
    url: `/v2/self/payments/recurring`,
    headers: { Accept: 'application/json' },
    // no query params
    // no body
  });
}

/**
 * GET /self/payments/recurring
 * @returns {Promise<RequestParams>}
 */
export function todo_getSelfRecurrentPayment() {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'get',
    url: `/v2/self/payments/recurring`,
    headers: { Accept: 'application/json' },
    // no query params
    // no body
  });
}

/**
 * GET /self/payments/tokens/stripe
 * @returns {Promise<RequestParams>}
 */
export function todo_getSelfStripeToken() {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'get',
    url: `/v2/self/payments/tokens/stripe`,
    headers: { Accept: 'application/json' },
    // no query params
    // no body
  });
}
