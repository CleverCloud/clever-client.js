import { post } from '../../../../lib/request/request-params-builder.ts';
import { RedisHttpCommand } from '../../lib/redis-http-command.ts';
import type { GetStringKeyCommandInput, GetStringKeyCommandOutput } from './get-string-key-command.types.ts';

/**
 * Get the value of a `string` key
 *
 * @endpoint [POST] /key/string/_get
 * @group StringKey
 */
export class GetStringKeyCommand extends RedisHttpCommand<GetStringKeyCommandInput, GetStringKeyCommandOutput> {
  toRequestParams(params: GetStringKeyCommandInput) {
    return post(`/key/string/_get`, params);
  }

  // `GET`, a read behind a `POST`
  isIdempotent(): boolean {
    return true;
  }
}
