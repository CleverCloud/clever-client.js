/**
 * @import { GetStringKeyCommandInput, GetStringKeyCommandOutput } from './get-string-key-command.types.js';
 */
import { post } from '../../../../lib/request/request-params-builder.js';
import { RedisHttpCommand } from '../../lib/redis-http-command.js';

/**
 * Get the value of a `string` key
 *
 * @extends {RedisHttpCommand<GetStringKeyCommandInput, GetStringKeyCommandOutput>}
 * @endpoint [POST] /key/string/_get
 * @group StringKey
 */
export class GetStringKeyCommand extends RedisHttpCommand {
  /** @type {RedisHttpCommand<GetStringKeyCommandInput, GetStringKeyCommandOutput>['toRequestParams']} */
  toRequestParams(params) {
    return post(`/key/string/_get`, params);
  }
}
