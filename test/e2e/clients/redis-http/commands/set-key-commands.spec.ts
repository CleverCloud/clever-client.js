import { afterEach, beforeAll, describe, expect, it } from 'vitest';
import { AddSetKeyElementCommand } from '../../../../../src/clients/redis-http/commands/set-key/add-set-key-element-command.js';
import { CreateSetKeyCommand } from '../../../../../src/clients/redis-http/commands/set-key/create-set-key-command.js';
import { DeleteSetKeyElementCommand } from '../../../../../src/clients/redis-http/commands/set-key/delete-set-key-element-command.js';
import { ScanSetKeyCommand } from '../../../../../src/clients/redis-http/commands/set-key/scan-set-key-command.js';
import { e2eSupport } from '../e2e-support.js';

describe('set-key commands', function () {
  const support = e2eSupport();

  beforeAll(async () => {
    await support.prepare();
  });

  afterEach(async () => {
    await support.cleanup();
  });

  it('should add set key element', async () => {
    const key = { key: 'test', elements: ['v1'] };
    await support.client.send(new CreateSetKeyCommand(key));

    const response = await support.client.send(new AddSetKeyElementCommand({ key: 'test', element: 'v2' }));

    expect(response).toEqual({ key: 'test', element: 'v2', added: true });
  });

  it('should create set key', async () => {
    const key = { key: 'test', elements: ['v1'] };
    const response = await support.client.send(new CreateSetKeyCommand(key));

    expect(response).toEqual(key);
  });

  it('should delete set key element', async () => {
    const key = { key: 'test', elements: ['v1', 'v2', 'v3'] };
    await support.client.send(new CreateSetKeyCommand(key));

    const response = await support.client.send(new DeleteSetKeyElementCommand({ key: 'test', element: 'v2' }));

    expect(response).toEqual({ key: 'test', element: 'v2', deleted: true });
  });

  it('should scan set key', async () => {
    const key = { key: 'test', elements: ['v1', 'v2'] };
    await support.client.send(new CreateSetKeyCommand(key));

    const response = await support.client.send(new ScanSetKeyCommand({ key: 'test' }));

    expect(response.key).toBe('test');
    expect(response.cursor).toBeTypeOf('number');
    expect(response.elements).toEqualInAnyOrder(['v1', 'v2']);
  });
});
