import { expect } from 'chai';
import { GetInvoiceCommand } from '../../../../../src/clients/cc-api/commands/invoice/get-invoice-command.js';
import { GetInvoiceHtmlCommand } from '../../../../../src/clients/cc-api/commands/invoice/get-invoice-html-command.js';
import { GetInvoicePdfCommand } from '../../../../../src/clients/cc-api/commands/invoice/get-invoice-pdf-command.js';
import { GetInvoiceUrl } from '../../../../../src/clients/cc-api/commands/invoice/get-invoice-url.js';
import { e2eSupport, STATIC_INVOICE_ID } from '../e2e-support.js';

// this test cannot be automatised because we don't have an invoiceNumber dedicated for tests
// todo: ask the billing team to generate a fake invoice for this test
describe.skip('invoice commands', function () {
  this.timeout(10000);

  const support = e2eSupport({ user: 'test-user-without-github' });

  before(async () => {
    await support.prepare();
  });

  after(async () => {
    await support.cleanup();
  });

  const invoiceNumber = STATIC_INVOICE_ID;

  it('should get invoice as JSON', async () => {
    const response = await support.client.send(new GetInvoiceCommand({ ownerId: support.userId, invoiceNumber }));

    console.log(response);
  });

  it('should get invoice as HTML', async () => {
    const response = await support.client.send(new GetInvoiceHtmlCommand({ ownerId: support.userId, invoiceNumber }));

    console.log(response);
  });

  if (support.isNode) {
    it('should get invoice as PDF', async () => {
      const data = await support.client.send(new GetInvoicePdfCommand({ ownerId: support.userId, invoiceNumber }));
      const arrayBuffer = await data.arrayBuffer();
      // eslint-disable-next-line no-undef
      const buffer = Buffer.from(arrayBuffer);
      (await import('node:fs')).writeFileSync('/tmp/test.pdf', buffer);
    });
  }

  it('should get invoice URL', async () => {
    const url = support.client.getUrl(new GetInvoiceUrl({ ownerId: support.userId, invoiceNumber, format: 'pdf' }));

    expect(url.origin).to.be.a('string');
    expect(url.pathname).to.equal(`/v4/billing/organisations/${support.userId}/invoices/${invoiceNumber}.pdf`);
    expect(atob(url.searchParams.get('authorization'))).to.match(/^Bearer .+/);
  });
});
