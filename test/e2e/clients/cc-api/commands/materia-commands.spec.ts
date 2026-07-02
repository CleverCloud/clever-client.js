import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';
import { GetMateriaInfoCommand } from '../../../../../src/clients/cc-api/commands/materia/get-materia-info-command.js';
import { e2eSupport } from '../e2e-support.js';

// cannot be automatised because addon deletion just after creation is not supported by the platform
// todo: find a way to wait for addon to be ready for deletion
describe.skip('materia commands', function () {
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

  it('should get materia info', async () => {
    const addon = await support.createTestAddon({
      name: 'test-kv-addon',
      providerId: 'kv',
      planId: 'plan_53a1728d-4b9e-4254-94c4-b19163af587b',
    });

    const response = await support.client.send(new GetMateriaInfoCommand({ addonId: addon.id }));

    expect(response.id).toBe(addon.realId);
    expect(response.clusterId).toBeTypeOf('string');
    expect(response.ownerId).toBe(support.organisationId);
    expect(response.kind).toBe('KV');
    expect(response.plan).toBeTypeOf('string');
    expect(response.host).toBeTypeOf('string');
    expect(response.port).toBeTypeOf('number');
    expect(response.token).toBeTypeOf('string');
    expect(response.tokenId).toBeTypeOf('string');
    expect(response.status).toBeTypeOf('string');
  });
});
