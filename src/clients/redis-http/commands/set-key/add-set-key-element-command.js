/**
 * @import { AddSetKeyElementCommandInput, AddSetKeyElementCommandOutput } from './add-set-key-element-command.types.js';
 */
import { post } from '../../../../lib/request/request-params-builder.js';
import { RedisHttpCommand } from '../../lib/redis-http-command.js';

/**
 * Add a member to a `set` key
 *
 * @extends {RedisHttpCommand<AddSetKeyElementCommandInput, AddSetKeyElementCommandOutput>}
 * @endpoint [POST] /key/set/_set
 * @group SetKey
 */
export class AddSetKeyElementCommand extends RedisHttpCommand {
  /** @type {RedisHttpCommand<AddSetKeyElementCommandInput, AddSetKeyElementCommandOutput>['toRequestParams']} */
  toRequestParams(params) {
    return post(`/key/set/_set`, params);
  }
}
