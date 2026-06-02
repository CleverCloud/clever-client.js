import { post } from '../../../../lib/request/request-params-builder.js';
import { RedisHttpCommand } from '../../lib/redis-http-command.js';
import type { CreateListKeyCommandInput, CreateListKeyCommandOutput } from './create-list-key-command.types.js';

/**
 * Create a new `list` key
 *
 * @endpoint [POST] /key/list/_create
 * @group ListKey
 */
export class CreateListKeyCommand extends RedisHttpCommand<CreateListKeyCommandInput, CreateListKeyCommandOutput> {
  toRequestParams(params: CreateListKeyCommandInput) {
    return post(`/key/list/_create`, params);
  }
}
