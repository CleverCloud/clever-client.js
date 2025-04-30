/**
 * @import { ScanSetKeyCommandInput, ScanSetKeyCommandOutput } from './scan-set-key-command.types.js';
 */
import { post } from '../../../../lib/request/request-params-builder.js';
import { RedisHttpCommand } from '../../lib/redis-http-command.js';

/**
 * Scan the members of a `set` key
 *
 * @extends {RedisHttpCommand<ScanSetKeyCommandInput, ScanSetKeyCommandOutput>}
 * @endpoint [POST] /key/set/_scan
 * @group SetKey
 */
export class ScanSetKeyCommand extends RedisHttpCommand {
  /** @type {RedisHttpCommand<ScanSetKeyCommandInput, ScanSetKeyCommandOutput>['toRequestParams']} */
  toRequestParams(params) {
    return post(`/key/set/_scan`, params);
  }
}
