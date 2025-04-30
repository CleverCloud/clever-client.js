/**
 * @import { UpdateStringKeyCommandInput, UpdateStringKeyCommandOutput } from './update-string-key-command.types.js';
 */
import { post } from '../../../../lib/request/request-params-builder.js';
import { RedisHttpCommand } from '../../lib/redis-http-command.js';

/**
 * Updates an existing `string` key
 *
 * @extends {RedisHttpCommand<UpdateStringKeyCommandInput, UpdateStringKeyCommandOutput>}
 * @endpoint [POST] /key/string/_update
 * @group StringKey
 */
export class UpdateStringKeyCommand extends RedisHttpCommand {
  /** @type {RedisHttpCommand<UpdateStringKeyCommandInput, UpdateStringKeyCommandOutput>['toRequestParams']} */
  toRequestParams(params) {
    return post(`/key/string/_update`, params);
  }
}
