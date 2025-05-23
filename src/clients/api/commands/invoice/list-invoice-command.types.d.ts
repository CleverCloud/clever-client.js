export interface ListInvoiceCommandInput {
  ownerId: string;
}

export type ListInvoiceCommandOutput = Array<Invoice>;

export interface Invoice {
  invoice_number: 'F20250501-012473';
  kind: 'INVOICE';
  owner_id: 'orga_3547a882-d464-4c34-8168-add4b3e0c135';
  address: {
    address_id: '354236a1-d084-4e28-a393-295710fa6fe8';
    owner_id: 'orga_3547a882-d464-4c34-8168-add4b3e0c135';
    name: 'ACME';
    company: null;
    address: 'Rue Acme';
    city: 'ACME';
    zipcode: '01000';
    country_alpha2: 'FR';
    vat_number: null;
    vat_percent: 20.0;
    customer_cost_center: null;
    customer_purchase_order: null;
  };
  emission_date: '2025-05-01T01:10:29.97408Z';
  pay_date: '2025-05-01T01:10:29.974116Z';
  status: 'PAID';
  currency: 'EUR';
  kpi_compute_months: 1;
  price_factor: 1.0;
  discount: 100.0;
  vat_percent: 20.0;
  total_tax_excluded: {
    currency: 'EUR';
    amount: 0.0;
    amount_formatted: '0.00';
    default_display: '€0.00';
  };
  total_tax: {
    currency: 'EUR';
    amount: 0.0;
    amount_formatted: '0.00';
    default_display: '€0.00';
  };
  category: 'PAAS';
  payment_provider: null;
  transaction_id: null;
  customer_order_id: null;
  invoice_day_plan: null;
}
