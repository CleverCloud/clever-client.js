import { post } from '../../../../lib/request/request-params-builder.js';
import { RedisHttpCommand } from '../../lib/redis-http-command.js';
import type { DeleteKeyCommandInput, DeleteKeyCommandOutput } from './delete-key-command.types.js';

/**
 * Delete a key
 *
 * @endpoint [POST] /key/_delete
 * @group Key
 */
export class DeleteKeyCommand extends RedisHttpCommand<DeleteKeyCommandInput, DeleteKeyCommandOutput> {
  toRequestParams(params: DeleteKeyCommandInput) {
    return post(`/key/_delete`, params);
  }
}
