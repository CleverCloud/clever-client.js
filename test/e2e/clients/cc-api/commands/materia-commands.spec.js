import { expect } from 'chai';
import { GetMateriaInfoCommand } from '../../../../../src/clients/cc-api/commands/materia/get-materia-info-command.js';
import { e2eSupport } from '../e2e-support.js';

// cannot be automatised because addon deletion just after creation is not supported by the platform
// todo: find a way to wait for addon to be ready for deletion
describe.skip('materia commands', function () {
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

  it('should get materia info', async () => {
    const addon = await support.createTestAddon({
      name: 'test-kv-addon',
      providerId: 'kv',
      planId: 'plan_53a1728d-4b9e-4254-94c4-b19163af587b',
    });

    const response = await support.client.send(new GetMateriaInfoCommand({ addonId: addon.id }));

    expect(response.id).to.equal(addon.realId);
    expect(response.clusterId).to.be.a('string');
    expect(response.ownerId).to.equal(support.organisationId);
    expect(response.kind).to.equal('KV');
    expect(response.plan).to.be.a('string');
    expect(response.host).to.be.a('string');
    expect(response.port).to.be.a('number');
    expect(response.token).to.be.a('string');
    expect(response.tokenId).to.be.a('string');
    expect(response.status).to.be.a('string');
  });
});
