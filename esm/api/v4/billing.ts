import { pickNonNull } from '../../pick-non-null.js';

/**
 * GET /billing/organisations/{id}/credits/summary
 */
export function getCreditsSummary(params: { id: string }) {
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
 */
export function getAllInvoices(params: { id: string; since: string }) {
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
 */
export function getAllUnpaidInvoices(params: { id: string }) {
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
 */
export function initPaypalPayment(params: { id: string; invoiceNumber: string }) {
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
 */
export function authorizePaypalPayment(params: { id: string; invoiceNumber: string; payerId: string }) {
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
 */
export function initStripePayment(params: { id: string; invoiceNumber: string }, body: object) {
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
 */
export function authorizeStripePayment(params: { id: string; invoiceNumber: string; paymentId: string }) {
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
 */
export function getInvoice(params: { id: string; invoiceNumber: string; type: string }) {
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
 */
export function getPaymentMethods(params: { id: string }) {
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
 */
export function createPaymentMethod(params: { id: string }, body: object) {
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
 */
export function setDefaultPaymentMethod(params: { id: string }, body: object) {
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
 */
export function deletePaymentMethod(params: { id: string; methodId: string }) {
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
 */
export function getStripePaymentIntent(params: { id: string; type: string }) {
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
 */
export function getOrganisationPriceSystem(params: { owner_id: string; zone_id: string }) {
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
 */
export function getPriceSystem(params: { zone_id: string; currency: string }) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'get',
    url: `/v4/billing/price-system`,
    headers: { Accept: 'application/json' },
    queryParams: pickNonNull(params, ['zone_id', 'currency']),
    // no body
  });
}
