import { post } from '../../../../lib/request/request-params-builder.js';
import { RedisHttpCommand } from '../../lib/redis-http-command.js';
import type { ScanListKeyCommandInput, ScanListKeyCommandOutput } from './scan-list-key-command.types.js';

/**
 * Scan the elements of a `list` key
 *
 * @endpoint [POST] /key/list/_scan
 * @group ListKey
 */
export class ScanListKeyCommand extends RedisHttpCommand<ScanListKeyCommandInput, ScanListKeyCommandOutput> {
  toRequestParams(params: ScanListKeyCommandInput) {
    return post(`/key/list/_scan`, params);
  }
}
