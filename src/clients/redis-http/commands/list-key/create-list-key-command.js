/**
 * @import { CreateListKeyCommandInput, CreateListKeyCommandOutput } from './create-list-key-command.types.js';
 */
import { post } from '../../../../lib/request/request-params-builder.js';
import { RedisHttpCommand } from '../../lib/redis-http-command.js';

/**
 * Create a new `list` key
 *
 * @extends {RedisHttpCommand<CreateListKeyCommandInput, CreateListKeyCommandOutput>}
 * @endpoint [POST] /key/list/_create
 * @group ListKey
 */
export class CreateListKeyCommand extends RedisHttpCommand {
  /** @type {RedisHttpCommand<CreateListKeyCommandInput, CreateListKeyCommandOutput>['toRequestParams']} */
  toRequestParams(params) {
    return post(`/key/list/_create`, params);
  }
}
