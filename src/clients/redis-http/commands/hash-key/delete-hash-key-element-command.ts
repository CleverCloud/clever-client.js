import { post } from '../../../../lib/request/request-params-builder.ts';
import { RedisHttpCommand } from '../../lib/redis-http-command.ts';
import type {
  DeleteHashKeyElementCommandInput,
  DeleteHashKeyElementCommandOutput,
} from './delete-hash-key-element-command.types.ts';

/**
 * Delete a field of a `hash` key
 *
 * @endpoint [POST] /key/hash/_delete
 * @group HashKey
 */
export class DeleteHashKeyElementCommand extends RedisHttpCommand<
  DeleteHashKeyElementCommandInput,
  DeleteHashKeyElementCommandOutput
> {
  toRequestParams(params: DeleteHashKeyElementCommandInput) {
    return post(`/key/hash/_delete`, params);
  }

  // `HDEL` on a field: the second call removes nothing more and answers `wasDeleted: false`
  isIdempotent(): boolean {
    return true;
  }
}
