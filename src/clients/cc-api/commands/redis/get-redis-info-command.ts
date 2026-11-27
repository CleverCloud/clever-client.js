import { get } from '../../../../lib/request/request-params-builder.ts';
import { safeUrl } from '../../../../lib/utils.ts';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.ts';
import type { IdResolve } from '../../types/resource-id-resolver.types.ts';
import type { GetRedisInfoCommandInput, GetRedisInfoCommandOutput } from './get-redis-info-command.types.ts';
import { transformRedisInfo } from './redis-transform.ts';

/**
 * Retrieves the details of a Redis add-on: its version, plan, zone, status and role, the port it listens on, and its features.
 * The provider leaves the host and the password out.
 *
 * @endpoint [GET] /v4/addon-providers/redis-addon/addons/:XXX
 * @group Redis
 * @version 4
 */
export class GetRedisInfoCommand extends CcApiSimpleCommand<GetRedisInfoCommandInput, GetRedisInfoCommandOutput> {
  toRequestParams(params: GetRedisInfoCommandInput) {
    // The Redis provider looks its add-ons up by the add-on id first, the real id being only its fallback.
    return get(safeUrl`/v4/addon-providers/redis-addon/addons/${params.addonId}`);
  }

  transformCommandOutput(response: unknown): GetRedisInfoCommandOutput {
    return transformRedisInfo(response);
  }

  getIdsToResolve(): IdResolve {
    return {
      addonId: 'ADDON_ID',
    };
  }

  isIdempotent(): boolean {
    return true;
  }
}
