import { post } from '../../../../lib/request/request-params-builder.ts';
import { RedisHttpCommand } from '../../lib/redis-http-command.ts';
import type { CmdSendCommandInput, CmdSendCommandOutput } from './cmd-send-command.types.ts';

/**
 * Execute a command using the Redis© protocol
 *
 * @endpoint [POST] /command
 * @group Cmd
 */
export class CmdSendCommand extends RedisHttpCommand<CmdSendCommandInput, CmdSendCommandOutput> {
  toRequestParams(params: CmdSendCommandInput) {
    return post(`/command`, params);
  }

  // the command is the caller's, and a replayed `INCR` or `RPUSH` means it twice
  isIdempotent(): boolean {
    return false;
  }
}
