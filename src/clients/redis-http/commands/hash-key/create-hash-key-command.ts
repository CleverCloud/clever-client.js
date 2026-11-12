import { post } from '../../../../lib/request/request-params-builder.ts';
import { RedisHttpCommand } from '../../lib/redis-http-command.ts';
import type { CreateHashKeyCommandInput, CreateHashKeyCommandOutput } from './create-hash-key-command.types.ts';

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
