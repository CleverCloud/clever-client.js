/**
 * @import { GetListKeyElementCommandInput, GetListKeyElementCommandOutput } from './get-list-key-element-command.types.js';
 */
import { post } from '../../../../lib/request/request-params-builder.js';
import { RedisHttpCommand } from '../../lib/redis-http-command.js';

/**
 * Get the element of a `list` key at a given index
 *
 * @extends {RedisHttpCommand<GetListKeyElementCommandInput, GetListKeyElementCommandOutput>}
 * @endpoint [POST] /key/list/_get
 * @group ListKey
 */
export class GetListKeyElementCommand extends RedisHttpCommand {
  /** @type {RedisHttpCommand<GetListKeyElementCommandInput, GetListKeyElementCommandOutput>['toRequestParams']} */
  toRequestParams(params) {
    return post(`/key/list/_get`, params);
  }
}
