import { post } from '../../../../lib/request/request-params-builder.js';
import { RedisHttpCommand } from '../../lib/redis-http-command.js';
import type { CreateSetKeyCommandInput, CreateSetKeyCommandOutput } from './create-set-key-command.types.js';

/**
 * Create a new `set` key
 *
 * @endpoint [POST] /key/set/_create
 * @group SetKey
 */
export class CreateSetKeyCommand extends RedisHttpCommand<CreateSetKeyCommandInput, CreateSetKeyCommandOutput> {
  toRequestParams(params: CreateSetKeyCommandInput) {
    return post(`/key/set/_create`, params);
  }
}
