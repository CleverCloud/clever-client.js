import { post } from '../../../../lib/request/request-params-builder.ts';
import { RedisHttpCommand } from '../../lib/redis-http-command.ts';
import type { CreateListKeyCommandInput, CreateListKeyCommandOutput } from './create-list-key-command.types.ts';

/**
 * Create a new `list` key
 *
 * @endpoint [POST] /key/list/_create
 * @group ListKey
 */
export class CreateListKeyCommand extends RedisHttpCommand<CreateListKeyCommandInput, CreateListKeyCommandOutput> {
  toRequestParams(params: CreateListKeyCommandInput) {
    return post(`/key/list/_create`, params);
  }

  // `RPUSH` behind an existence check, so a replay is refused rather than appended a second time
  isIdempotent(): boolean {
    return true;
  }
}
