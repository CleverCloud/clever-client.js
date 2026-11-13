import { post } from '../../../../lib/request/request-params-builder.ts';
import { RedisHttpCommand } from '../../lib/redis-http-command.ts';
import type {
  DeleteSetKeyElementCommandInput,
  DeleteSetKeyElementCommandOutput,
} from './delete-set-key-element-command.types.ts';

/**
 * Deletes a member from a `set` key
 *
 * @endpoint [POST] /key/set/_delete
 * @group SetKey
 */
export class DeleteSetKeyElementCommand extends RedisHttpCommand<
  DeleteSetKeyElementCommandInput,
  DeleteSetKeyElementCommandOutput
> {
  toRequestParams(params: DeleteSetKeyElementCommandInput) {
    return post(`/key/set/_delete`, params);
  }

  // `SREM` of one member: the second call removes nothing more
  isIdempotent(): boolean {
    return true;
  }
}
