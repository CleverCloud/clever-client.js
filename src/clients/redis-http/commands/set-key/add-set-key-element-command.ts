import { post } from '../../../../lib/request/request-params-builder.js';
import { RedisHttpCommand } from '../../lib/redis-http-command.js';
import type {
  AddSetKeyElementCommandInput,
  AddSetKeyElementCommandOutput,
} from './add-set-key-element-command.types.js';

/**
 * Add a member to a `set` key
 *
 * @endpoint [POST] /key/set/_set
 * @group SetKey
 */
export class AddSetKeyElementCommand extends RedisHttpCommand<
  AddSetKeyElementCommandInput,
  AddSetKeyElementCommandOutput
> {
  toRequestParams(params: AddSetKeyElementCommandInput) {
    return post(`/key/set/_set`, params);
  }
}
