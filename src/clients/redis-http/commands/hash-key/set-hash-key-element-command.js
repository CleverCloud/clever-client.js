/**
 * @import { SetHashKeyElementCommandInput, SetHashKeyElementCommandOutput } from './set-hash-key-element-command.types.js';
 */
import { post } from '../../../../lib/request/request-params-builder.js';
import { RedisHttpCommand } from '../../lib/redis-http-command.js';

/**
 * Add or update a field of a `hash` key
 *
 * @extends {RedisHttpCommand<SetHashKeyElementCommandInput, SetHashKeyElementCommandOutput>}
 * @endpoint [POST] /key/hash/_set
 * @group HashKey
 */
export class SetHashKeyElementCommand extends RedisHttpCommand {
  /** @type {RedisHttpCommand<SetHashKeyElementCommandInput, SetHashKeyElementCommandOutput>['toRequestParams']} */
  toRequestParams(params) {
    return post(`/key/hash/_set`, params);
  }
}
