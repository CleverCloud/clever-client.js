import { post } from '../../../../lib/request/request-params-builder.js';
import { RedisHttpCommand } from '../../lib/redis-http-command.js';
import type {
  SetHashKeyElementCommandInput,
  SetHashKeyElementCommandOutput,
} from './set-hash-key-element-command.types.js';

/**
 * Add or update a field of a `hash` key
 *
 * @endpoint [POST] /key/hash/_set
 * @group HashKey
 */
export class SetHashKeyElementCommand extends RedisHttpCommand<
  SetHashKeyElementCommandInput,
  SetHashKeyElementCommandOutput
> {
  toRequestParams(params: SetHashKeyElementCommandInput) {
    return post(`/key/hash/_set`, params);
  }
}
