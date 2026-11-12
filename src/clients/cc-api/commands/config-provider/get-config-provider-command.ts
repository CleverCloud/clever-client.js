import { get } from '../../../../lib/request/request-params-builder.ts';
import { safeUrl, sortBy } from '../../../../lib/utils.ts';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.ts';
import type { IdResolve } from '../../types/resource-id-resolver.types.ts';
import type {
  GetConfigProviderCommandInput,
  GetConfigProviderCommandOutput,
} from './get-config-provider-command.types.ts';

/**
 * Reads the configuration a Config Provider add-on hands to the applications linked to it.
 *
 * @endpoint [GET] /v4/addon-providers/config-provider/addons/:XXX/env
 * @group ConfigProvider
 * @version 4
 */
export class GetConfigProviderCommand extends CcApiSimpleCommand<
  GetConfigProviderCommandInput,
  GetConfigProviderCommandOutput
> {
  toRequestParams(params: GetConfigProviderCommandInput) {
    return get(safeUrl`/v4/addon-providers/config-provider/addons/${params.addonId}/env`);
  }

  transformCommandOutput(response: unknown): GetConfigProviderCommandOutput {
    return sortBy(response as GetConfigProviderCommandOutput, 'name');
  }

  getIdsToResolve(): IdResolve {
    return {
      addonId: 'REAL_ADDON_ID',
    };
  }

  isIdempotent(): boolean {
    return true;
  }
}
