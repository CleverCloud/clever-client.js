import { post } from '../../../../lib/request/request-params-builder.js';
import { RedisHttpCommand } from '../../lib/redis-http-command.js';
import type { UpdateStringKeyCommandInput, UpdateStringKeyCommandOutput } from './update-string-key-command.types.js';

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
}
