import { post } from '../../../../lib/request/request-params-builder.ts';
import { RedisHttpCommand } from '../../lib/redis-http-command.ts';
import type {
  SetHashKeyElementCommandInput,
  SetHashKeyElementCommandOutput,
} from './set-hash-key-element-command.types.ts';

/**
 * Add or update a field of a `hash` key
 *
 * @endpoint [POST] /key/hash/_set
 * @group HashKey
 */
export class SetHashKeyElementCommand extends RedisHttpCommand<
  SetHashKeyElementCommandInput,
  SetHashKeyElementCommandOutput
> {
  toRequestParams(params: SetHashKeyElementCommandInput) {
    return post(`/key/hash/_set`, params);
  }

  // `HSET` on one field: the second call writes the same value and answers `wasAdded: false`
  isIdempotent(): boolean {
    return true;
  }
}
