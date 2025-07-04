import { expect } from 'chai';
import { GetInvoiceCommand } from '../../../../../src/clients/api/commands/invoice/get-invoice-command.js';
import { GetInvoiceHtmlCommand } from '../../../../../src/clients/api/commands/invoice/get-invoice-html-command.js';
import { GetInvoicePdfCommand } from '../../../../../src/clients/api/commands/invoice/get-invoice-pdf-command.js';
import { GetInvoiceUrl } from '../../../../../src/clients/api/commands/invoice/get-invoice-url.js';
import { e2eSupport } from '../../../../lib/e2e-support.js';

// this test cannot be automatised because we cannot generate invoice dynamically

describe.skip('invoice commands', function () {
  this.timeout(10000);

  const support = e2eSupport({ auth: 'DEV' });

  const organisationId = 'orga_540caeb6-521c-4a19-a955-efe6da35d142';
  const invoiceNumber = 'F20250602-015972';

  it('should get invoice as JSON', async () => {
    console.log(await support.client.send(new GetInvoiceCommand({ ownerId: organisationId, invoiceNumber })));
  });

  it('should get invoice as HTML', async () => {
    console.log(await support.client.send(new GetInvoiceHtmlCommand({ ownerId: organisationId, invoiceNumber })));
  });

  if (support.isNode) {
    it('should get invoice as PDF', async () => {
      const data = await support.client.send(new GetInvoicePdfCommand({ ownerId: organisationId, invoiceNumber }));
      const arrayBuffer = await data.arrayBuffer();
      // eslint-disable-next-line no-undef
      const buffer = Buffer.from(arrayBuffer);
      (await import('node:fs')).writeFileSync('/tmp/test.pdf', buffer);
    });
  }

  it('should get invoice URL', async () => {
    const url = support.client.getUrl(new GetInvoiceUrl({ ownerId: organisationId, invoiceNumber, format: 'pdf' }));

    expect(url.origin).to.be.a('string');
    expect(url.pathname).to.equal(`/v4/billing/organisations/${organisationId}/invoices/${invoiceNumber}.pdf`);
    expect(atob(url.searchParams.get('authorization'))).to.match(/^Bearer .+/);
  });
});
