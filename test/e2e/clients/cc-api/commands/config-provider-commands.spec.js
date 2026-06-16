import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';
import { GetConfigProviderCommand } from '../../../../../src/clients/cc-api/commands/config-provider/get-config-provider-command.js';
import { UpdateConfigProviderCommand } from '../../../../../src/clients/cc-api/commands/config-provider/update-config-provider-command.js';
import { e2eSupport } from '../e2e-support.js';

describe('config-provider commands', function () {
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

  it('should get config provider empty', async () => {
    const addon = await support.createTestAddon();

    const response = await support.client.send(new GetConfigProviderCommand({ addonId: addon.id }));

    expect(response).toBeInstanceOf(Array);
    expect(response).toHaveLength(0);
  });

  it('should get config provider', async () => {
    const addon = await support.createTestAddon();
    await support.client.send(
      new UpdateConfigProviderCommand({
        addonId: addon.id,
        environment: [
          { name: 'var1', value: 'value1' },
          { name: 'var2', value: 'value2' },
        ],
      }),
    );

    const response = await support.client.send(new GetConfigProviderCommand({ addonId: addon.id }));

    expect(response).toBeInstanceOf(Array);
    expect(response).toHaveLength(2);
    expect(response).toEqualInAnyOrder([
      { name: 'var1', value: 'value1' },
      { name: 'var2', value: 'value2' },
    ]);
  });

  it('should update config provider', async () => {
    const addon = await support.createTestAddon();
    await support.client.send(
      new UpdateConfigProviderCommand({
        addonId: addon.id,
        environment: [
          { name: 'var1', value: 'value1' },
          { name: 'var2', value: 'value2' },
        ],
      }),
    );

    const response = await support.client.send(
      new UpdateConfigProviderCommand({
        addonId: addon.id,
        environment: [
          { name: 'var1', value: 'new value1' },
          { name: 'var3', value: 'value3' },
        ],
      }),
    );

    expect(response).toBeInstanceOf(Array);
    expect(response).toHaveLength(2);
    expect(response).toEqualInAnyOrder([
      { name: 'var1', value: 'new value1' },
      { name: 'var3', value: 'value3' },
    ]);
  });
});
