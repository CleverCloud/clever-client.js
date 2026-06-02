import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { GetInvoiceCommand } from '../../../../../src/clients/cc-api/commands/invoice/get-invoice-command.js';
import { GetInvoiceHtmlCommand } from '../../../../../src/clients/cc-api/commands/invoice/get-invoice-html-command.js';
import { GetInvoicePdfCommand } from '../../../../../src/clients/cc-api/commands/invoice/get-invoice-pdf-command.js';
import { GetInvoiceUrl } from '../../../../../src/clients/cc-api/commands/invoice/get-invoice-url.js';
import { ListInvoiceCommand } from '../../../../../src/clients/cc-api/commands/invoice/list-invoice-command.js';
import { ListUnpaidInvoiceCommand } from '../../../../../src/clients/cc-api/commands/invoice/list-unpaid-invoice-command.js';
import { checkDateFormat } from '../../../../lib/expect-utils.js';
import { e2eSupport, STATIC_INVOICE_ID } from '../e2e-support.js';

describe('invoice commands', function () {
  const support = e2eSupport({ user: 'test-user-without-github' });

  beforeAll(async () => {
    await support.prepare();
  });

  afterAll(async () => {
    await support.cleanup();
  });

  const invoiceNumber = STATIC_INVOICE_ID;

  it('should get invoice as JSON', async () => {
    const response = await support.client.send(new GetInvoiceCommand({ ownerId: support.userId, invoiceNumber }));

    expect(response).toBeTypeOf('object');
    expect(response.invoiceNumber).toBe(invoiceNumber);
    checkDateFormat(response.emissionDate);
    checkDateFormat(response.payDate);
    checkDateFormat(response.consumptionStartDate);
    checkDateFormat(response.consumptionEndDate);
  });

  it('should get invoice as HTML', async () => {
    const response = await support.client.send(new GetInvoiceHtmlCommand({ ownerId: support.userId, invoiceNumber }));

    expect(response).toMatch(/^<!DOCTYPE html>/);
  });

  it('should list paid invoice', async () => {
    const response = await support.client.send(new ListInvoiceCommand({ ownerId: support.userId }));

    expect(response).toBeInstanceOf(Array);
  });

  it('should list unpaid invoice', async () => {
    const response = await support.client.send(new ListUnpaidInvoiceCommand({ ownerId: support.userId }));

    expect(response).toBeInstanceOf(Array);
  });

  if (support.isNode) {
    it('should get invoice as PDF', async () => {
      const data = await support.client.send(new GetInvoicePdfCommand({ ownerId: support.userId, invoiceNumber }));
      const arrayBuffer = await data.arrayBuffer();
      (await import('node:fs')).writeFileSync('/tmp/test.pdf', new DataView(arrayBuffer));
    });
  }

  it('should get invoice URL', async () => {
    const url = support.client.getUrl(new GetInvoiceUrl({ ownerId: support.userId, invoiceNumber, format: 'pdf' }));

    expect(url.origin).toBeTypeOf('string');
    if (support.isNode) {
      expect(url.pathname).toBe(`/v4/billing/organisations/${support.userId}/invoices/${invoiceNumber}.pdf`);
      expect(atob(url.searchParams.get('authorization'))).toMatch(/^Bearer .+/);
    } else {
      expect(url.pathname).toMatch(
        new RegExp(`^/[^/]+/v4/billing/organisations/${support.userId}/invoices/${invoiceNumber}.pdf$`),
      );
      expect(url.searchParams.get('authorization')).toBeNull();
    }
  });
});
