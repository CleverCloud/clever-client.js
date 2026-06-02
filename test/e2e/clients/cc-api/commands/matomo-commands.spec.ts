import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';
import { GetMatomoInfoCommand } from '../../../../../src/clients/cc-api/commands/matomo/get-matomo-info-command.js';
import { RebootMatomoCommand } from '../../../../../src/clients/cc-api/commands/matomo/reboot-matomo-command.js';
import { RebuildMatomoCommand } from '../../../../../src/clients/cc-api/commands/matomo/rebuild-matomo-command.js';
import { e2eSupport } from '../e2e-support.js';

describe('matomo commands', function () {
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

  it('should get matomo info', async () => {
    const addon = await support.createTestAddon({
      name: 'test-matomo-addon',
      providerId: 'addon-matomo',
      planId: 'plan_87283ba6-617c-420d-8e37-3350a2fcdd66',
    });
    const response = await support.client.send(new GetMatomoInfoCommand({ addonId: addon.id }));

    expect(response.id).toBe(addon.realId);
    expect(response.addonId).toBe(addon.id);
    expect(response.name).toBe(addon.name);
    expect(response.ownerId).toBe(support.organisationId);
    expect(response.plan).toBeTypeOf('string');
    expect(response.version).toBeTypeOf('string');
    expect(response.phpVersion).toBeTypeOf('string');
    expect(response.accessUrl).toBeTypeOf('string');
    expect(response.availableVersions).toBeInstanceOf(Array);
    expect(response.resources.entrypoint).toBeTypeOf('string');
    expect(response.resources.mysqlId).toBeTypeOf('string');
    expect(response.resources.redisId).toBeTypeOf('string');
    expect(response.resources.kvId == null || typeof response.resources.kvId === 'string').toBe(true);
    expect(response.environment).toBeInstanceOf(Array);
  });

  it('should reboot matomo', async () => {
    const addon = await support.createTestAddon({
      name: 'test-matomo-addon',
      providerId: 'addon-matomo',
      planId: 'plan_87283ba6-617c-420d-8e37-3350a2fcdd66',
    });
    const response = await support.client.send(new RebootMatomoCommand({ addonId: addon.id }));

    expect(response).toBeNull();
  });

  it('should rebuild matomo', async () => {
    const addon = await support.createTestAddon({
      name: 'test-matomo-addon',
      providerId: 'addon-matomo',
      planId: 'plan_87283ba6-617c-420d-8e37-3350a2fcdd66',
    });
    const response = await support.client.send(new RebuildMatomoCommand({ addonId: addon.id }));

    expect(response).toBeNull();
  });
});
