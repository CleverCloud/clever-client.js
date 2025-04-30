import { expect } from 'chai';
import { GetJenkinsInfoCommand } from '../../../../../src/clients/cc-api/commands/jenkins/get-jenkins-info-command.js';
import { e2eSupport } from '../../../../lib/e2e-support.js';

// cannot be automatised because addon deletion just after creation is not supported by the platform
describe.skip('jenkins commands', function () {
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

  it('should get jenkins info', async () => {
    const addon = await support.createTestAddon({
      ownerId: support.organisationId,
      name: 'test-jenkins',
      zone: 'par',
      providerId: 'jenkins',
      planId: 'plan_9436de3e-b4e6-48e7-8f5c-0bec0dc8b592',
      options: {
        version: 'LTS',
        encryption: 'false',
      },
    });

    const response = await support.client.send(new GetJenkinsInfoCommand({ addonId: addon.id }));

    expect(response.id).to.be.a('string');
    expect(response.addonId).to.equal(addon.id);
    expect(response.plan).to.equal('XS');
    expect(response.zone).to.equal('par');
    expect(response.creationDate).to.equal(new Date(response.creationDate).toISOString());
    expect(response.deletionDate).to.be.null;
    expect(response.status).to.equal('ACTIVE');
    expect(response.host).to.be.a('string');
    expect(response.user).to.be.a('string');
    expect(response.password).to.be.a('string');
    expect(response.version).to.be.a('string');
    expect(response.features).to.deep.equalInAnyOrder([{ name: 'encryption', enabled: false }]);
    expect(response.updates.manageLink).to.be.a('string');
    expect(response.updates.versions.current).to.be.a('string');
    expect(response.updates.versions.available).to.be.a('string');
  });
});
