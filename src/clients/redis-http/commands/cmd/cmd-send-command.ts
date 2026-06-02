import { post } from '../../../../lib/request/request-params-builder.js';
import { RedisHttpCommand } from '../../lib/redis-http-command.js';
import type { CmdSendCommandInput, CmdSendCommandOutput } from './cmd-send-command.types.js';

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
}
