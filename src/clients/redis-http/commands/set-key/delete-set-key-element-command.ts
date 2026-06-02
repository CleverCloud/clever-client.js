import { post } from '../../../../lib/request/request-params-builder.js';
import { RedisHttpCommand } from '../../lib/redis-http-command.js';
import type {
  DeleteSetKeyElementCommandInput,
  DeleteSetKeyElementCommandOutput,
} from './delete-set-key-element-command.types.js';

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
}
