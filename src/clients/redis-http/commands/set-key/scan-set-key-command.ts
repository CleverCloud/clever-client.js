import { post } from '../../../../lib/request/request-params-builder.js';
import { RedisHttpCommand } from '../../lib/redis-http-command.js';
import type { ScanSetKeyCommandInput, ScanSetKeyCommandOutput } from './scan-set-key-command.types.js';

/**
 * Scan the members of a `set` key
 *
 * @endpoint [POST] /key/set/_scan
 * @group SetKey
 */
export class ScanSetKeyCommand extends RedisHttpCommand<ScanSetKeyCommandInput, ScanSetKeyCommandOutput> {
  toRequestParams(params: ScanSetKeyCommandInput) {
    return post(`/key/set/_scan`, params);
  }
}
