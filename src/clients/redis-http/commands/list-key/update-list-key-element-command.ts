import { post } from '../../../../lib/request/request-params-builder.ts';
import { RedisHttpCommand } from '../../lib/redis-http-command.ts';
import type {
  UpdateListKeyElementCommandInput,
  UpdateListKeyElementCommandOutput,
} from './update-list-key-element-command.types.ts';

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

  // `LSET` at an index: the second call writes the same value at the same place
  isIdempotent(): boolean {
    return true;
  }
}
