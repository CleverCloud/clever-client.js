/**
 * @import { CmdCliSendCommandInput, CmdCliSendCommandOutput } from './cmd-cli-send-command.types.js';
 */
import { post } from '../../../../lib/request/request-params-builder.js';
import { RedisHttpCommand } from '../../lib/redis-http-command.js';

/**
 * Execute a command like in the Redis© CLI
 *
 * @extends {RedisHttpCommand<CmdCliSendCommandInput, CmdCliSendCommandOutput>}
 * @endpoint [POST] /command/cli
 * @group Cmd
 */
export class CmdCliSendCommand extends RedisHttpCommand {
  /** @type {RedisHttpCommand<CmdCliSendCommandInput, CmdCliSendCommandOutput>['toRequestParams']} */
  toRequestParams(params) {
    return post(`/command/cli`, params);
  }
}
