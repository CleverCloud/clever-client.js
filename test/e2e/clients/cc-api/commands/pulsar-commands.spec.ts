import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';
import { GetPulsarInfoCommand } from '../../../../../src/clients/cc-api/commands/pulsar/get-pulsar-info-command.js';
import { e2eSupport } from '../e2e-support.js';

// cannot be automatised because addon deletion just after creation is not supported by the platform
describe.skip('pulsar commands', function () {
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

  it('should get pulsar info', async () => {
    const addon = await support.createTestAddon({
      ownerId: support.organisationId,
      name: 'test-pulsar',
      providerId: 'addon-pulsar',
      planId: 'plan_3ad3c5be-5c1e-4dae-bf9a-87120b88fc13',
      zone: 'par',
    });

    const response = await support.client.send(new GetPulsarInfoCommand({ addonId: addon.id }));

    expect(response.id).toBe(addon.realId);
    expect(response.tenant).toBeTypeOf('string');
    expect(response.namespace).toBeTypeOf('string');
    expect(response.cluster.id).toBeTypeOf('string');
    expect(response.cluster.url).toBeTypeOf('string');
    expect(response.cluster.pulsarPort).toBeTypeOf('number');
    expect(response.cluster.pulsarTlsPort).toBeTypeOf('number');
    expect(response.cluster.webPort).toBeTypeOf('number');
    expect(response.cluster.webTlsPort).toBeTypeOf('number');
    expect(response.cluster.version).toBeTypeOf('string');
    expect(response.cluster.available).toBeTypeOf('boolean');
    expect(response.cluster.zone).toBeTypeOf('string');
    expect(response.cluster.supportColdStorage).toBeTypeOf('boolean');
    expect(response.cluster.supportedPlans).toBeInstanceOf(Array);
    expect(response.token).toBeTypeOf('string');
    expect(response.creationDate).toBeTypeOf('string');
    expect(response.askForDeletionDate).toBeNull();
    expect(response.deletionDate).toBeNull();
    expect(response.status).toBeTypeOf('string');
    expect(response.plan).toBeTypeOf('string');
    expect(response.coldStorageLinked).toBeTypeOf('boolean');
    expect(response.coldStorageMustBeProvided).toBeTypeOf('boolean');
  });
});
