import { post } from '../../../../lib/request/request-params-builder.ts';
import { safeUrl } from '../../../../lib/utils.ts';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.ts';
import type { IdResolve } from '../../types/resource-id-resolver.types.ts';
import type {
  CreateOtoroshiNetworkGroupCommandInput,
  CreateOtoroshiNetworkGroupCommandOutput,
} from './create-otoroshi-network-group-command.types.ts';
import { transformOtoroshiInfo } from './otoroshi-transform.ts';

/**
 * Puts a Otoroshi add-on behind a network group, so it is only reachable from the peers of that
 * private network instead of the public internet.
 *
 * @endpoint [POST] /v4/addon-providers/addon-otoroshi/addons/:XXX/networkgroup
 * @group Otoroshi
 * @version 4
 */
export class CreateOtoroshiNetworkGroupCommand extends CcApiSimpleCommand<
  CreateOtoroshiNetworkGroupCommandInput,
  CreateOtoroshiNetworkGroupCommandOutput
> {
  toRequestParams(params: CreateOtoroshiNetworkGroupCommandInput) {
    return post(safeUrl`/v4/addon-providers/addon-otoroshi/addons/${params.addonId}/networkgroup`);
  }

  getIdsToResolve(): IdResolve {
    return {
      addonId: 'REAL_ADDON_ID',
    };
  }

  transformCommandOutput(response: unknown): CreateOtoroshiNetworkGroupCommandOutput {
    return transformOtoroshiInfo(response);
  }

  // every call allocates a new network group id, so a replay leaves the previous one behind and restarts the add-on
  isIdempotent(): boolean {
    return false;
  }
}
