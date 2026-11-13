import { post } from '../../../../lib/request/request-params-builder.ts';
import { RedisHttpCommand } from '../../lib/redis-http-command.ts';
import type { ScanHashKeyCommandInput, ScanHashKeyCommandOutput } from './scan-hash-key-command.types.ts';

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

  // `HSCAN`, a read behind a `POST`
  isIdempotent(): boolean {
    return true;
  }
}
