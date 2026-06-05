import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';
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

  beforeAll(async () => {
    await support.prepare();
  });

  afterEach(async () => {
    await support.deleteAddons();
  });

  afterAll(async () => {
    await support.cleanup();
  });

  it('should get keycloak info', async () => {
    const addon = await support.createTestAddon({
      name: 'test-keycloak-addon',
      providerId: 'keycloak',
      planId: 'plan_3819e4b3-cc6d-4847-9f02-0db93212956c',
    });
    const response = await support.client.send(new GetKeycloakInfoCommand({ addonId: addon.id }));

    expect(response.id).toBe(addon.realId);
    expect(response.addonId).toBe(addon.id);
    expect(response.name).toBe(addon.name);
    expect(response.ownerId).toBe(support.organisationId);
    expect(response.plan).toBeTypeOf('string');
    expect(response.version).toBeTypeOf('string');
    expect(response.javaVersion).toBeTypeOf('string');
    expect(response.accessUrl).toBeTypeOf('string');
    expect(response.availableVersions).toBeInstanceOf(Array);
    expect(response.resources.entrypoint).toBeTypeOf('string');
    expect(response.resources.fsbucketId).toBeTypeOf('string');
    expect(response.resources.pgsqlId).toBeTypeOf('string');
    expect(response.features).not.toBeNull();
    expect(response.initialCredentials.user).toBeTypeOf('string');
    expect(response.initialCredentials.password).toBeTypeOf('string');
    expect(response.environment).toBeInstanceOf(Array);
  });

  it('should reboot keycloak', async () => {
    const addon = await support.createTestAddon({
      name: 'test-keycloak-addon',
      providerId: 'keycloak',
      planId: 'plan_3819e4b3-cc6d-4847-9f02-0db93212956c',
    });
    const response = await support.client.send(new RebootKeycloakCommand({ addonId: addon.id }));

    expect(response).toBeNull();
  });

  it('should rebuild keycloak', async () => {
    const addon = await support.createTestAddon({
      name: 'test-keycloak-addon',
      providerId: 'keycloak',
      planId: 'plan_3819e4b3-cc6d-4847-9f02-0db93212956c',
    });
    const response = await support.client.send(new RebuildKeycloakCommand({ addonId: addon.id }));

    expect(response).toBeNull();
  });

  it('should check keycloak version', async () => {
    const addon = await support.createTestAddon({
      name: 'test-keycloak-addon',
      providerId: 'keycloak',
      planId: 'plan_3819e4b3-cc6d-4847-9f02-0db93212956c',
    });
    const response = await support.client.send(new CheckKeycloakVersionCommand({ addonId: addon.id }));

    expect(response.installed).toBeTypeOf('string');
    expect(response.latest).toBeTypeOf('string');
    expect(response.available).toContain(response.latest);
    expect(response.needUpdate).toBeTypeOf('boolean');
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

    expect(response.id).toBe(addon.realId);
    expect(response.version).toBeTypeOf('string');
    expect(response.environment).toBeInstanceOf(Array);
  });

  it('should create keycloak network group', async () => {
    const addon = await support.createTestAddon({
      name: 'test-keycloak-addon',
      providerId: 'keycloak',
      planId: 'plan_3819e4b3-cc6d-4847-9f02-0db93212956c',
    });
    const response = await support.client.send(new CreateKeycloakNetworkGroupCommand({ addonId: addon.id }));

    expect(response.id).toBe(addon.realId);
    expect(response.features.networkGroup).not.toBeNull();
    expect(response.features.networkGroup!.id).toBeTypeOf('string');
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

    expect(response).toBeNull();
  });
});
