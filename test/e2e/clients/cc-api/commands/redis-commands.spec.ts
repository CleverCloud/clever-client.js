import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';
import { GetRedisInfoCommand } from '../../../../../src/clients/cc-api/commands/redis/get-redis-info-command.ts';
import { e2eSupport } from '../e2e-support.ts';

describe('redis commands', function () {
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

  it('should get redis info', async () => {
    const addon = await support.createTestAddon({
      name: 'test-redis-addon',
      providerId: 'redis-addon',
      planId: 'plan_c62dd71e-15c3-483e-879d-75e4c836e21e',
      zone: 'par',
    });

    const response = await support.client.send(new GetRedisInfoCommand({ addonId: addon.id }));

    expect(response.id).toBeTypeOf('string');
    expect(response.addonId).toBe(addon.id);
    expect(response.ownerId).toBe(support.organisationId);
    expect(response.plan).toBe('S_MONO');
    expect(response.zone).toBe('par');
    expect(response.version).toBeTypeOf('string');
    expect(response.status).toBe('ACTIVE');
    expect(response.role).toBe('master');
    expect(response.createdAt).toBe(new Date(response.createdAt).toISOString());
    expect(response.deletedAt).toBeUndefined();
    expect(response.port).toBeTypeOf('number');
    expect(response.features).toEqual([{ name: 'encryption', isEnabled: false }]);
  });

  it('should get redis info from the real id', async () => {
    const addon = await support.createTestAddon({
      name: 'test-redis-addon',
      providerId: 'redis-addon',
      planId: 'plan_c62dd71e-15c3-483e-879d-75e4c836e21e',
      zone: 'par',
    });

    const response = await support.client.send(new GetRedisInfoCommand({ addonId: addon.realId }));

    expect(response.addonId).toBe(addon.id);
  });
});
