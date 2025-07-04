import { expect } from 'chai';
import { GetPulsarInfoCommand } from '../../../../../src/clients/api/commands/pulsar/get-pulsar-info-command.js';
import { e2eSupport } from '../../../../lib/e2e-support.js';

describe('pulsar commands', function () {
  this.timeout(10000);

  const support = e2eSupport();

  before(async () => {
    await support.prepare();
  });

  after(async () => {
    await support.cleanup();
  });

  afterEach(async () => {
    await support.deleteAddons();
  });

  it('should get pulsar info', async () => {
    const addon = await support.createTestAddon({
      ownerId: support.organisationId,
      name: 'test-pulsar',
      providerId: 'addon-pulsar',
      planId: 'plan_3ad3c5be-5c1e-4dae-bf9a-87120b88fc13',
      zone: 'par',
    });

    const response = await support.client.send(new GetPulsarInfoCommand({ addonId: addon.id }));

    console.log(response);

    expect(response.id).to.equal(addon.realId);
  });
});
