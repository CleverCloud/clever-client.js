import { get } from '../../../../lib/request/request-params-builder.js';
import { safeUrl, sortBy } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import type { IdResolve } from '../../types/resource-id-resolver.types.js';
import type {
  GetConfigProviderCommandInput,
  GetConfigProviderCommandOutput,
} from './get-config-provider-command.types.js';

/**
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

  getEmptyResponsePolicy(status: number) {
    return { isEmpty: status === 404 };
  }

  getIdsToResolve(): IdResolve {
    return {
      addonId: 'REAL_ADDON_ID',
    };
  }
}
