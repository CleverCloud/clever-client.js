import { post } from '../../../../lib/request/request-params-builder.js';
import { RedisHttpCommand } from '../../lib/redis-http-command.js';
import type {
  DeleteHashKeyElementCommandInput,
  DeleteHashKeyElementCommandOutput,
} from './delete-hash-key-element-command.types.js';

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
}
