import { expect } from 'chai';
import { GetElasticsearchInfoCommand } from '../../../../../src/clients/cc-api/commands/elasticsearch/get-elasticsearch-info-command.js';
import { e2eSupport } from '../e2e-support.js';

// cannot be automatised because addon deletion just after creation is not supported by the platform
// todo: find a way to wait for addon to be ready for deletion
describe.skip('elasticsearch commands', function () {
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

  it('should get elasticsearch info', async () => {
    const addon = await support.createTestAddon({
      ownerId: support.organisationId,
      name: 'test-es-addon',
      providerId: 'es-addon',
      planId: 'plan_0e0bc5ea-ba21-41e8-865b-1ed48e0163ca',
      zone: 'par',
      options: {
        version: '8',
        encryption: 'false',
        services: '[{"name":"kibana","enabled":false},{"name":"apm","enabled":false}]',
      },
    });

    const response = await support.client.send(new GetElasticsearchInfoCommand({ addonId: addon.id }));

    expect(response.id).to.be.a('string');
    expect(response.ownerId).to.equal(support.organisationId);
    expect(response.addonId).to.equal(addon.id);
    expect(response.plan).to.equal('XS');
    expect(response.zone).to.equal('par');
    expect(response.config.host).to.be.a('string');
    expect(response.config.user).to.be.a('string');
    expect(response.config.password).to.be.a('string');
    expect(response.config.apmUser).to.be.a('string');
    expect(response.config.apmPassword).to.be.a('string');
    expect(response.config.apmAuthToken).to.be.a('string');
    expect(response.config.kibanaUser).to.be.a('string');
    expect(response.version).to.equal('8');
    expect(response.backups.kibanaSnapshotsUrl).to.be.a('string');
    expect(response.kibanaApplication).to.be.undefined;
    expect(response.apmApplication).to.be.undefined;
    expect(response.services).to.deep.equalInAnyOrder([
      { name: 'kibana', enabled: false },
      { name: 'apm', enabled: false },
    ]);
    expect(response.features).to.deep.equalInAnyOrder([
      { name: 'kibana', enabled: false },
      { name: 'apm', enabled: false },
      { name: 'encryption', enabled: false },
    ]);
  });
});
