/**
 * @import { SetSetKeyElementCommandInput, SetSetKeyElementCommandOutput } from './set-set-key-element-command.types.js';
 */
import { post } from '../../../../lib/request/request-params-builder.js';
import { RedisHttpCommand } from '../../lib/redis-http-command.js';

/**
 *
 * @extends {RedisHttpCommand<SetSetKeyElementCommandInput, SetSetKeyElementCommandOutput>}
 * @endpoint [POST] /key/set/_set
 * @group SetKey
 */
export class SetSetKeyElementCommand extends RedisHttpCommand {
  /** @type {RedisHttpCommand<SetSetKeyElementCommandInput, SetSetKeyElementCommandOutput>['toRequestParams']} */
  toRequestParams(params) {
    return post(`/key/set/_set`, {});
  }
}
