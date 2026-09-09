import { post } from '../../../../lib/request/request-params-builder.js';
import { RedisHttpCommand } from '../../lib/redis-http-command.js';
import type { CreateHashKeyCommandInput, CreateHashKeyCommandOutput } from './create-hash-key-command.types.js';

/**
 * Create a new `hash` key
 *
 * @endpoint [POST] /key/hash/_create
 * @group HashKey
 */
export class CreateHashKeyCommand extends RedisHttpCommand<CreateHashKeyCommandInput, CreateHashKeyCommandOutput> {
  toRequestParams(params: CreateHashKeyCommandInput) {
    return post(`/key/hash/_create`, params);
  }

  // `HSET` on the same fields, behind an existence check: a replay is refused and stores nothing more
  isIdempotent(): boolean {
    return true;
  }
}
