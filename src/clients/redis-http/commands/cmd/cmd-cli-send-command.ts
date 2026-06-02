import { post } from '../../../../lib/request/request-params-builder.js';
import { RedisHttpCommand } from '../../lib/redis-http-command.js';
import type { CmdCliSendCommandInput, CmdCliSendCommandOutput } from './cmd-cli-send-command.types.js';

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
}
