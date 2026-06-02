import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';
import { CancelMigrationCommand } from '../../../../../src/clients/cc-api/commands/migration/cancel-migration-command.js';
import { GetMigrationCommand } from '../../../../../src/clients/cc-api/commands/migration/get-migration-command.js';
import { ListMigrationCommand } from '../../../../../src/clients/cc-api/commands/migration/list-migration-command.js';
import { ListMigrationPreorderCommand } from '../../../../../src/clients/cc-api/commands/migration/list-migration-preorder-command.js';
import { StartMigrationCommand } from '../../../../../src/clients/cc-api/commands/migration/start-migration-command.js';
import { e2eSupport } from '../e2e-support.js';

// cannot be automatised because addon deletion just after creation is not supported by the platform
describe.skip('migration commands', function () {
  const support = e2eSupport();

  beforeAll(async () => {
    await support.prepare();
  });

  afterAll(async () => {
    await support.cleanup();
  });

  afterEach(async () => {
    await support.deleteAddons();
  });

  it('should get migration', async () => {
    const addon = await support.createTestAddon({
      providerId: 'mysql-addon',
      planId: 'plan_bf78ef5b-aedd-4024-973a-c2ff45541b88', //DEV plan
    });
    const createdMigration = await support.client.send(
      new StartMigrationCommand({
        addonId: addon.id,
        planId: 'plan_7ab494e2-c319-4330-8170-35d78738c1ee',
        zone: 'par',
        version: '8.4',
      }),
    );

    const response = await support.client.send(
      new GetMigrationCommand({
        addonId: addon.id,
        migrationId: createdMigration.id,
      }),
    );

    expect(response.id).toBe(createdMigration.id);
  });

  it('should get migration null', async () => {
    const response = await support.client.send(
      new GetMigrationCommand({
        addonId: 'addon_00000000-0000-0000-0000-000000000000',
        migrationId: 'migration_00000000-0000-0000-0000-000000000000',
      }),
    );

    expect(response).toBeNull();
  });

  it('should list migrations', async () => {
    const addon = await support.createTestAddon({
      providerId: 'mysql-addon',
      planId: 'plan_bf78ef5b-aedd-4024-973a-c2ff45541b88', //DEV plan
    });
    const createdMigration = await support.client.send(
      new StartMigrationCommand({
        addonId: addon.id,
        planId: 'plan_7ab494e2-c319-4330-8170-35d78738c1ee',
        zone: 'par',
        version: '8.4',
      }),
    );

    const response = await support.client.send(
      new ListMigrationCommand({
        addonId: addon.id,
      }),
    );

    expect(response).toHaveLength(1);
    expect(response[0]).toEqualInAnyOrder(createdMigration);
  });

  it('should list migrations empty', async () => {
    const addon = await support.createTestAddon({
      providerId: 'mysql-addon',
      planId: 'plan_bf78ef5b-aedd-4024-973a-c2ff45541b88', //DEV plan
    });

    const response = await support.client.send(
      new ListMigrationCommand({
        addonId: addon.id,
      }),
    );

    expect(response).toHaveLength(0);
  });

  it('should list migration preorders', async () => {
    const addon = await support.createTestAddon({
      providerId: 'mysql-addon',
      planId: 'plan_bf78ef5b-aedd-4024-973a-c2ff45541b88', //DEV plan
    });

    const response = await support.client.send(
      new ListMigrationPreorderCommand({
        addonId: addon.id,
        planId: 'plan_7ab494e2-c319-4330-8170-35d78738c1ee',
      }),
    );

    expect(response.ownerId).toBe(support.organisationId);
  });

  it('should start migration', async () => {
    const addon = await support.createTestAddon({
      providerId: 'mysql-addon',
      planId: 'plan_bf78ef5b-aedd-4024-973a-c2ff45541b88', //DEV plan
    });

    const result = await support.client.send(
      new StartMigrationCommand({
        addonId: addon.id,
        planId: 'plan_7ab494e2-c319-4330-8170-35d78738c1ee',
        zone: 'par',
        version: '8.4',
      }),
    );

    expect(result.id).toMatch(/migration_.+/);
    expect(result.status).toBe('RUNNING');
  });

  it('should cancel migration', async () => {
    const addon = await support.createTestAddon({
      providerId: 'mysql-addon',
      planId: 'plan_bf78ef5b-aedd-4024-973a-c2ff45541b88', //DEV plan
    });
    const migration = await support.client.send(
      new StartMigrationCommand({
        addonId: addon.id,
        planId: 'plan_7ab494e2-c319-4330-8170-35d78738c1ee',
        zone: 'par',
        version: '8.4',
      }),
    );

    const result = await support.client.send(
      new CancelMigrationCommand({
        addonId: addon.id,
        migrationId: migration.id,
      }),
    );

    expect(result).toBeNull();
  });
});
