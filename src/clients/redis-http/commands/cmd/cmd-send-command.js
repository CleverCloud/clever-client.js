/**
 * @import { CmdSendCommandInput, CmdSendCommandOutput } from './cmd-send-command.types.js';
 */
import { post } from '../../../../lib/request/request-params-builder.js';
import { RedisHttpCommand } from '../../lib/redis-http-command.js';

/**
 * Execute a command using the Redis© protocol
 * @extends {RedisHttpCommand<CmdSendCommandInput, CmdSendCommandOutput>}
 * @endpoint [POST] /command
 * @group Cmd
 */
export class CmdSendCommand extends RedisHttpCommand {
  /** @type {RedisHttpCommand<CmdSendCommandInput, CmdSendCommandOutput>['toRequestParams']} */
  toRequestParams(params) {
    return post(`/command`, params);
  }
}
