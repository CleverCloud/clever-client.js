import { expect } from 'chai';
import { GetMatomoInfoCommand } from '../../../../../src/clients/cc-api/commands/matomo/get-matomo-info-command.js';
import { RebootMatomoCommand } from '../../../../../src/clients/cc-api/commands/matomo/reboot-matomo-command.js';
import { RebuildMatomoCommand } from '../../../../../src/clients/cc-api/commands/matomo/rebuild-matomo-command.js';
import { e2eSupport } from '../e2e-support.js';

describe('matomo commands', function () {
  const support = e2eSupport();

  before(async () => {
    await support.prepare();
  });

  afterEach(async () => {
    await support.deleteAddons();
  });

  after(async () => {
    await support.cleanup();
  });

  it('should get matomo info', async () => {
    const addon = await support.createTestAddon({
      name: 'test-matomo-addon',
      providerId: 'addon-matomo',
      planId: 'plan_87283ba6-617c-420d-8e37-3350a2fcdd66',
    });
    const response = await support.client.send(new GetMatomoInfoCommand({ addonId: addon.id }));

    expect(response.id).to.equal(addon.realId);
    expect(response.addonId).to.equal(addon.id);
    expect(response.name).to.equal(addon.name);
    expect(response.ownerId).to.equal(support.organisationId);
    expect(response.plan).to.be.a('string');
    expect(response.version).to.be.a('string');
    expect(response.phpVersion).to.be.a('string');
    expect(response.accessUrl).to.be.a('string');
    expect(response.availableVersions).to.be.an('array');
    expect(response.resources.entrypoint).to.be.a('string');
    expect(response.resources.mysqlId).to.be.a('string');
    expect(response.resources.redisId).to.be.a('string');
    expect(response.resources.kvId == null || typeof response.resources.kvId === 'string').to.be.true;
    expect(response.environment).to.be.a('array');
  });

  it('should reboot matomo', async () => {
    const addon = await support.createTestAddon({
      name: 'test-matomo-addon',
      providerId: 'addon-matomo',
      planId: 'plan_87283ba6-617c-420d-8e37-3350a2fcdd66',
    });
    const response = await support.client.send(new RebootMatomoCommand({ addonId: addon.id }));

    expect(response).to.be.null;
  });

  it('should rebuild matomo', async () => {
    const addon = await support.createTestAddon({
      name: 'test-matomo-addon',
      providerId: 'addon-matomo',
      planId: 'plan_87283ba6-617c-420d-8e37-3350a2fcdd66',
    });
    const response = await support.client.send(new RebuildMatomoCommand({ addonId: addon.id }));

    expect(response).to.be.null;
  });
});
