import { post } from '../../../../lib/request/request-params-builder.ts';
import { RedisHttpCommand } from '../../lib/redis-http-command.ts';
import type { ScanKeyCommandInput, ScanKeyCommandOutput } from './scan-key-command.types.ts';

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

  // `SCAN`, a read behind a `POST`
  isIdempotent(): boolean {
    return true;
  }
}
