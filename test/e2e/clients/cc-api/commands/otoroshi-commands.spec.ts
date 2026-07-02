import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';
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

  beforeAll(async () => {
    await support.prepare();
  });

  afterEach(async () => {
    await support.deleteAddons();
  });

  afterAll(async () => {
    await support.cleanup();
  });

  it('should get otoroshi info', async () => {
    const addon = await support.createTestAddon({
      name: 'test-otoroshi-addon',
      providerId: 'otoroshi',
      planId: 'plan_d738ee0f-8720-499a-8067-2fca53a2665a',
    });
    const response = await support.client.send(new GetOtoroshiInfoCommand({ addonId: addon.id }));

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
    expect(response.resources.redisId).toBeTypeOf('string');
    expect(response.api.url).toBeTypeOf('string');
    expect(response.api.user).toBeTypeOf('string');
    expect(response.api.secret).toBeTypeOf('string');
    expect(response.api.openapi).toBeTypeOf('string');
    expect(response.initialCredentials.user).toBeTypeOf('string');
    expect(response.initialCredentials.password).toBeTypeOf('string');
    expect(response.features).toBeTypeOf('object');
  });

  it('should reboot otoroshi', async () => {
    const addon = await support.createTestAddon({
      name: 'test-otoroshi-addon',
      providerId: 'otoroshi',
      planId: 'plan_d738ee0f-8720-499a-8067-2fca53a2665a',
    });
    const response = await support.client.send(new RebootOtoroshiCommand({ addonId: addon.id }));

    expect(response).toBeNull();
  });

  it('should rebuild otoroshi', async () => {
    const addon = await support.createTestAddon({
      name: 'test-otoroshi-addon',
      providerId: 'otoroshi',
      planId: 'plan_d738ee0f-8720-499a-8067-2fca53a2665a',
    });
    const response = await support.client.send(new RebuildOtoroshiCommand({ addonId: addon.id }));

    expect(response).toBeNull();
  });

  it('should check otoroshi version', async () => {
    const addon = await support.createTestAddon({
      name: 'test-otoroshi-addon',
      providerId: 'otoroshi',
      planId: 'plan_d738ee0f-8720-499a-8067-2fca53a2665a',
    });
    const response = await support.client.send(new CheckOtoroshiVersionCommand({ addonId: addon.id }));

    expect(response.installed).toBeTypeOf('string');
    expect(response.latest).toBeTypeOf('string');
    expect(response.available).toContain(response.latest);
    expect(response.needUpdate).toBeTypeOf('boolean');
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

    expect(response.id).toBe(addon.realId);
    expect(response.version).toBeTypeOf('string');
  });

  it('should create otoroshi network group', async () => {
    const addon = await support.createTestAddon({
      name: 'test-otoroshi-addon',
      providerId: 'otoroshi',
      planId: 'plan_d738ee0f-8720-499a-8067-2fca53a2665a',
    });
    const response = await support.client.send(new CreateOtoroshiNetworkGroupCommand({ addonId: addon.id }));

    expect(response.id).toBe(addon.realId);
    expect(response.features.networkGroup).not.toBeNull();
    expect(response.features.networkGroup!.id).toBeTypeOf('string');
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

    expect(response).toBeNull();
  });

  it('should get otoroshi config', async () => {
    const addon = await support.createTestAddon({
      name: 'test-otoroshi-addon',
      providerId: 'otoroshi',
      planId: 'plan_d738ee0f-8720-499a-8067-2fca53a2665a',
    });
    const response = await support.client.send(new GetOtoroshiConfigCommand({ addonId: addon.id }));

    expect(response).toBeTypeOf('string');
    expect(response.length).toBeGreaterThan(0);
  });
});
