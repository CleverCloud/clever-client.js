import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';
import { DeleteAddonCommand } from '../../../../../src/clients/cc-api/commands/addon/delete-addon-command.js';
import { GetAddonCommand } from '../../../../../src/clients/cc-api/commands/addon/get-addon-command.js';
import { GetAddonSsoCommand } from '../../../../../src/clients/cc-api/commands/addon/get-addon-sso-command.js';
import { checkDateFormat } from '../../../../lib/expect-utils.js';
import { e2eSupport } from '../e2e-support.js';

describe('addon commands', function () {
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

  it('should create addon', async () => {
    const response = await support.createTestAddon();

    checkDateFormat(response.creationDate);
    expect(response.id).toMatch(/addon_.+/);
    expect(response.realId).toMatch(/config_.+/);
    expect(response.name).toBe('test-addon');
    expect(response.zone).toBe('par');
    expect(response.plan.id).toMatch(/plan_.+/);
    expect(response.provider.id).toBe('config-provider');
  });

  it('should delete addon', async () => {
    const addon = await support.createTestAddon();

    const response = await support.client.send(new DeleteAddonCommand({ addonId: addon.id }));
    expect(response).toBeNull();
  });

  it('should get addon null', async () => {
    const response = await support.client.send(
      new GetAddonCommand({ ownerId: support.organisationId, addonId: 'addon_00000000-0000-0000-0000-000000000000' }),
    );
    expect(response).toBeNull();
  });

  it('should get addon', async () => {
    const addon = await support.createTestAddon();

    const response = await support.client.send(
      new GetAddonCommand({ ownerId: support.organisationId, addonId: addon.id }),
    );
    expect(response).toEqualInAnyOrder(addon);
  });

  it('should get addon sso null', async () => {
    const response = await support.client.send(
      new GetAddonSsoCommand({
        ownerId: support.organisationId,
        addonId: 'addon_00000000-0000-0000-0000-000000000000',
      }),
    );

    expect(response).toBeNull();
  });

  it('should get addon sso', async () => {
    const addon = await support.createTestAddon();

    const response = await support.client.send(
      new GetAddonSsoCommand({ ownerId: support.organisationId, addonId: addon.id }),
    );

    expect(response.url).toBeTypeOf('string');
    expect(response.id).toBe(addon.realId);
    expect(response.timestamp).toBeTypeOf('number');
    expect(response.token).toBeTypeOf('string');
    expect(response.signature).toBeTypeOf('string');
    expect(response.email).toBeTypeOf('string');
    expect(response.userId).toBe(support.organisationId);
  });
});
