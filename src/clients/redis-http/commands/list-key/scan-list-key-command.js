/**
 * @import { ScanListKeyCommandInput, ScanListKeyCommandOutput } from './scan-list-key-command.types.js';
 */
import { post } from '../../../../lib/request/request-params-builder.js';
import { RedisHttpCommand } from '../../lib/redis-http-command.js';

/**
 * Scan the elements of a `list` key
 *
 * @extends {RedisHttpCommand<ScanListKeyCommandInput, ScanListKeyCommandOutput>}
 * @endpoint [POST] /key/list/_scan
 * @group ListKey
 */
export class ScanListKeyCommand extends RedisHttpCommand {
  /** @type {RedisHttpCommand<ScanListKeyCommandInput, ScanListKeyCommandOutput>['toRequestParams']} */
  toRequestParams(params) {
    return post(`/key/list/_scan`, params);
  }
}
