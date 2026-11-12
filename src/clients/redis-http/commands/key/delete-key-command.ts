import { post } from '../../../../lib/request/request-params-builder.ts';
import { RedisHttpCommand } from '../../lib/redis-http-command.ts';
import type { DeleteKeyCommandInput, DeleteKeyCommandOutput } from './delete-key-command.types.ts';

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

  // `DEL`: the second call removes nothing more and answers `wasDeleted: false`
  isIdempotent(): boolean {
    return true;
  }
}
