import { expect } from 'chai';
import { CheckVatNumberCommand } from '../../../../../src/clients/api/commands/vat-number/check-vat-number-command.js';
import { e2eSupport } from '../../../../lib/e2e-support.js';

describe('vat number commands', function () {
  this.timeout(10000);

  const support = e2eSupport(false);

  before(async () => {
    await support.prepare();
  });

  after(async () => {
    await support.cleanup();
  });

  it('should check invalid vat number', async () => {
    const response = await support.client.send(
      new CheckVatNumberCommand({
        country: 'FRA',
        vatNumber: 'FR42448813406',
      }),
    );

    console.log(response);

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
