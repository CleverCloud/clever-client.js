/**
 * @import { CreateStringKeyCommandInput, CreateStringKeyCommandOutput } from './create-string-key-command.types.js';
 */
import { post } from '../../../../lib/request/request-params-builder.js';
import { RedisHttpCommand } from '../../lib/redis-http-command.js';

/**
 * Create a new `string` key
 *
 * @extends {RedisHttpCommand<CreateStringKeyCommandInput, CreateStringKeyCommandOutput>}
 * @endpoint [POST] /key/string/_create
 * @group StringKey
 */
export class CreateStringKeyCommand extends RedisHttpCommand {
  /** @type {RedisHttpCommand<CreateStringKeyCommandInput, CreateStringKeyCommandOutput>['toRequestParams']} */
  toRequestParams(params) {
    return post(`/key/string/_create`, params);
  }
}
