import { post } from '../../../../lib/request/request-params-builder.ts';
import { RedisHttpCommand } from '../../lib/redis-http-command.ts';
import type { UpdateStringKeyCommandInput, UpdateStringKeyCommandOutput } from './update-string-key-command.types.ts';

/**
 * Updates an existing `string` key
 *
 * @endpoint [POST] /key/string/_update
 * @group StringKey
 */
export class UpdateStringKeyCommand extends RedisHttpCommand<
  UpdateStringKeyCommandInput,
  UpdateStringKeyCommandOutput
> {
  toRequestParams(params: UpdateStringKeyCommandInput) {
    return post(`/key/string/_update`, params);
  }

  // `SET XX`: the second call writes the same value
  isIdempotent(): boolean {
    return true;
  }
}
