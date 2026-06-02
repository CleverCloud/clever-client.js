import { HeadersBuilder } from '../../../../lib/request/headers-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import type { CcRequestParams } from '../../../../types/request.types.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import type { IdResolve } from '../../types/resource-id-resolver.types.js';
import type {
  GetOtoroshiConfigCommandInput,
  GetOtoroshiConfigCommandOutput,
} from './get-otoroshi-config-command.types.js';

/**
 * @endpoint [GET] /v4/addon-providers/addon-otoroshi/addons/:XXX/config.yaml
 * @group Otoroshi
 * @version 4
 */
export class GetOtoroshiConfigCommand extends CcApiSimpleCommand<
  GetOtoroshiConfigCommandInput,
  GetOtoroshiConfigCommandOutput
> {
  toRequestParams(params: GetOtoroshiConfigCommandInput): Partial<CcRequestParams> {
    return {
      method: 'GET',
      url: safeUrl`/v4/addon-providers/addon-otoroshi/addons/${params.addonId}/config.yaml`,
      headers: new HeadersBuilder().accept('application/yaml').build(),
    };
  }

  getIdsToResolve(): IdResolve {
    return {
      addonId: 'REAL_ADDON_ID',
    };
  }

  transformCommandOutput(response: unknown): GetOtoroshiConfigCommandOutput {
    if (typeof response === 'string') {
      return response;
    }
    // The response body is read asynchronously; the command runner awaits this value.
    return (response as Response).text() as unknown as GetOtoroshiConfigCommandOutput;
  }
}
