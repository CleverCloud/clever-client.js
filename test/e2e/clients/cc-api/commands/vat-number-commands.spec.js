import { expect } from 'chai';
import { CheckVatNumberCommand } from '../../../../../src/clients/cc-api/commands/vat-number/check-vat-number-command.js';
import { e2eSupport } from '../e2e-support.js';

// Cannot be automatised because API is not stable (sometimes we get rate limited)
describe.skip('vat number commands', function () {
  const support = e2eSupport();

  before(async () => {
    await support.prepare();
  });

  after(async () => {
    await support.cleanup();
  });

  it('should check invalid vat number', async () => {
    const response = await support.client.send(
      new CheckVatNumberCommand({
        country: 'FR',
        vatNumber: '42448813406',
      }),
    );

    expect(response).to.deep.equal({
      valid: false,
    });
  });

  it('should check vat number', async () => {
    const response = await support.client.send(
      new CheckVatNumberCommand({
        country: 'FR',
        vatNumber: 'FR84539130195',
      }),
    );

    expect(response).to.deep.equal({
      valid: true,
      name: 'SA LE SLIP FRANCAIS',
      address: '6 RUE DE PARADIS\n75010 PARIS',
    });
  });
});
