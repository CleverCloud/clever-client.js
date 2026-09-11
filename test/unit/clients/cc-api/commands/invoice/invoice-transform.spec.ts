import { describe, expect, it } from 'vitest';
import { transformInvoiceSummary } from '../../../../../../src/clients/cc-api/commands/invoice/invoice-transform.js';

/**
 * A payload as `InvoiceSummary` serialises it. The `Money` codec writes four keys, of which the
 * client publishes two.
 */
function getInvoiceSummaryPayload() {
  return {
    invoice_number: '202609110001',
    kind: 'INVOICE',
    owner_id: 'orga_11111111-1111-1111-1111-111111111111',
    address: {
      address_id: 'address_22222222-2222-2222-2222-222222222222',
      name: 'Someone',
      company: 'Some Company',
      address: '1 street',
      city: 'Nantes',
      zipcode: '44000',
      country_alpha2: 'FR',
      vat_number: 'FR00000000000',
      vat_percent: 20,
      customer_cost_center: null,
      customer_purchase_order: null,
    },
    emission_date: '2026-09-11T00:00:00Z',
    pay_date: null,
    status: 'PENDING',
    currency: 'EUR',
    kpi_compute_months: 1,
    price_factor: 1,
    discount: 0,
    vat_percent: 20,
    total_tax_excluded: { currency: 'EUR', amount: 42.5, amount_formatted: '42.50', default_display: '€42.50' },
    total_tax: { currency: 'EUR', amount: 8.5, amount_formatted: '8.50', default_display: '€8.50' },
    category: 'PAAS',
    payment_provider: null,
    transaction_id: null,
    customer_order_id: null,
    invoice_day_plan: null,
  };
}

describe('invoice-transform', () => {
  describe('transformInvoiceSummary', () => {
    it('should map the totals like the full invoice does', () => {
      const summary = transformInvoiceSummary(getInvoiceSummaryPayload());

      expect(summary.totalTaxExcluded).toEqual({ amount: 42.5, currency: 'EUR' });
      expect(summary.totalTax).toEqual({ amount: 8.5, currency: 'EUR' });
    });

    it('should keep the formatted amounts out of the published totals', () => {
      const summary = transformInvoiceSummary(getInvoiceSummaryPayload());

      expect(Object.keys(summary.totalTaxExcluded)).not.toContain('amount_formatted');
      expect(Object.keys(summary.totalTaxExcluded)).not.toContain('default_display');
      expect(Object.keys(summary.totalTax)).not.toContain('amount_formatted');
      expect(Object.keys(summary.totalTax)).not.toContain('default_display');
    });
  });
});
