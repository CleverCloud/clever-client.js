import { describe, expect, it } from 'vitest';
import { CmdSendCommand } from '../../../../../src/clients/redis-http/commands/cmd/cmd-send-command.ts';
import {
  isRedisHttpCommand,
  type RedisHttpCommand,
} from '../../../../../src/clients/redis-http/lib/redis-http-command.ts';
import { RedisHttpParamsTransformer } from '../../../../../src/clients/redis-http/lib/redis-http-params-transformer.ts';
import { brandAsForeignCopy } from '../../../../lib/foreign-copy.ts';

const BACKEND_URL = 'redis://my-redis-db:6379';

// what a Redis HTTP command looks like when its classes come from another copy of the client
class ForeignRedisHttpCommand {
  static {
    brandAsForeignCopy(this.prototype, 'RedisHttpCommand');
  }

  readonly params = { command: 'GET', args: ['my-key'] };

  get api() {
    return 'redis-http';
  }

  requiresBackendUrl() {
    return true;
  }
}

function transformCommandParams(command: RedisHttpCommand<unknown, unknown>): Promise<unknown> {
  return new RedisHttpParamsTransformer(BACKEND_URL).transformParams(command, undefined);
}

describe('RedisHttpParamsTransformer', () => {
  it('should inject the backend URL of the client into a command requiring one', async () => {
    const command = new CmdSendCommand({ command: 'GET', args: ['my-key'] });

    expect(await transformCommandParams(command)).toEqual({
      command: 'GET',
      args: ['my-key'],
      backendUrl: BACKEND_URL,
    });
  });

  it('should inject the backend URL of the client into a command created by another copy of the client', async () => {
    const command = new ForeignRedisHttpCommand() as unknown as RedisHttpCommand<unknown, unknown>;

    expect(await transformCommandParams(command)).toEqual({
      command: 'GET',
      args: ['my-key'],
      backendUrl: BACKEND_URL,
    });
  });
});

describe('isRedisHttpCommand', () => {
  it('should match a command, and one created by another copy of the client', () => {
    expect(isRedisHttpCommand(new CmdSendCommand({ command: 'GET', args: ['my-key'] }))).toBe(true);
    expect(isRedisHttpCommand(new ForeignRedisHttpCommand())).toBe(true);
  });

  it('should not match an object merely shaped like a command', () => {
    expect(isRedisHttpCommand({ api: 'redis-http', requiresBackendUrl: () => true })).toBe(false);
  });
});
