import { post } from '../../../../lib/request/request-params-builder.ts';
import { RedisHttpCommand } from '../../lib/redis-http-command.ts';
import type { ScanSetKeyCommandInput, ScanSetKeyCommandOutput } from './scan-set-key-command.types.ts';

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

  // `SSCAN`, a read behind a `POST`
  isIdempotent(): boolean {
    return true;
  }
}
