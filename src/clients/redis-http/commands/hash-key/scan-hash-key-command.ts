import { post } from '../../../../lib/request/request-params-builder.js';
import { RedisHttpCommand } from '../../lib/redis-http-command.js';
import type { ScanHashKeyCommandInput, ScanHashKeyCommandOutput } from './scan-hash-key-command.types.js';

/**
 * Scan the elements of a `hash` key
 *
 * @endpoint [POST] /key/hash/_scan
 * @group HashKey
 */
export class ScanHashKeyCommand extends RedisHttpCommand<ScanHashKeyCommandInput, ScanHashKeyCommandOutput> {
  toRequestParams(params: ScanHashKeyCommandInput) {
    return post(`/key/hash/_scan`, params);
  }
}
