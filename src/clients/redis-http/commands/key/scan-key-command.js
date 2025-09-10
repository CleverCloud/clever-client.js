/**
 * @import { ScanKeyCommandInput, ScanKeyCommandOutput } from './scan-key-command.types.js';
 */
import { post } from '../../../../lib/request/request-params-builder.js';
import { RedisHttpCommand } from '../../lib/redis-http-command.js';

/**
 * Scan keys
 *
 * @extends {RedisHttpCommand<ScanKeyCommandInput, ScanKeyCommandOutput>}
 * @endpoint [POST] /keys/_scan
 * @group Key
 */
export class ScanKeyCommand extends RedisHttpCommand {
  /** @type {RedisHttpCommand<ScanKeyCommandInput, ScanKeyCommandOutput>['toRequestParams']} */
  toRequestParams(params) {
    return post(`/keys/_scan`, params);
  }
}
