import { pickNonNull } from '../../pick-non-null.js';

/**
 * GET /organisations
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
 */
export function create(_params: object, body: object) {
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
 */
export function remove(params: { id?: string }) {
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
 */
export function get(params: { id?: string }) {
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
 */
export function update(params: { id?: string }, body: object) {
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
 */
export function updateApplicationTags(params: { id?: string; appId: string }, body: object) {
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
 */
export function listApplicationUDPRedirections(params: { id: string; appId: string }) {
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
 */
export function createApplicationUDPRedirection(params: { id: string; appId: string }, body: object) {
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
 */
export function deleteApplicationUDPRedirection(params: {
  id: string;
  appId: string;
  sourcePort: string;
  namespace: string;
}) {
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
 */
export function updateAvatar(params: { id?: string }, body: object) {
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
 */
export function getConsumptions(params: { id?: string; appId: string; from: string; to: string; for: string }) {
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
 */
export function getCredits(params: { id?: string }) {
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
 */
export function getAllDeployments(params: { id: string; limit: string }) {
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
 */
export function getAllInstances(params: { id?: string }) {
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
 */
export function getAllMembers(params: { id: string }) {
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
 */
export function addMember(params: { id: string; invitationKey: string }, body: object) {
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
 */
export function removeMemeber(params: { id: string; userId: string }) {
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
 */
export function updateMember(params: { id: string; userId: string }, body: object) {
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
 */
export function getNamespaces(params: { id: string }) {
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
 */
export function getPaymentInfo(params: { id?: string }) {
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
 */
export function todo_getInvoicesByOrga(params: { id: string }) {
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
 */
export function todo_buyDropsByOrga(params: { id: string }, body: object) {
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
 */
export function todo_getUnpaidInvoicesByOrga_1(params: { id: string }) {
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
 */
export function deletePurchaseOrder(params: { id?: string; bid: string }) {
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
 */
export function getInvoice(params: { id?: string; bid: string }) {
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
 */
export function choosePaymentProvider(params: { id?: string; bid: string }, body: object) {
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
 */
export function todo_getPdfInvoiceByOrga(params: { id: string; bid: string; token: string }) {
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
 */
export function todo_getPriceWithTaxByOrga(params: { id: string; price: string }) {
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
 */
export function todo_getUnpaidInvoicesByOrga(params: { id: string }) {
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
 */
export function todo_addPaymentMethodByOrga(params: { id: string }, body: object) {
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
 */
export function todo_getDefaultMethodByOrga(params: { id: string }) {
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
 */
export function todo_setDefaultMethodByOrga(params: { id: string }, body: object) {
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
 */
export function getNewSetupIntent(params: { id: string; type: string }) {
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
 */
export function todo_deletePaymentMethodByOrga(params: { id: string; mId: string }) {
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
 */
export function getMonthlyInvoice(params: { id?: string }) {
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
 */
export function todo_setMaxCreditsPerMonthByOrga(params: { id: string }, body: object) {
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
 */
export function todo_deleteRecurrentPaymentByOrga(params: { id: string }) {
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
 */
export function todo_getRecurrentPaymentByOrga(params: { id: string }) {
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
 */
export function getStripeToken(params: { id: string }) {
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
 */
export function todo_buySelfDrops(_params: object, body: object) {
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
 */
export function todo_getSelfPdfInvoiceById(params: { bid: string; token: string }) {
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
 */
export function todo_getSelfPriceWithTax(params: { price: string }) {
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
 */
export function todo_addSelfPaymentMethod(_params: object, body: object) {
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
 */
export function todo_setSelfDefaultMethod(_params: object, body: object) {
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
 */
export function todo_deleteSelfCard(params: { mId: string }) {
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
 */
export function todo_setSelfMaxCreditsPerMonth(_params: object, body: object) {
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
