import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { CmdCliSendCommand } from '../../../../../src/clients/redis-http/commands/cmd/cmd-cli-send-command.js';
import { CmdSendCommand } from '../../../../../src/clients/redis-http/commands/cmd/cmd-send-command.js';
import { e2eSupport } from '../e2e-support.js';

describe('cmd commands', function () {
  const support = e2eSupport();

  beforeAll(async () => {
    await support.prepare();
  });

  afterAll(async () => {
    await support.cleanup();
  });

  it('should run command', async () => {
    const response = await support.client.send(new CmdSendCommand({ command: 'PING' }));

    expect(response.result).toBe('PONG');
  });

  it('should run cli command', async () => {
    const response = await support.client.send(new CmdCliSendCommand({ commandLine: 'PING' }));

    expect(response.success).toBe(true);
    expect(response.result).toBeInstanceOf(Array);
    expect(response.result[0]).toBe(`"PONG"`);
  });
});
