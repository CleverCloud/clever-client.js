import { post } from '../../../../lib/request/request-params-builder.js';
import { RedisHttpCommand } from '../../lib/redis-http-command.js';
import type {
  GetListKeyElementCommandInput,
  GetListKeyElementCommandOutput,
} from './get-list-key-element-command.types.js';

/**
 * Get the element of a `list` key at a given index
 *
 * @endpoint [POST] /key/list/_get
 * @group ListKey
 */
export class GetListKeyElementCommand extends RedisHttpCommand<
  GetListKeyElementCommandInput,
  GetListKeyElementCommandOutput
> {
  toRequestParams(params: GetListKeyElementCommandInput) {
    return post(`/key/list/_get`, params);
  }

  // `LINDEX`, a read behind a `POST`
  isIdempotent(): boolean {
    return true;
  }
}
