import { post } from '../../../../lib/request/request-params-builder.ts';
import { RedisHttpCommand } from '../../lib/redis-http-command.ts';
import type { CmdCliSendCommandInput, CmdCliSendCommandOutput } from './cmd-cli-send-command.types.ts';

/**
 * Execute a command like in the Redis© CLI
 *
 * @endpoint [POST] /command/cli
 * @group Cmd
 */
export class CmdCliSendCommand extends RedisHttpCommand<CmdCliSendCommandInput, CmdCliSendCommandOutput> {
  toRequestParams(params: CmdCliSendCommandInput) {
    return post(`/command/cli`, params);
  }

  // the command line is the caller's, and a replayed `INCR` or `RPUSH` means it twice
  isIdempotent(): boolean {
    return false;
  }
}
