import { pickNonNull } from '../../pick-non-null.js';

/**
 * @typedef {import('../../request.types.js').RequestParams} RequestParams
 */

/**
 * GET /billing/organisations/{id}/credits/summary
 * @param {Object} params
 * @param {String} params.id
 * @returns {Promise<RequestParams>}
 */
export function getCreditsSummary(params) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'get',
    url: `/v4/billing/organisations/${params.id}/credits/summary`,
    headers: { Accept: 'application/json' },
    // no query params
    // no body
  });
}

/**
 * GET /billing/organisations/{id}/invoices
 * @param {Object} params
 * @param {String} params.id
 * @param {String} params.since
 * @returns {Promise<RequestParams>}
 */
export function getAllInvoices(params) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'get',
    url: `/v4/billing/organisations/${params.id}/invoices`,
    headers: { Accept: 'application/json' },
    queryParams: pickNonNull(params, ['since']),
    // no body
  });
}

/**
 * GET /billing/organisations/{id}/invoices/unpaid
 * @param {Object} params
 * @param {String} params.id
 * @returns {Promise<RequestParams>}
 */
export function getAllUnpaidInvoices(params) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'get',
    url: `/v4/billing/organisations/${params.id}/invoices/unpaid`,
    headers: { Accept: 'application/json' },
    // no query params
    // no body
  });
}

/**
 * POST /billing/organisations/{id}/invoices/{invoiceNumber}/payments/paypal
 * @param {Object} params
 * @param {String} params.id
 * @param {String} params.invoiceNumber
 * @returns {Promise<RequestParams>}
 */
export function initPaypalPayment(params) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'post',
    url: `/v4/billing/organisations/${params.id}/invoices/${params.invoiceNumber}/payments/paypal`,
    headers: { Accept: 'application/json' },
    // no query params
    // no body
  });
}

/**
 * PUT /billing/organisations/{id}/invoices/{invoiceNumber}/payments/paypal/{payerId}
 * @param {Object} params
 * @param {String} params.id
 * @param {String} params.invoiceNumber
 * @param {String} params.payerId
 * @returns {Promise<RequestParams>}
 */
export function authorizePaypalPayment(params) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'put',
    url: `/v4/billing/organisations/${params.id}/invoices/${params.invoiceNumber}/payments/paypal/${params.payerId}`,
    headers: { Accept: 'application/json' },
    // no query params
    // no body
  });
}

/**
 * POST /billing/organisations/{id}/invoices/{invoiceNumber}/payments/stripe
 * @param {Object} params
 * @param {String} params.id
 * @param {String} params.invoiceNumber
 * @param {Object} body
 * @returns {Promise<RequestParams>}
 */
export function initStripePayment(params, body) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'post',
    url: `/v4/billing/organisations/${params.id}/invoices/${params.invoiceNumber}/payments/stripe`,
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
    // no query params
    body,
  });
}

/**
 * PUT /billing/organisations/{id}/invoices/{invoiceNumber}/payments/stripe/{paymentId}
 * @param {Object} params
 * @param {String} params.id
 * @param {String} params.invoiceNumber
 * @param {String} params.paymentId
 * @returns {Promise<RequestParams>}
 */
export function authorizeStripePayment(params) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'put',
    url: `/v4/billing/organisations/${params.id}/invoices/${params.invoiceNumber}/payments/stripe/${params.paymentId}`,
    headers: { Accept: 'application/json' },
    // no query params
    // no body
  });
}

/**
 * GET /billing/organisations/{id}/invoices/{invoiceNumber}{type}
 * @param {Object} params
 * @param {String} params.id
 * @param {String} params.invoiceNumber
 * @param {String} params.type
 * @returns {Promise<RequestParams>}
 */
export function getInvoice(params) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'get',
    url: `/v4/billing/organisations/${params.id}/invoices/${params.invoiceNumber}${params.type}`,
    headers: { Accept: 'application/json' },
    // no query params
    // no body
  });
}

/**
 * GET /billing/organisations/{id}/payments/methods
 * @param {Object} params
 * @param {String} params.id
 * @returns {Promise<RequestParams>}
 */
export function getPaymentMethods(params) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'get',
    url: `/v4/billing/organisations/${params.id}/payments/methods`,
    headers: { Accept: 'application/json' },
    // no query params
    // no body
  });
}

/**
 * POST /billing/organisations/{id}/payments/methods
 * @param {Object} params
 * @param {String} params.id
 * @param {Object} body
 * @returns {Promise<RequestParams>}
 */
export function createPaymentMethod(params, body) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'post',
    url: `/v4/billing/organisations/${params.id}/payments/methods`,
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
    // no query params
    body,
  });
}

/**
 * PUT /billing/organisations/{id}/payments/methods/default
 * @param {Object} params
 * @param {String} params.id
 * @param {Object} body
 * @returns {Promise<RequestParams>}
 */
export function setDefaultPaymentMethod(params, body) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'put',
    url: `/v4/billing/organisations/${params.id}/payments/methods/default`,
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
    // no query params
    body,
  });
}

/**
 * DELETE /billing/organisations/{id}/payments/methods/{methodId}
 * @param {Object} params
 * @param {String} params.id
 * @param {String} params.methodId
 * @returns {Promise<RequestParams>}
 */
export function deletePaymentMethod(params) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'delete',
    url: `/v4/billing/organisations/${params.id}/payments/methods/${params.methodId}`,
    headers: { Accept: 'application/json' },
    // no query params
    // no body
  });
}

/**
 * GET /billing/organisations/{id}/payments/stripe/intent
 * @param {Object} params
 * @param {String} params.id
 * @param {String} params.type
 * @returns {Promise<RequestParams>}
 */
export function getStripePaymentIntent(params) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'get',
    url: `/v4/billing/organisations/${params.id}/payments/stripe/intent`,
    headers: { Accept: 'application/json' },
    queryParams: pickNonNull(params, ['type']),
    // no body
  });
}

/**
 * GET /billing/organisations/{owner_id}/price-system
 * @param {Object} params
 * @param {String} params.owner_id
 * @param {String} params.zone_id
 * @returns {Promise<RequestParams>}
 */
export function getOrganisationPriceSystem(params) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'get',
    url: `/v4/billing/organisations/${params.owner_id}/price-system`,
    headers: { Accept: 'application/json' },
    queryParams: pickNonNull(params, ['zone_id']),
    // no body
  });
}

/**
 * GET /billing/price-system
 * @param {Object} params
 * @param {String} params.zone_id
 * @param {String} params.currency
 * @returns {Promise<RequestParams>}
 */
export function getPriceSystem(params) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'get',
    url: `/v4/billing/price-system`,
    headers: { Accept: 'application/json' },
    queryParams: pickNonNull(params, ['zone_id', 'currency']),
    // no body
  });
}
