import { expect } from 'chai';
import { GetPulsarInfoCommand } from '../../../../../src/clients/cc-api/commands/pulsar/get-pulsar-info-command.js';
import { e2eSupport } from '../e2e-support.js';

// cannot be automatised because addon deletion just after creation is not supported by the platform
describe.skip('pulsar commands', function () {
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

    expect(response.id).to.equal(addon.realId);
    expect(response.tenant).to.be.a('string');
    expect(response.namespace).to.be.a('string');
    expect(response.cluster.id).to.be.a('string');
    expect(response.cluster.url).to.be.a('string');
    expect(response.cluster.pulsarPort).to.be.a('number');
    expect(response.cluster.pulsarTlsPort).to.be.a('number');
    expect(response.cluster.webPort).to.be.a('number');
    expect(response.cluster.webTlsPort).to.be.a('number');
    expect(response.cluster.version).to.be.a('string');
    expect(response.cluster.available).to.be.a('boolean');
    expect(response.cluster.zone).to.be.a('string');
    expect(response.cluster.supportColdStorage).to.be.a('boolean');
    expect(response.cluster.supportedPlans).to.be.an('array');
    expect(response.token).to.be.a('string');
    expect(response.creationDate).to.be.a('string');
    expect(response.askForDeletionDate).to.be.null;
    expect(response.deletionDate).to.be.null;
    expect(response.status).to.be.a('string');
    expect(response.plan).to.be.a('string');
    expect(response.coldStorageLinked).to.be.a('boolean');
    expect(response.coldStorageMustBeProvided).to.be.a('boolean');
  });
});
