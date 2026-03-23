import { expect } from 'chai';
import { CheckKeycloakVersionCommand } from '../../../../../src/clients/cc-api/commands/keycloak/check-keycloak-version-command.js';
import { CreateKeycloakNetworkGroupCommand } from '../../../../../src/clients/cc-api/commands/keycloak/create-keycloak-network-group-command.js';
import { DeleteKeycloakNetworkGroupCommand } from '../../../../../src/clients/cc-api/commands/keycloak/delete-keycloak-network-group-command.js';
import { GetKeycloakInfoCommand } from '../../../../../src/clients/cc-api/commands/keycloak/get-keycloak-info-command.js';
import { RebootKeycloakCommand } from '../../../../../src/clients/cc-api/commands/keycloak/reboot-keycloak-command.js';
import { RebuildKeycloakCommand } from '../../../../../src/clients/cc-api/commands/keycloak/rebuild-keycloak-command.js';
import { UpdateKeycloakVersionCommand } from '../../../../../src/clients/cc-api/commands/keycloak/update-keycloak-version-command.js';
import { e2eSupport } from '../e2e-support.js';

describe('keycloak commands', function () {
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

  it('should get keycloak info', async () => {
    const addon = await support.createTestAddon({
      name: 'test-keycloak-addon',
      providerId: 'keycloak',
      planId: 'plan_3819e4b3-cc6d-4847-9f02-0db93212956c',
    });
    const response = await support.client.send(new GetKeycloakInfoCommand({ addonId: addon.id }));

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
    expect(response.resources.fsbucketId).to.be.a('string');
    expect(response.resources.pgsqlId).to.be.a('string');
    expect(response.features).to.be.an('object').that.is.not.null;
    expect(response.initialCredentials.user).to.be.a('string');
    expect(response.initialCredentials.password).to.be.a('string');
    expect(response.environment).to.be.an('array');
  });

  it('should reboot keycloak', async () => {
    const addon = await support.createTestAddon({
      name: 'test-keycloak-addon',
      providerId: 'keycloak',
      planId: 'plan_3819e4b3-cc6d-4847-9f02-0db93212956c',
    });
    const response = await support.client.send(new RebootKeycloakCommand({ addonId: addon.id }));

    expect(response).to.be.null;
  });

  it('should rebuild keycloak', async () => {
    const addon = await support.createTestAddon({
      name: 'test-keycloak-addon',
      providerId: 'keycloak',
      planId: 'plan_3819e4b3-cc6d-4847-9f02-0db93212956c',
    });
    const response = await support.client.send(new RebuildKeycloakCommand({ addonId: addon.id }));

    expect(response).to.be.null;
  });

  it('should check keycloak version', async () => {
    const addon = await support.createTestAddon({
      name: 'test-keycloak-addon',
      providerId: 'keycloak',
      planId: 'plan_3819e4b3-cc6d-4847-9f02-0db93212956c',
    });
    const response = await support.client.send(new CheckKeycloakVersionCommand({ addonId: addon.id }));

    expect(response.installed).to.be.a('string');
    expect(response.latest).to.be.a('string');
    expect(response.available).to.be.an('array').that.includes(response.latest);
    expect(response.needUpdate).to.be.a('boolean');
  });

  it('should update keycloak version', async () => {
    const addon = await support.createTestAddon({
      name: 'test-keycloak-addon',
      providerId: 'keycloak',
      planId: 'plan_3819e4b3-cc6d-4847-9f02-0db93212956c',
    });
    const info = await support.client.send(new GetKeycloakInfoCommand({ addonId: addon.id }));

    // update to the current version to be a no-op
    const response = await support.client.send(
      new UpdateKeycloakVersionCommand({ addonId: addon.id, targetVersion: info.version }),
    );

    expect(response.id).to.equal(addon.realId);
    expect(response.version).to.be.a('string');
    expect(response.environment).to.be.an('array');
  });

  it('should create keycloak network group', async () => {
    const addon = await support.createTestAddon({
      name: 'test-keycloak-addon',
      providerId: 'keycloak',
      planId: 'plan_3819e4b3-cc6d-4847-9f02-0db93212956c',
    });
    const response = await support.client.send(new CreateKeycloakNetworkGroupCommand({ addonId: addon.id }));

    expect(response.id).to.equal(addon.realId);
    expect(response.features.networkGroup).to.not.be.null;
    expect(response.features.networkGroup.id).to.be.a('string');
  });

  it('should delete keycloak network group', async () => {
    const addon = await support.createTestAddon({
      name: 'test-keycloak-addon',
      providerId: 'keycloak',
      planId: 'plan_3819e4b3-cc6d-4847-9f02-0db93212956c',
    });
    // Create a network group first so we can delete it
    await support.client.send(new CreateKeycloakNetworkGroupCommand({ addonId: addon.id }));

    const response = await support.client.send(new DeleteKeycloakNetworkGroupCommand({ addonId: addon.id }));

    expect(response).to.be.null;
  });
});
