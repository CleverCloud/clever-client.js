import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';
import { CheckMetabaseVersionCommand } from '../../../../../src/clients/cc-api/commands/metabase/check-metabase-version-command.js';
import { GetMetabaseInfoCommand } from '../../../../../src/clients/cc-api/commands/metabase/get-metabase-info-command.js';
import { RebootMetabaseCommand } from '../../../../../src/clients/cc-api/commands/metabase/reboot-metabase-command.js';
import { RebuildMetabaseCommand } from '../../../../../src/clients/cc-api/commands/metabase/rebuild-metabase-command.js';
import { UpdateMetabaseVersionCommand } from '../../../../../src/clients/cc-api/commands/metabase/update-metabase-version-command.js';
import { e2eSupport } from '../e2e-support.js';

describe('metabase commands', function () {
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

  it('should get metabase info', async () => {
    const addon = await support.createTestAddon({
      name: 'test-metabase-addon',
      providerId: 'metabase',
      planId: 'plan_2925d534-7155-4521-8052-d068d7ce8915',
    });
    const response = await support.client.send(new GetMetabaseInfoCommand({ addonId: addon.id }));

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
    expect(response.resources.pgsqlId).toBeTypeOf('string');
    expect(response.environment).toBeInstanceOf(Array);
  });

  it('should reboot metabase', async () => {
    const addon = await support.createTestAddon({
      name: 'test-metabase-addon',
      providerId: 'metabase',
      planId: 'plan_2925d534-7155-4521-8052-d068d7ce8915',
    });
    const response = await support.client.send(new RebootMetabaseCommand({ addonId: addon.id }));

    expect(response).toBeNull();
  });

  it('should rebuild metabase', async () => {
    const addon = await support.createTestAddon({
      name: 'test-metabase-addon',
      providerId: 'metabase',
      planId: 'plan_2925d534-7155-4521-8052-d068d7ce8915',
    });
    const response = await support.client.send(new RebuildMetabaseCommand({ addonId: addon.id }));

    expect(response).toBeNull();
  });

  it('should check metabase version', async () => {
    const addon = await support.createTestAddon({
      name: 'test-metabase-addon',
      providerId: 'metabase',
      planId: 'plan_2925d534-7155-4521-8052-d068d7ce8915',
    });
    const response = await support.client.send(new CheckMetabaseVersionCommand({ addonId: addon.id }));

    expect(response.installed).toBeTypeOf('string');
    expect(response.latest).toBeTypeOf('string');
    expect(response.available).toContain(response.latest);
    expect(response.needUpdate).toBeTypeOf('boolean');
  });

  it('should update metabase version', async () => {
    const addon = await support.createTestAddon({
      name: 'test-metabase-addon',
      providerId: 'metabase',
      planId: 'plan_2925d534-7155-4521-8052-d068d7ce8915',
    });
    const info = await support.client.send(new GetMetabaseInfoCommand({ addonId: addon.id }));

    const response = await support.client.send(
      new UpdateMetabaseVersionCommand({ addonId: addon.id, targetVersion: info.version }),
    );

    expect(response.id).toBe(addon.realId);
    expect(response.version).toBeTypeOf('string');
    expect(response.environment).toBeInstanceOf(Array);
  });
});
