/**
 * @import { DeleteHashKeyElementCommandInput, DeleteHashKeyElementCommandOutput } from './delete-hash-key-element-command.types.js';
 */
import { post } from '../../../../lib/request/request-params-builder.js';
import { RedisHttpCommand } from '../../lib/redis-http-command.js';

/**
 * Delete a field of a `hash` key
 *
 * @extends {RedisHttpCommand<DeleteHashKeyElementCommandInput, DeleteHashKeyElementCommandOutput>}
 * @endpoint [POST] /key/hash/_delete
 * @group HashKey
 */
export class DeleteHashKeyElementCommand extends RedisHttpCommand {
  /** @type {RedisHttpCommand<DeleteHashKeyElementCommandInput, DeleteHashKeyElementCommandOutput>['toRequestParams']} */
  toRequestParams(params) {
    return post(`/key/hash/_delete`, params);
  }
}
