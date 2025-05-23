/**
 * @import { AddListKeyElementCommandInput, AddListKeyElementCommandOutput } from './add-list-key-element-command.types.js';
 */
import { post } from '../../../../lib/request/request-params-builder.js';
import { RedisHttpCommand } from '../../lib/redis-http-command.js';

/**
 *
 * @extends {RedisHttpCommand<AddListKeyElementCommandInput, AddListKeyElementCommandOutput>}
 * @endpoint [POST] /key/list/_push
 * @group ListKey
 */
export class AddListKeyElementCommand extends RedisHttpCommand {
  /** @type {RedisHttpCommand<AddListKeyElementCommandInput, AddListKeyElementCommandOutput>['toRequestParams']} */
  toRequestParams(params) {
    return post(`/key/list/_push`, {});
  }
}
