/**
 * @import { DeleteSetKeyElementCommandInput, DeleteSetKeyElementCommandOutput } from './delete-set-key-element-command.types.js';
 */
import { post } from '../../../../lib/request/request-params-builder.js';
import { RedisHttpCommand } from '../../lib/redis-http-command.js';

/**
 * Deletes a member from a `set` key
 *
 * @extends {RedisHttpCommand<DeleteSetKeyElementCommandInput, DeleteSetKeyElementCommandOutput>}
 * @endpoint [POST] /key/set/_delete
 * @group SetKey
 */
export class DeleteSetKeyElementCommand extends RedisHttpCommand {
  /** @type {RedisHttpCommand<DeleteSetKeyElementCommandInput, DeleteSetKeyElementCommandOutput>['toRequestParams']} */
  toRequestParams(params) {
    return post(`/key/set/_delete`, params);
  }
}
