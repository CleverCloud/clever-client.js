import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';
import { GetPostgresqlInfoCommand } from '../../../../../src/clients/cc-api/commands/postgresql/get-postgresql-info-command.ts';
import { e2eSupport } from '../e2e-support.ts';

describe('postgresql commands', function () {
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

  it('should get postgresql info', async () => {
    const addon = await support.createTestAddon({
      name: 'test-postgresql-addon',
      providerId: 'postgresql-addon',
      planId: 'plan_c32d00fb-6c06-48a9-a0a3-9d808937ec68',
      zone: 'par',
    });

    const response = await support.client.send(new GetPostgresqlInfoCommand({ addonId: addon.id }));

    expect(response.id).toBeTypeOf('string');
    expect(response.addonId).toBe(addon.id);
    expect(response.ownerId).toBe(support.organisationId);
    expect(response.plan).toBeTypeOf('string');
    expect(response.zone).toBe('par');
    expect(response.version).toBeTypeOf('string');
    expect(response.status).toBe('ACTIVE');
    expect(response.createdAt).toBe(new Date(response.createdAt).toISOString());
    expect(response.deletedAt).toBeUndefined();
    expect(response.host).toBeTypeOf('string');
    expect(response.port).toBeTypeOf('number');
    expect(response.database).toBeTypeOf('string');
    expect(response.user).toBeTypeOf('string');
    expect(response.password).toBeTypeOf('string');
    expect(response.features.map((feature) => feature.name)).toEqual(['direct-host-only', 'do-backup', 'encryption']);
    expect(response.readOnlyUsers).toEqual([]);
  });

  it('should get postgresql info from the real id', async () => {
    const addon = await support.createTestAddon({
      name: 'test-postgresql-addon',
      providerId: 'postgresql-addon',
      planId: 'plan_c32d00fb-6c06-48a9-a0a3-9d808937ec68',
      zone: 'par',
    });

    const response = await support.client.send(new GetPostgresqlInfoCommand({ addonId: addon.realId }));

    expect(response.addonId).toBe(addon.id);
  });
});
