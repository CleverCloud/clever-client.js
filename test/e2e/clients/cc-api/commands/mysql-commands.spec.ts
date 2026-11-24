import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';
import { GetMysqlInfoCommand } from '../../../../../src/clients/cc-api/commands/mysql/get-mysql-info-command.ts';
import { e2eSupport } from '../e2e-support.ts';

describe('mysql commands', function () {
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

  it('should get mysql info', async () => {
    const addon = await support.createTestAddon({
      name: 'test-mysql-addon',
      providerId: 'mysql-addon',
      planId: 'plan_bf78ef5b-aedd-4024-973a-c2ff45541b88', //DEV plan
      zone: 'par',
    });

    const response = await support.client.send(new GetMysqlInfoCommand({ addonId: addon.id }));

    expect(response.id).toBeTypeOf('string');
    expect(response.addonId).toBe(addon.id);
    expect(response.ownerId).toBe(support.organisationId);
    expect(response.plan).toBe('dev');
    expect(response.zone).toBe('par');
    expect(response.version).toBeTypeOf('string');
    expect(response.status).toBe('ACTIVE');
    expect(response.createdAt).toBeTypeOf('string');
    expect(response.deletedAt).toBeUndefined();
    expect(response.host).toBeTypeOf('string');
    expect(response.port).toBeTypeOf('number');
    expect(response.database).toBeTypeOf('string');
    expect(response.user).toBeTypeOf('string');
    expect(response.password).toBeTypeOf('string');
    expect(response.features).toEqual([
      { name: 'direct-host-only', isEnabled: false },
      { name: 'encryption', isEnabled: false },
    ]);
    expect(response.readOnlyUsers).toEqual([]);
  });

  it('should get mysql info from the real id', async () => {
    const addon = await support.createTestAddon({
      name: 'test-mysql-addon',
      providerId: 'mysql-addon',
      planId: 'plan_bf78ef5b-aedd-4024-973a-c2ff45541b88', //DEV plan
      zone: 'par',
    });

    const response = await support.client.send(new GetMysqlInfoCommand({ addonId: addon.realId }));

    expect(response.addonId).toBe(addon.id);
  });
});
