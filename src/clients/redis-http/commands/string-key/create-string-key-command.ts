import { post } from '../../../../lib/request/request-params-builder.js';
import { RedisHttpCommand } from '../../lib/redis-http-command.js';
import type { CreateStringKeyCommandInput, CreateStringKeyCommandOutput } from './create-string-key-command.types.js';

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
}
