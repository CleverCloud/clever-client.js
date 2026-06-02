import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';
import { GetJenkinsInfoCommand } from '../../../../../src/clients/cc-api/commands/jenkins/get-jenkins-info-command.js';
import { checkDateFormat } from '../../../../lib/expect-utils.js';
import { e2eSupport } from '../e2e-support.js';

// cannot be automatised because addon deletion just after creation is not supported by the platform
// todo: find a way to wait for addon to be ready for deletion
describe.skip('jenkins commands', function () {
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

  it('should get jenkins info', async () => {
    const addon = await support.createTestAddon({
      ownerId: support.organisationId,
      name: 'test-jenkins',
      zone: 'par',
      providerId: 'jenkins',
      planId: 'plan_9436de3e-b4e6-48e7-8f5c-0bec0dc8b592',
      options: {
        version: 'LTS',
        encryption: 'false',
      },
    });

    const response = await support.client.send(new GetJenkinsInfoCommand({ addonId: addon.id }));

    expect(response.id).toBeTypeOf('string');
    expect(response.addonId).toBe(addon.id);
    expect(response.plan).toBe('XS');
    expect(response.zone).toBe('par');
    checkDateFormat(response.creationDate);
    checkDateFormat(response.deletionDate);
    expect(response.status).toBe('ACTIVE');
    expect(response.host).toBeTypeOf('string');
    expect(response.user).toBeTypeOf('string');
    expect(response.password).toBeTypeOf('string');
    expect(response.version).toBeTypeOf('string');
    expect(response.features).toEqualInAnyOrder([{ name: 'encryption', enabled: false }]);
    expect(response.updates.manageLink).toBeTypeOf('string');
    expect(response.updates.versions.current).toBeTypeOf('string');
    expect(response.updates.versions.available).toBeTypeOf('string');
  });
});
