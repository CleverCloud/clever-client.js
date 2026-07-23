export interface Invoice {
  // renamed from invoice_number
  invoiceNumber: string;
  kind: string;
  origin: 'automatic' | 'manual';
  category?: string;
  address: InvoiceAddress;
  // renamed from emission_date
  // transformed: converted to an ISO date string
  emittedAt: string;
  // renamed from pay_date
  // transformed: converted to an ISO date string
  paidAt?: string;
  status: InvoiceStatus;
  // renamed from consumption_begin_date
  // transformed: converted to an ISO date string
  consumptionStartedAt: string;
  // renamed from consumption_end_date
  // transformed: converted to an ISO date string
  consumptionEndedAt: string;
  currency: string;
  // renamed from kpi_compute_months
  kpiComputeMonths: number;
  // renamed from price_factor
  priceFactor: number;
  discount: number;
  // renamed from vat_percent
  vatPercent: number;
  uptimes: Array<InvoiceUptime>;
  countables: Array<InvoiceCountable>;
  // renamed from vendor_consumption
  vendorConsumptions: Array<InvoiceVendorConsumption>;
  // renamed from classic
  extraItems: Array<InvoiceExtraItem>;
  // renamed from unusable
  unbilledUptimes: Array<InvoiceUnbilledUptime>;
  // renamed from credit_balance_at_emission
  creditBalanceAtEmission: InvoiceMoney;
  // renamed from free_credits_available_this_period
  freeCreditsAvailableThisPeriod: Array<InvoiceCouponRemains>;
  // renamed from free_credits_available_next_period
  freeCreditsAvailableNextPeriod: Array<InvoiceCouponRemains>;
  // renamed from total_pending_upfront_before_emission
  totalPendingUpfrontBeforeEmission: InvoiceMoney;
  // renamed from upfront_credit_amount
  upfrontCreditAmount: InvoiceMoney;
  // renamed from customer_order_id
  customerOrderId?: string;
  // renamed from payment_provider
  paymentProvider?: string;
  // renamed from payment_method_id
  paymentMethodId?: string;
  // renamed from provider_transaction_id
  providerTransactionId?: string;
  // renamed from provider_last_response
  providerLastResponse?: string;
  // renamed from vat_declaration_id
  vatDeclarationId?: string;
  // renamed from total_tax_excluded
  totalTaxExcluded: InvoiceMoney;
  // renamed from total_tax
  totalTax: InvoiceMoney;
}

export interface InvoiceSummary {
  // renamed from invoice_number
  invoiceNumber: string;
  kind: string;
  category?: string;
  address: InvoiceAddress;
  // renamed from emission_date
  emittedAt: string;
  // renamed from pay_date
  paidAt?: string;
  status: InvoiceStatus;
  currency: string;
  // renamed from kpi_compute_months
  kpiComputeMonths: number;
  // renamed from price_factor
  priceFactor: number;
  discount: number;
  // renamed from vat_percent
  vatPercent: number;
  // renamed from total_tax_excluded
  totalTaxExcluded: InvoiceMoney;
  // renamed from total_tax
  totalTax: InvoiceMoney;
  // renamed from payment_provider
  paymentProvider?: string;
  // renamed from transaction_id
  transactionId?: string;
  // renamed from customer_order_id
  customerOrderId?: string;
  // renamed from invoice_day_plan
  invoiceDayPlan?: number;
}

export type InvoiceStatus = 'PENDING' | 'PROCESSING' | 'PAYMENTHELD' | 'PAID' | 'CANCELED' | 'REFUNDED' | 'WONTPAY';

export interface InvoiceAddress {
  // renamed from address_id
  id: string;
  name: string;
  company: string;
  address: string;
  city: string;
  zipcode: string;
  // renamed from country_alpha2
  country?: string;
  // renamed from vat_number
  vatNumber?: string;
  // renamed from vat_percent
  vatPercent: number;
  // renamed from customer_cost_center
  customerCostCenter?: string;
  // renamed from customer_purchase_order
  customerPurchaseOrder?: string;
}

export interface InvoiceUptime {
  // renamed from item_id
  id: string;
  price: InvoiceMoney;
  // renamed from app_id
  applicationId: string;
  // renamed from owner_id
  ownerId: string;
  details: Array<InvoiceUptimeDetail>;
  category: string;
  // renamed from sub_category
  subCategory: string;
}

export interface InvoiceUptimeDetail {
  // renamed from instance_id
  instanceId: string;
  // renamed from flavor_name
  flavorName: string;
  // renamed from zone_id
  zone: string;
  // renamed from runtime_policy_id
  policyId: string;
  price: InvoiceMoney;
  // renamed from consumption_start
  // transformed: converted to an ISO date string
  consumptionStartedAt: string;
  // renamed from consumption_end
  // transformed: converted to an ISO date string
  consumptionEndedAt: string;
}

export interface InvoiceCountable {
  // renamed from item_id
  id: string;
  price: InvoiceMoney;
  // renamed from app_id
  applicationId: string;
  // renamed from owner_id
  ownerId: string;
  service: string;
  // renamed from unit_name
  unitName: string;
  // renamed from zone_id
  zone: string;
  // renamed from policy_id
  policyId: string;
  quantity: number;
  // renamed from plan_id
  planId: string;
  duration?: string;
  // renamed from details_price
  detailsPrice: InvoiceMoney;
  details: Array<InvoiceCountableDetail>;
  category: string;
  // renamed from sub_category
  subCategory: string;
}

export interface InvoiceCountableDetail {
  // renamed from consumption_start
  // transformed: converted to an ISO date string
  consumptionStartedAt: string;
  // renamed from consumption_end
  // transformed: converted to an ISO date string
  consumptionEndedAt: string;
  // renamed from plan_id
  planId: string;
  quantity: number;
  price: InvoiceMoney;
}

export interface InvoiceVendorConsumption {
  // renamed from item_id
  itemId: string;
  price: InvoiceMoney;
  // renamed from vendor_id
  vendorId: string;
  // renamed from owner_id
  ownerId: string;
  // renamed from app_id
  applicationId: string;
}

export interface InvoiceExtraItem {
  // renamed from item_id
  id: string;
  // renamed from unit_price
  unitPrice: InvoiceMoney;
  quantity: number;
  // renamed from price_factor
  priceFactor?: number;
  discount?: number;
  description: string;
  // renamed from sub_description
  subDescription?: string;
  // renamed from classic_billing_item_id
  classicBillingItemId?: string;
  // renamed from owner_id
  ownerId: string;
  category: string;
  // renamed from sub_category
  subCategory: string;
}

export interface InvoiceUnbilledUptime {
  // renamed from item_id
  id: string;
  // renamed from zone_id
  zone: string;
  // renamed from flavor_name
  flavorName: string;
  host: string;
  // renamed from image_type
  imageType?: string;
  // renamed from start_date
  consumptionStartedAt: string;
  // renamed from end_date
  consumptionEndedAt: string;
}

export interface InvoiceMoney {
  amount: number;
  currency: string;
}

export interface InvoiceCouponRemains {
  name: string;
  remaining: InvoiceMoney;
}
