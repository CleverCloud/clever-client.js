/**
 * @import { Invoice, InvoiceMoney, InvoiceCouponRemains, InvoiceUptime, InvoiceUptimeDetail, InvoiceCountable, InvoiceCountableDetail, InvoiceVendorConsumption, InvoiceClassic, InvoiceUnusable } from './invoice.types.js'
 */

import { normalizeDate } from '../../../../lib/utils.js';

/**
 *
 * @param {any} payload
 * @returns {Invoice}
 */
export function transformInvoice(payload) {
  return {
    invoiceNumber: payload.invoice_number,
    kind: payload.kind,
    origin: payload.origin,
    category: payload.category,
    address: {
      id: payload.address.address_id,
      name: payload.address.name,
      company: payload.address.company,
      address: payload.address.address,
      city: payload.address.city,
      zipcode: payload.address.zipcode,
      country: payload.address.country_alpha2,
      vatNumber: payload.address.vat_number,
      vatPercent: payload.address.vat_percent,
      customerCostCenter: payload.address.customer_cost_center,
      customerPurchaseOrder: payload.address.customer_purchase_order,
    },
    emissionDate: normalizeDate(payload.emission_date),
    payDate: normalizeDate(payload.pay_date),
    status: payload.status,
    consumptionStartDate: normalizeDate(payload.consumption_begin_date),
    consumptionEndDate: normalizeDate(payload.consumption_end_date),
    currency: payload.currency,
    kpiComputeMonths: payload.kpi_compute_months,
    priceFactor: payload.price_factor,
    discount: payload.discount,
    vatPercent: payload.vat_percent,
    uptimes: payload.uptimes.map(transformUptime),
    countables: payload.countables.map(transformCountable),
    vendorConsumption: payload.vendor_consumption.map(transformVendorConsumption),
    classic: payload.classic.map(transformClassic),
    unusable: payload.unusable.map(transformUnusable),
    creditBalanceAtEmission: transformMoney(payload.credit_balance_at_emission),
    freeCreditsAvailableThisPeriod: payload.free_credits_available_this_period.map(transformCouponRemains),
    freeCreditsAvailableNextPeriod: payload.free_credits_available_next_period.map(transformCouponRemains),
    totalPendingUpfrontBeforeEmission: transformMoney(payload.total_pending_upfront_before_emission),
    upfrontCreditAmount: transformMoney(payload.upfront_credit_amount),
    customerOrderId: payload.customer_order_id,
    paymentProvider: payload.payment_provider,
    paymentMethodId: payload.payment_method_id,
    providerTransactionId: payload.provider_transaction_id,
    providerLastResponse: payload.provider_last_response,
    vatDeclarationId: payload.vat_declaration_id,
    wannabeInvoiceId: payload.wannabe_invoice_id,
    totalTaxExcluded: transformMoney(payload.total_tax_excluded),
    totalTax: transformMoney(payload.total_tax),
  };
}

/**
 * @param {any} payload
 * @returns {InvoiceMoney}
 */
function transformMoney(payload) {
  return {
    amount: payload.amount,
    currency: payload.currency,
  };
}

/**
 * @param {any} payload
 * @returns {InvoiceCouponRemains}
 */
function transformCouponRemains(payload) {
  return {
    name: payload.name,
    remaining: transformMoney(payload.remaining),
  };
}

/**
 * @param {any} payload
 * @returns {InvoiceUptime}
 */
function transformUptime(payload) {
  return {
    id: payload.item_id,
    price: transformMoney(payload.price),
    applicationId: payload.app_id,
    ownerId: payload.owner_id,
    details: payload.details.map(transformUptimeDetail),
    category: payload.category,
    subCategory: payload.sub_category,
  };
}

/**
 * @param {any} payload
 * @returns {InvoiceUptimeDetail}
 */
function transformUptimeDetail(payload) {
  return {
    instanceId: payload.instance_id,
    flavorName: payload.flavor_name,
    zone: payload.zone_id,
    policyId: payload.runtime_policy_id,
    price: transformMoney(payload.price),
    consumptionStartDate: normalizeDate(payload.consumption_start),
    consumptionEndDate: normalizeDate(payload.consumption_end),
  };
}

/**
 * @param {any} payload
 * @returns {InvoiceCountable}
 */
function transformCountable(payload) {
  return {
    id: payload.item_id,
    price: transformMoney(payload.price),
    applicationId: payload.app_id,
    ownerId: payload.owner_id,
    service: payload.service,
    unitName: payload.unit_name,
    zone: payload.zone_id,
    policyId: payload.policy_id,
    quantity: payload.quantity,
    planId: payload.plan_id,
    duration: payload.duration,
    detailsPrice: transformMoney(payload.details_price),
    details: payload.details.map(transformCountableDetail),
    category: payload.category,
    subCategory: payload.sub_category,
  };
}

/**
 * @param {any} payload
 * @returns {InvoiceCountableDetail}
 */
function transformCountableDetail(payload) {
  return {
    consumptionStartDate: normalizeDate(payload.consumption_start),
    consumptionEndDate: normalizeDate(payload.consumption_end),
    planId: payload.plan_id,
    quantity: payload.quantity,
    price: transformMoney(payload.price),
  };
}

/**
 * @param {any} payload
 * @returns {InvoiceVendorConsumption}
 */
function transformVendorConsumption(payload) {
  return {
    itemId: payload.item_id,
    price: transformMoney(payload.price),
    vendorId: payload.vendor_id,
    ownerId: payload.owner_id,
    applicationId: payload.app_id,
  };
}

/**
 * @param {any} payload
 * @returns {InvoiceClassic}
 */
function transformClassic(payload) {
  return {
    id: payload.item_id,
    unitPrice: transformMoney(payload.unit_price),
    quantity: payload.quantity,
    priceFactor: payload.price_factor,
    discount: payload.discount,
    description: payload.description,
    subDescription: payload.sub_description,
    classicBillingItemId: payload.classic_billing_item_id,
    ownerId: payload.owner_id,
    category: payload.category,
    subCategory: payload.sub_category,
  };
}

/**
 * @param {any} payload
 * @returns {InvoiceUnusable}
 */
function transformUnusable(payload) {
  return {
    id: payload.item_id,
    zone: payload.zone_id,
    flavorName: payload.flavor_name,
    host: payload.host,
    imageType: payload.image_type,
    consumptionStartDate: payload.start_date,
    consumptionEndDate: payload.end_date,
  };
}
