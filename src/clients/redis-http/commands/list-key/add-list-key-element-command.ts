import { post } from '../../../../lib/request/request-params-builder.js';
import { RedisHttpCommand } from '../../lib/redis-http-command.js';
import type {
  AddListKeyElementCommandInput,
  AddListKeyElementCommandOutput,
} from './add-list-key-element-command.types.js';

/**
 * Add a new element to a `list` key
 *
 * @endpoint [POST] /key/list/_push
 * @group ListKey
 */
export class AddListKeyElementCommand extends RedisHttpCommand<
  AddListKeyElementCommandInput,
  AddListKeyElementCommandOutput
> {
  toRequestParams(params: AddListKeyElementCommandInput) {
    return post(`/key/list/_push`, params);
  }
}
