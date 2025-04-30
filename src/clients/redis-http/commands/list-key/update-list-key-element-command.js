/**
 * @import { UpdateListKeyElementCommandInput, UpdateListKeyElementCommandOutput } from './update-list-key-element-command.types.js';
 */
import { post } from '../../../../lib/request/request-params-builder.js';
import { RedisHttpCommand } from '../../lib/redis-http-command.js';

/**
 * Update an element of a `list` key
 *
 * @extends {RedisHttpCommand<UpdateListKeyElementCommandInput, UpdateListKeyElementCommandOutput>}
 * @endpoint [POST] /key/list/_update
 * @group ListKey
 */
export class UpdateListKeyElementCommand extends RedisHttpCommand {
  /** @type {RedisHttpCommand<UpdateListKeyElementCommandInput, UpdateListKeyElementCommandOutput>['toRequestParams']} */
  toRequestParams(params) {
    return post(`/key/list/_update`, params);
  }
}
