/**
 * @import { ScanHashKeyCommandInput, ScanHashKeyCommandOutput } from './scan-hash-key-command.types.js';
 */
import { post } from '../../../../lib/request/request-params-builder.js';
import { RedisHttpCommand } from '../../lib/redis-http-command.js';

/**
 * Scan the elements of a `hash` key
 *
 * @extends {RedisHttpCommand<ScanHashKeyCommandInput, ScanHashKeyCommandOutput>}
 * @endpoint [POST] /key/hash/_scan
 * @group HashKey
 */
export class ScanHashKeyCommand extends RedisHttpCommand {
  /** @type {RedisHttpCommand<ScanHashKeyCommandInput, ScanHashKeyCommandOutput>['toRequestParams']} */
  toRequestParams(params) {
    return post(`/key/hash/_scan`, params);
  }
}
