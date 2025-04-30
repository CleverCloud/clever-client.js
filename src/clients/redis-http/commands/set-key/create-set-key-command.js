/**
 * @import { CreateSetKeyCommandInput, CreateSetKeyCommandOutput } from './create-set-key-command.types.js';
 */
import { post } from '../../../../lib/request/request-params-builder.js';
import { RedisHttpCommand } from '../../lib/redis-http-command.js';

/**
 * Create a new `set` key
 *
 * @extends {RedisHttpCommand<CreateSetKeyCommandInput, CreateSetKeyCommandOutput>}
 * @endpoint [POST] /key/set/_create
 * @group SetKey
 */
export class CreateSetKeyCommand extends RedisHttpCommand {
  /** @type {RedisHttpCommand<CreateSetKeyCommandInput, CreateSetKeyCommandOutput>['toRequestParams']} */
  toRequestParams(params) {
    return post(`/key/set/_create`, params);
  }
}
