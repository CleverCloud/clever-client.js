import { post } from '../../../../lib/request/request-params-builder.js';
import { RedisHttpCommand } from '../../lib/redis-http-command.js';
import type { ScanKeyCommandInput, ScanKeyCommandOutput } from './scan-key-command.types.js';

/**
 * Scan keys
 *
 * @endpoint [POST] /keys/_scan
 * @group Key
 */
export class ScanKeyCommand extends RedisHttpCommand<ScanKeyCommandInput, ScanKeyCommandOutput> {
  toRequestParams(params: ScanKeyCommandInput) {
    return post(`/keys/_scan`, params);
  }
}
