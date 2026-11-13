import { post } from '../../../../lib/request/request-params-builder.ts';
import { RedisHttpCommand } from '../../lib/redis-http-command.ts';
import type { CreateStringKeyCommandInput, CreateStringKeyCommandOutput } from './create-string-key-command.types.ts';

/**
 * Create a new `string` key
 *
 * @endpoint [POST] /key/string/_create
 * @group StringKey
 */
export class CreateStringKeyCommand extends RedisHttpCommand<
  CreateStringKeyCommandInput,
  CreateStringKeyCommandOutput
> {
  toRequestParams(params: CreateStringKeyCommandInput) {
    return post(`/key/string/_create`, params);
  }

  // `SET NX`, so a replay is refused rather than overwriting
  isIdempotent(): boolean {
    return true;
  }
}
