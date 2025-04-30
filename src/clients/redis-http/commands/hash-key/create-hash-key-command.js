/**
 * @import { CreateHashKeyCommandInput, CreateHashKeyCommandOutput } from './create-hash-key-command.types.js';
 */
import { post } from '../../../../lib/request/request-params-builder.js';
import { RedisHttpCommand } from '../../lib/redis-http-command.js';

/**
 * Create a new `hash` key
 *
 * @extends {RedisHttpCommand<CreateHashKeyCommandInput, CreateHashKeyCommandOutput>}
 * @endpoint [POST] /key/hash/_create
 * @group HashKey
 */
export class CreateHashKeyCommand extends RedisHttpCommand {
  /** @type {RedisHttpCommand<CreateHashKeyCommandInput, CreateHashKeyCommandOutput>['toRequestParams']} */
  toRequestParams(params) {
    return post(`/key/hash/_create`, params);
  }
}
