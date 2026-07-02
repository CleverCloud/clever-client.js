import { post } from '../../../../lib/request/request-params-builder.js';
import { RedisHttpCommand } from '../../lib/redis-http-command.js';
import type {
  UpdateListKeyElementCommandInput,
  UpdateListKeyElementCommandOutput,
} from './update-list-key-element-command.types.js';

/**
 * Update an element of a `list` key
 *
 * @endpoint [POST] /key/list/_update
 * @group ListKey
 */
export class UpdateListKeyElementCommand extends RedisHttpCommand<
  UpdateListKeyElementCommandInput,
  UpdateListKeyElementCommandOutput
> {
  toRequestParams(params: UpdateListKeyElementCommandInput) {
    return post(`/key/list/_update`, params);
  }
}
