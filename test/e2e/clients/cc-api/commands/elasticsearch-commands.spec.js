import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';
import { GetElasticsearchInfoCommand } from '../../../../../src/clients/cc-api/commands/elasticsearch/get-elasticsearch-info-command.js';
import { e2eSupport } from '../e2e-support.js';

// cannot be automatised because addon deletion just after creation is not supported by the platform
// todo: find a way to wait for addon to be ready for deletion
describe.skip('elasticsearch commands', function () {
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

  it('should get elasticsearch info', async () => {
    const addon = await support.createTestAddon({
      ownerId: support.organisationId,
      name: 'test-es-addon',
      providerId: 'es-addon',
      planId: 'plan_0e0bc5ea-ba21-41e8-865b-1ed48e0163ca',
      zone: 'par',
      options: {
        version: '8',
        encryption: 'false',
        services: '[{"name":"kibana","enabled":false},{"name":"apm","enabled":false}]',
      },
    });

    const response = await support.client.send(new GetElasticsearchInfoCommand({ addonId: addon.id }));

    expect(response.id).toBeTypeOf('string');
    expect(response.ownerId).toBe(support.organisationId);
    expect(response.addonId).toBe(addon.id);
    expect(response.plan).toBe('XS');
    expect(response.zone).toBe('par');
    expect(response.config.host).toBeTypeOf('string');
    expect(response.config.user).toBeTypeOf('string');
    expect(response.config.password).toBeTypeOf('string');
    expect(response.config.apmUser).toBeTypeOf('string');
    expect(response.config.apmPassword).toBeTypeOf('string');
    expect(response.config.apmAuthToken).toBeTypeOf('string');
    expect(response.config.kibanaUser).toBeTypeOf('string');
    expect(response.version).toBe('8');
    expect(response.backups.kibanaSnapshotsUrl).toBeTypeOf('string');
    expect(response.kibanaApplication).toBeUndefined();
    expect(response.apmApplication).toBeUndefined();
    expect(response.services).toEqualInAnyOrder([
      { name: 'kibana', enabled: false },
      { name: 'apm', enabled: false },
    ]);
    expect(response.features).toEqualInAnyOrder([
      { name: 'kibana', enabled: false },
      { name: 'apm', enabled: false },
      { name: 'encryption', enabled: false },
    ]);
  });
});
