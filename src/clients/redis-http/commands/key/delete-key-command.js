/**
 * @import { DeleteKeyCommandInput, DeleteKeyCommandOutput } from './delete-key-command.types.js';
 */
import { post } from '../../../../lib/request/request-params-builder.js';
import { RedisHttpCommand } from '../../lib/redis-http-command.js';

/**
 * Delete a key
 *
 * @extends {RedisHttpCommand<DeleteKeyCommandInput, DeleteKeyCommandOutput>}
 * @endpoint [POST] /key/_delete
 * @group Key
 */
export class DeleteKeyCommand extends RedisHttpCommand {
  /** @type {RedisHttpCommand<DeleteKeyCommandInput, DeleteKeyCommandOutput>['toRequestParams']} */
  toRequestParams(params) {
    return post(`/key/_delete`, params);
  }
}
