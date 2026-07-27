import { normalizeDate } from '../../../../lib/utils.js';
import type {
  Invoice,
  InvoiceAddress,
  InvoiceCountable,
  InvoiceCountableDetail,
  InvoiceCouponRemains,
  InvoiceExtraItem,
  InvoiceMoney,
  InvoiceSummary,
  InvoiceUnbilledUptime,
  InvoiceUptime,
  InvoiceUptimeDetail,
  InvoiceVendorConsumption,
} from './invoice.types.js';

export function transformInvoice(payload: any): Invoice {
  return {
    invoiceNumber: payload.invoice_number,
    kind: payload.kind,
    origin: payload.origin,
    version: payload.version,
    category: payload.category,
    address: transformAddress(payload.address),
    emittedAt: normalizeDate(payload.emission_date)!,
    paidAt: normalizeDate(payload.pay_date),
    status: payload.status,
    consumptionStartedAt: normalizeDate(payload.consumption_begin_date)!,
    consumptionEndedAt: normalizeDate(payload.consumption_end_date)!,
    currency: payload.currency,
    kpiComputeMonths: payload.kpi_compute_months,
    priceFactor: payload.price_factor,
    discount: payload.discount,
    vatPercent: payload.vat_percent,
    uptimes: (payload.uptimes ?? []).map(transformUptime),
    countables: (payload.countables ?? []).map(transformCountable),
    vendorConsumptions: (payload.vendor_consumption ?? []).map(transformVendorConsumption),
    extraItems: (payload.classic ?? []).map(transformExtraItem),
    unbilledUptimes: (payload.unusable ?? []).map(transformUnbilledUptime),
    creditBalanceAtEmission: transformMoney(payload.credit_balance_at_emission),
    freeCreditsAvailableThisPeriod: (payload.free_credits_available_this_period ?? []).map(transformCouponRemains),
    freeCreditsAvailableNextPeriod: (payload.free_credits_available_next_period ?? []).map(transformCouponRemains),
    totalPendingUpfrontBeforeEmission: transformMoney(payload.total_pending_upfront_before_emission),
    upfrontCreditAmount: transformMoney(payload.upfront_credit_amount),
    customerOrderId: payload.customer_order_id,
    paymentProvider: payload.payment_provider,
    paymentMethodId: payload.payment_method_id,
    providerTransactionId: payload.provider_transaction_id,
    providerLastResponse: payload.provider_last_response,
    vatDeclarationId: payload.vat_declaration_id,
    totalTaxExcluded: transformMoney(payload.total_tax_excluded),
    totalTax: transformMoney(payload.total_tax),
  };
}

export function transformInvoiceSummary(payload: any): InvoiceSummary {
  return {
    invoiceNumber: payload.invoice_number,
    kind: payload.kind,
    category: payload.category,
    address: transformAddress(payload.address),
    emittedAt: payload.emission_date,
    paidAt: payload.pay_date,
    status: payload.status,
    currency: payload.currency,
    kpiComputeMonths: payload.kpi_compute_months,
    priceFactor: payload.price_factor,
    discount: payload.discount,
    vatPercent: payload.vat_percent,
    totalTaxExcluded: payload.total_tax_excluded,
    totalTax: payload.total_tax,
    paymentProvider: payload.payment_provider,
    transactionId: payload.transaction_id,
    customerOrderId: payload.customer_order_id,
    invoiceDayPlan: payload.invoice_day_plan,
  };
}

function transformAddress(payload: any): InvoiceAddress {
  return {
    id: payload.address_id,
    name: payload.name,
    company: payload.company,
    address: payload.address,
    city: payload.city,
    zipcode: payload.zipcode,
    country: payload.country_alpha2,
    vatNumber: payload.vat_number,
    vatPercent: payload.vat_percent,
    customerCostCenter: payload.customer_cost_center,
    customerPurchaseOrder: payload.customer_purchase_order,
  };
}

function transformMoney(payload: any): InvoiceMoney {
  return {
    amount: payload.amount,
    currency: payload.currency,
  };
}

function transformCouponRemains(payload: any): InvoiceCouponRemains {
  return {
    name: payload.name,
    remaining: transformMoney(payload.remaining),
  };
}

function transformUptime(payload: any): InvoiceUptime {
  return {
    id: payload.item_id,
    price: transformMoney(payload.price),
    applicationId: payload.app_id,
    ownerId: payload.owner_id,
    details: (payload.details ?? []).map(transformUptimeDetail),
    category: payload.category,
    subCategory: payload.sub_category,
  };
}

function transformUptimeDetail(payload: any): InvoiceUptimeDetail {
  return {
    instanceId: payload.instance_id,
    flavorName: payload.flavor_name,
    zone: payload.zone_id,
    policyId: payload.runtime_policy_id,
    price: transformMoney(payload.price),
    consumptionStartedAt: normalizeDate(payload.consumption_start)!,
    consumptionEndedAt: normalizeDate(payload.consumption_end)!,
  };
}

function transformCountable(payload: any): InvoiceCountable {
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
    detailsPrice: payload.details_price != null ? transformMoney(payload.details_price) : undefined,
    details: (payload.details ?? []).map(transformCountableDetail),
    category: payload.category,
    subCategory: payload.sub_category,
  };
}

function transformCountableDetail(payload: any): InvoiceCountableDetail {
  return {
    consumptionStartedAt: normalizeDate(payload.consumption_start),
    consumptionEndedAt: normalizeDate(payload.consumption_end),
    planId: payload.plan_id,
    quantity: payload.quantity,
    price: transformMoney(payload.price),
  };
}

function transformVendorConsumption(payload: any): InvoiceVendorConsumption {
  return {
    itemId: payload.item_id,
    price: transformMoney(payload.price),
    vendorId: payload.vendor_id,
    ownerId: payload.owner_id,
    applicationId: payload.app_id,
  };
}

function transformExtraItem(payload: any): InvoiceExtraItem {
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

function transformUnbilledUptime(payload: any): InvoiceUnbilledUptime {
  return {
    id: payload.item_id,
    zone: payload.zone_id,
    flavorName: payload.flavor_name,
    host: payload.host,
    imageType: payload.image_type,
    consumptionStartedAt: payload.start_date,
    consumptionEndedAt: payload.end_date,
  };
}
