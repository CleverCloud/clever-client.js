import { expect } from 'chai';
import { CheckOtoroshiVersionCommand } from '../../../../../src/clients/cc-api/commands/otoroshi/check-otoroshi-version-command.js';
import { CreateOtoroshiNetworkGroupCommand } from '../../../../../src/clients/cc-api/commands/otoroshi/create-otoroshi-network-group-command.js';
import { DeleteOtoroshiNetworkGroupCommand } from '../../../../../src/clients/cc-api/commands/otoroshi/delete-otoroshi-network-group-command.js';
import { GetOtoroshiConfigCommand } from '../../../../../src/clients/cc-api/commands/otoroshi/get-otoroshi-config-command.js';
import { GetOtoroshiInfoCommand } from '../../../../../src/clients/cc-api/commands/otoroshi/get-otoroshi-info-command.js';
import { RebootOtoroshiCommand } from '../../../../../src/clients/cc-api/commands/otoroshi/reboot-otoroshi-command.js';
import { RebuildOtoroshiCommand } from '../../../../../src/clients/cc-api/commands/otoroshi/rebuild-otoroshi-command.js';
import { UpdateOtoroshiVersionCommand } from '../../../../../src/clients/cc-api/commands/otoroshi/update-otoroshi-version-command.js';
import { e2eSupport } from '../e2e-support.js';

describe('otoroshi commands', function () {
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

  it('should get otoroshi info', async () => {
    const addon = await support.createTestAddon({
      name: 'test-otoroshi-addon',
      providerId: 'otoroshi',
      planId: 'plan_d738ee0f-8720-499a-8067-2fca53a2665a',
    });
    const response = await support.client.send(new GetOtoroshiInfoCommand({ addonId: addon.id }));

    expect(response.id).to.equal(addon.realId);
    expect(response.addonId).to.equal(addon.id);
    expect(response.name).to.equal(addon.name);
    expect(response.ownerId).to.equal(support.organisationId);
    expect(response.plan).to.be.a('string');
    expect(response.version).to.be.a('string');
    expect(response.javaVersion).to.be.a('string');
    expect(response.accessUrl).to.be.a('string');
    expect(response.availableVersions).to.be.an('array');
    expect(response.resources.entrypoint).to.be.a('string');
    expect(response.resources.redisId).to.be.a('string');
    expect(response.api.url).to.be.a('string');
    expect(response.api.user).to.be.a('string');
    expect(response.api.secret).to.be.a('string');
    expect(response.api.openapi).to.be.a('string');
    expect(response.initialCredentials.user).to.be.a('string');
    expect(response.initialCredentials.password).to.be.a('string');
    expect(response.features).to.be.an('object');
    expect(response.environment).to.be.an('array');
  });

  it('should reboot otoroshi', async () => {
    const addon = await support.createTestAddon({
      name: 'test-otoroshi-addon',
      providerId: 'otoroshi',
      planId: 'plan_d738ee0f-8720-499a-8067-2fca53a2665a',
    });
    const response = await support.client.send(new RebootOtoroshiCommand({ addonId: addon.id }));

    expect(response).to.be.null;
  });

  it('should rebuild otoroshi', async () => {
    const addon = await support.createTestAddon({
      name: 'test-otoroshi-addon',
      providerId: 'otoroshi',
      planId: 'plan_d738ee0f-8720-499a-8067-2fca53a2665a',
    });
    const response = await support.client.send(new RebuildOtoroshiCommand({ addonId: addon.id }));

    expect(response).to.be.null;
  });

  it('should check otoroshi version', async () => {
    const addon = await support.createTestAddon({
      name: 'test-otoroshi-addon',
      providerId: 'otoroshi',
      planId: 'plan_d738ee0f-8720-499a-8067-2fca53a2665a',
    });
    const response = await support.client.send(new CheckOtoroshiVersionCommand({ addonId: addon.id }));

    expect(response.installed).to.be.a('string');
    expect(response.latest).to.be.a('string');
    expect(response.available).to.be.an('array').that.includes(response.latest);
    expect(response.needUpdate).to.be.a('boolean');
  });

  it('should update otoroshi version', async () => {
    const addon = await support.createTestAddon({
      name: 'test-otoroshi-addon',
      providerId: 'otoroshi',
      planId: 'plan_d738ee0f-8720-499a-8067-2fca53a2665a',
    });
    const info = await support.client.send(new GetOtoroshiInfoCommand({ addonId: addon.id }));

    const response = await support.client.send(
      new UpdateOtoroshiVersionCommand({ addonId: addon.id, targetVersion: info.version }),
    );

    expect(response.id).to.equal(addon.realId);
    expect(response.version).to.be.a('string');
    expect(response.environment).to.be.an('array');
  });

  it('should create otoroshi network group', async () => {
    const addon = await support.createTestAddon({
      name: 'test-otoroshi-addon',
      providerId: 'otoroshi',
      planId: 'plan_d738ee0f-8720-499a-8067-2fca53a2665a',
    });
    const response = await support.client.send(new CreateOtoroshiNetworkGroupCommand({ addonId: addon.id }));

    expect(response.id).to.equal(addon.realId);
    expect(response.features.networkGroup).to.not.be.null;
    expect(response.features.networkGroup.id).to.be.a('string');
  });

  it('should delete otoroshi network group', async () => {
    const addon = await support.createTestAddon({
      name: 'test-otoroshi-addon',
      providerId: 'otoroshi',
      planId: 'plan_d738ee0f-8720-499a-8067-2fca53a2665a',
    });
    // Create a network group first so we can delete it
    await support.client.send(new CreateOtoroshiNetworkGroupCommand({ addonId: addon.id }));

    const response = await support.client.send(new DeleteOtoroshiNetworkGroupCommand({ addonId: addon.id }));

    expect(response).to.be.null;
  });

  it('should get otoroshi config', async () => {
    const addon = await support.createTestAddon({
      name: 'test-otoroshi-addon',
      providerId: 'otoroshi',
      planId: 'plan_d738ee0f-8720-499a-8067-2fca53a2665a',
    });
    const response = await support.client.send(new GetOtoroshiConfigCommand({ addonId: addon.id }));

    expect(response).to.be.a('string');
    expect(response.length).to.be.greaterThan(0);
  });
});
